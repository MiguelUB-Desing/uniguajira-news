#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# UniGuajira News — Termux mini-runner
# Solo: sync de noticias → Aiven + ping para no dormir
# El backend web (Render) y el frontend (Vercel) no corren aquí.
#
# Uso en Termux:
#   bash termux-sync.sh          # instala todo la primera vez
#   bash termux-sync.sh --run    # solo el bucle (tras instalar)
#   bash termux-sync.sh --once   # un sync inmediato y sale
# ============================================================
set -euo pipefail

REPO_URL="https://github.com/MiguelUB-Desing/uniguajira-news.git"
APP_DIR="${HOME}/uniguajira-news"
SERVER_DIR="${APP_DIR}/server"
LOG_DIR="${HOME}/uniguajira-logs"
LOOP_LOG="${LOG_DIR}/loop.log"
SYNC_LOG="${LOG_DIR}/sync.log"

# ---------- ENV (por si las necesitas copiar a mano) ----------
# Aiven: se guarda la primera vez en ~/aiven-url.txt (NO va en git)
AIVEN_FILE="${HOME}/aiven-url.txt"
if [[ -z "${AIVEN_DATABASE_URL:-}" ]]; then
  if [[ -f "$AIVEN_FILE" ]]; then
    AIVEN_DATABASE_URL="$(tr -d '[:space:]' < "$AIVEN_FILE")"
  else
    echo "Pega tu DATABASE_URL de Aiven (pestaña mysql de la consola):"
    echo "  mysql://avnadmin:PASSWORD@HOST:PUERTO/uniguajira_news?ssl=true"
    read -r AIVEN_DATABASE_URL
    printf '%s\n' "$AIVEN_DATABASE_URL" > "$AIVEN_FILE"
    chmod 600 "$AIVEN_FILE"
    echo "Guardado en $AIVEN_FILE"
  fi
fi
export AIVEN_DATABASE_URL
export DATABASE_URL="${AIVEN_DATABASE_URL}"

# Endpoints a mantener vivos (ping)
RENDER_URL="${RENDER_URL:-https://uniguajira-news.onrender.com/api/health}"

# Frecuencias (minutos)
SYNC_EVERY_MIN="${SYNC_EVERY_MIN:-30}"      # scrapeo portal → Aiven
PING_EVERY_MIN="${PING_EVERY_MIN:-3}"       # ping Aiven + Render (2–5 ok)

# Otras env disponibles si luego montas todo en el cel
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
# ---------------------------------------------------------------

ts() { date '+%Y-%m-%d %H:%M:%S'; }
log() { echo "[$(ts)] $*" | tee -a "$LOOP_LOG"; }

ensure_dirs() { mkdir -p "$LOG_DIR"; }

install_deps() {
  log "Instalando dependencias Termux (node, git, curl)…"
  pkg update -y || true
  pkg install -y nodejs-lts git curl
  # wake lock para que Android no mate el proceso
  if command -v termux-wake-lock >/dev/null 2>&1; then
    termux-wake-lock || true
    log "termux-wake-lock activo"
  fi
}

clone_or_update() {
  if [[ ! -d "$APP_DIR/.git" ]]; then
    log "Clonando repo…"
    git clone --depth 1 "$REPO_URL" "$APP_DIR"
  else
    log "Actualizando repo…"
    git -C "$APP_DIR" pull --ff-only || true
  fi
}

npm_install() {
  log "npm install en server/…"
  cd "$SERVER_DIR"
  npm install --omit=dev
}

write_env() {
  # .env local (no se sube a git) — por si corres el backend en el cel
  cat > "$SERVER_DIR/.env" <<EOF
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
  log "server/.env escrito"
}

ping_once() {
  # Ping Aiven: SELECT 1 vía node (mantiene el servicio free activo)
  (
    cd "$SERVER_DIR"
    node --input-type=module -e "
      import mysql from 'mysql2/promise';
      try {
        const c = await mysql.createConnection({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
          connectTimeout: 10000,
        });
        await c.query('SELECT 1');
        await c.end();
        console.log('aiven-ok');
      } catch (e) {
        console.log('aiven-fail', e.message);
      }
    " 2>>"$LOOP_LOG" | sed "s/^/[aiven] /" | tee -a "$LOOP_LOG"
  ) || true

  # Ping Render: si duerme, lo despierta (código 503/200 = vivo)
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$RENDER_URL" || echo 000)
  if [[ "$code" == "200" || "$code" == "503" ]]; then
    echo "[$(ts)] [render] alive ($code)" >>"$LOOP_LOG"
  else
    echo "[$(ts)] [render] fail ($code)" >>"$LOOP_LOG"
  fi
}

sync_once() {
  log "Sync scrapeo → Aiven…"
  cd "$SERVER_DIR"
  if npm run sync >>"$SYNC_LOG" 2>&1; then
    log "Sync OK (ver $SYNC_LOG)"
  else
    log "Sync FALLÓ (ver $SYNC_LOG)"
  fi
}

run_loop() {
  ensure_dirs
  log "Bucle iniciado: sync cada ${SYNC_EVERY_MIN} min · ping cada ${PING_EVERY_MIN} min"
  log "Logs: $LOOP_LOG · $SYNC_LOG"

  sync_once
  ping_once
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
}

main() {
  ensure_dirs
  case "${1:-}" in
    --once)
      install_deps
      clone_or_update
      npm_install
      write_env
      sync_once
      ;;
    --run)
      run_loop
      ;;
    *)
      install_deps
      clone_or_update
      npm_install
      write_env
      run_loop
      ;;
  esac
}

main "$@"
