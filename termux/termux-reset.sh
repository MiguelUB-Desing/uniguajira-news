#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# UniGuajira News — Termux RESET + setup limpio
# Borra la configuración anterior y lo deja como nuevo.
#
# Uso en Termux:
#   wget -O termux-reset.sh https://raw.githubusercontent.com/MiguelUB-Desing/uniguajira-news/main/termux/termux-reset.sh
#   bash termux-reset.sh
# ============================================================
set -euo pipefail

REPO_URL="https://github.com/MiguelUB-Desing/uniguajira-news.git"
APP_DIR="${HOME}/uniguajira-news"
LOG_DIR="${HOME}/uniguajira-logs"
LOOP_LOG="${LOG_DIR}/loop.log"
SYNC_LOG="${LOG_DIR}/sync.log"
AIVEN_FILE="${HOME}/aiven-url.txt"
OLD_SCRIPTS=("${HOME}/termux-sync.sh" "${HOME}/termux-reset.sh.bak")

# ---- frecuencias ----
SYNC_EVERY_MIN="${SYNC_EVERY_MIN:-30}"
PING_EVERY_MIN="${PING_EVERY_MIN:-3}"
RENDER_URL="${RENDER_URL:-https://uniguajira-news.onrender.com/api/health}"

ts() { date '+%Y-%m-%d %H:%M:%S'; }
log() { echo "[$(ts)] $*" | tee -a "$LOOP_LOG"; }

echo "=== RESET: borrando configuración anterior ==="

# 1. Detener procesos viejos del proyecto
pkill -f 'node src/index.js' 2>/dev/null || true
pkill -f 'uniguajira-news' 2>/dev/null || true
sleep 1

# 2. Borrar repo, logs y configs previas
rm -rf "$APP_DIR"
rm -rf "$LOG_DIR"
rm -f "${HOME}/sync.log" "${HOME}/.env" 2>/dev/null || true
for f in "${OLD_SCRIPTS[@]}"; do rm -f "$f"; done

# OJO: NO borramos ~/aiven-url.txt si quieres conservar la contraseña.
# Si también quieres eso:
#   rm -f ~/aiven-url.txt
echo "  - repo, logs y scripts viejos eliminados"
echo "  - se conserva $AIVEN_FILE (si existe)"

mkdir -p "$LOG_DIR"

# ---- ENV por defecto (sin secreto de Aiven; va en aiven-url.txt) ----
export PORT="${PORT:-3000}"
export NODE_ENV="${NODE_ENV:-production}"
export DB_HOST="${DB_HOST:-localhost}"
export DB_PORT="${DB_PORT:-3306}"
export DB_USER="${DB_USER:-root}"
export DB_PASSWORD="${DB_PASSWORD:-}"
export DB_NAME="${DB_NAME:-uniguajira_news}"
export JWT_SECRET="${JWT_SECRET:-termux-dev-secret-cambia-en-prod}"
export CORS_ORIGIN="${CORS_ORIGIN:-*}"
export NEWS_STALE_MINUTES="${NEWS_STALE_MINUTES:-30}"
export SCRAPER_POSTS_PER_PAGE="${SCRAPER_POSTS_PER_PAGE:-50}"
export SCRAPER_MAX_PAGES="${SCRAPER_MAX_PAGES:-2}"
export SCRAPER_MAX_DETAIL_REQUESTS="${SCRAPER_MAX_DETAIL_REQUESTS:-30}"
export SCRAPER_DETAIL_CONCURRENCY="${SCRAPER_DETAIL_CONCURRENCY:-4}"

echo ""
echo "=== INSTALACIÓN ==="

# 3. Dependencias
echo "[1/5] Paquetes Termux…"
pkg update -y || true
pkg install -y nodejs-lts git curl
if command -v termux-wake-lock >/dev/null 2>&1; then
  termux-wake-lock || true
fi

# 4. Repo limpio
echo "[2/5] Clonando repo…"
git clone --depth 1 "$REPO_URL" "$APP_DIR"

# 5. npm
echo "[3/5] npm install…"
cd "$APP_DIR/server"
npm install --omit=dev

# 6. URL de Aiven
echo "[4/5] DATABASE_URL de Aiven…"
if [[ -f "$AIVEN_FILE" ]]; then
  echo "  Usando $AIVEN_FILE existente"
else
  echo "  Pega la URL completa (una línea):"
  echo "  mysql://avnadmin:PASSWORD@HOST:12622/uniguajira_news?ssl=true"
  read -r AIVEN_DATABASE_URL
  printf '%s\n' "$AIVEN_DATABASE_URL" > "$AIVEN_FILE"
  chmod 600 "$AIVEN_FILE"
fi
export AIVEN_DATABASE_URL="$(tr -d '[:space:]' < "$AIVEN_FILE")"
export DATABASE_URL="$AIVEN_DATABASE_URL"

# 7. .env del server
cat > "$APP_DIR/server/.env" <<EOF
PORT=${PORT}
NODE_ENV=${NODE_ENV}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
JWT_SECRET=${JWT_SECRET}
CORS_ORIGIN=${CORS_ORIGIN}
NEWS_STALE_MINUTES=${NEWS_STALE_MINUTES}
SCRAPER_POSTS_PER_PAGE=${SCRAPER_POSTS_PER_PAGE}
SCRAPER_MAX_PAGES=${SCRAPER_MAX_PAGES}
SCRAPER_MAX_DETAIL_REQUESTS=${SCRAPER_MAX_DETAIL_REQUESTS}
SCRAPER_DETAIL_CONCURRENCY=${SCRAPER_DETAIL_CONCURRENCY}
AIVEN_DATABASE_URL=${AIVEN_DATABASE_URL}
DATABASE_URL=${DATABASE_URL}
EOF
echo "  server/.env listo"

# 8. Bucle: sync + ping
sync_once() {
  log "Sync scrapeo → Aiven…"
  cd "$APP_DIR/server"
  if npm run sync >>"$SYNC_LOG" 2>&1; then
    log "Sync OK"
  else
    log "Sync FALLÓ → $SYNC_LOG"
  fi
}

ping_once() {
  cd "$APP_DIR/server"
  AIVEN_DATABASE_URL="$AIVEN_DATABASE_URL" node --input-type=module -e "
    const raw = process.env.AIVEN_DATABASE_URL || '';
    if (!raw.startsWith('mysql://')) { console.log('aiven-fail URL-vacia'); process.exit(0); }
    const u = new URL(raw);
    const cfg = {
      host: u.hostname,
      port: parseInt(u.port || '3306', 10),
      user: decodeURIComponent(u.username || ''),
      password: decodeURIComponent(u.password || ''),
      database: (u.pathname || '/').replace(/^\//, ''),
      ssl: u.searchParams.get('ssl') !== 'false' ? { rejectUnauthorized: false } : false,
      connectTimeout: 15000,
    };
    import('mysql2/promise').then(async ({ default: mysql }) => {
      try {
        const c = await mysql.createConnection(cfg);
        await c.query('SELECT 1');
        await c.end();
        console.log('aiven-ok ' + cfg.host);
      } catch (e) {
        console.log('aiven-fail', e.message);
      }
    });
  " 2>>"$LOOP_LOG" | sed "s/^/[aiven] /" | tee -a "$LOOP_LOG" >/dev/null

  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$RENDER_URL" || echo 000)
  log "[render] $code"
}

echo "[5/5] Sync inicial + ping…"
sync_once
ping_once

log "Bucle: sync cada ${SYNC_EVERY_MIN} min · ping cada ${PING_EVERY_MIN} min"
log "Logs: $LOOP_LOG · $SYNC_LOG"

next_sync=$(( $(date +%s) + SYNC_EVERY_MIN * 60 ))
next_ping=$(( $(date +%s) + PING_EVERY_MIN * 60 ))

while true; do
  now=$(date +%s)
  if (( now >= next_ping )); then
    ping_once
    next_ping=$(( now + PING_EVERY_MIN * 60 ))
  fi
  if (( now >= next_sync )); then
    sync_once
    next_sync=$(( now + SYNC_EVERY_MIN * 60 ))
  fi
  sleep 30
done
