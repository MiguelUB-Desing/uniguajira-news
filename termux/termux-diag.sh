#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# UniGuajira News — Diagnóstico completo (Termux)
# Verifica de una vez: dependencias, URL, Aiven, Render, sync, logs
#
# Uso:
#   wget -O termux-diag.sh https://raw.githubusercontent.com/MiguelUB-Desing/uniguajira-news/main/termux/termux-diag.sh
#   bash termux-diag.sh
# ============================================================

APP_DIR="${HOME}/uniguajira-news"
SERVER_DIR="${APP_DIR}/server"
AIVEN_FILE="${HOME}/aiven-url.txt"
LOG_DIR="${HOME}/uniguajira-logs"
RENDER_URL="${RENDER_URL:-https://uniguajira-news.onrender.com/api/health}"

OK="  ✅"
BAD="  ❌"
WARN="  ⚠️ "

section() { echo ""; echo "═══ $* ═══"; }

pass() { echo "${OK} $*"; }
fail() { echo "${BAD} $*"; FAILS=$((FAILS+1)); }
warn() { echo "${WARN} $*"; }

FAILS=0

# ---------- 1. Dependencias ----------
section "1. Dependencias"
command -v node >/dev/null 2>&1 && pass "node $(node -v)" || fail "node no instalado (pkg install nodejs-lts)"
command -v git  >/dev/null 2>&1 && pass "git $(git --version | awk '{print $3}')" || fail "git no instalado"
command -v curl >/dev/null 2>&1 && pass "curl ok" || fail "curl no instalado/roto (apt full-upgrade)"
command -v npm  >/dev/null 2>&1 && pass "npm $(npm -v)" || fail "npm no instalado"

# ---------- 2. Repositorio ----------
section "2. Repositorio"
if [[ -d "$APP_DIR/.git" ]]; then
  pass "repo en $APP_DIR"
  if [[ -f "$SERVER_DIR/package.json" ]]; then
    pass "server/package.json existe"
  else
    fail "server/package.json NO existe"
  fi
  if [[ -d "$SERVER_DIR/node_modules/mysql2" ]]; then
    pass "node_modules/mysql2 instalado"
  else
    fail "node_modules/mysql2 falta → cd $SERVER_DIR && npm install"
  fi
else
  fail "repo NO clonado → bash termux-sync.sh"
fi

# ---------- 3. URL de Aiven ----------
section "3. URL de Aiven (~/aiven-url.txt)"
AIVEN_URL=""
if [[ -f "$AIVEN_FILE" ]]; then
  # una sola línea, sin espacios
  AIVEN_URL="$(tr -d '[:space:]' < "$AIVEN_FILE")"
  LINES=$(wc -l < "$AIVEN_FILE")
  if [[ "$AIVEN_URL" =~ ^mysql://[^@]+@[^:]+:[0-9]+/[^?\ ]+ ]]; then
    pass "URL con formato válido (1 archivo, $LINES líneas)"
    # mostrar host/puerto/base sin exponer la clave
    HOSTPART="${AIVEN_URL#*@}"
    echo "       host: ${HOSTPART%%/*}  base: ${HOSTPART#*/}" | sed 's/?.*//'
    if [[ "$AIVEN_URL" == *"PASSWORD"* || "$AIVEN_URL" == *"CLAVE"* || "$AIVEN_URL" == *"defaultdb"* ]]; then
      fail "URL con placeholder o base incorrecta (debe ser /uniguajira_news)"
      AIVEN_URL=""
    else
      DBNAME="$(printf '%s' "$AIVEN_URL" | sed -E 's#^[^:]+://[^@]+@[^/]+/##; s#\?.*##')"
      if [[ "$DBNAME" == "uniguajira_news" ]]; then
        pass "base de datos: uniguajira_news"
      else
        fail "base es '$DBNAME' (debe ser uniguajira_news)"
        AIVEN_URL=""
      fi
    fi
  else
    fail "URL mal formada o en varias líneas → nano $AIVEN_FILE"
    AIVEN_URL=""
  fi
else
  fail "no existe $AIVEN_FILE"
fi

# ---------- 4. .env del server ----------
section "4. server/.env vs aiven-url.txt"
ENV_FILE="$SERVER_DIR/.env"
if [[ -f "$ENV_FILE" ]]; then
  ENV_URL="$(grep -E '^AIVEN_DATABASE_URL=' "$ENV_FILE" | head -1 | cut -d= -f2-)"
  ENV_URL="$(printf '%s' "$ENV_URL" | tr -d '[:space:]')"
  if [[ -n "$AIVEN_URL" && "$ENV_URL" == "$AIVEN_URL" ]]; then
    pass ".env coincide con aiven-url.txt"
  elif [[ -z "$ENV_URL" ]]; then
    fail ".env sin AIVEN_DATABASE_URL"
  else
    warn ".env DIFIERE de aiven-url.txt — el sync usa .env"
    echo "       .env:  ${ENV_URL:0:60}…"
    if [[ -n "$AIVEN_URL" ]]; then
      echo "       sincronizando…"
      sed -i "s|^AIVEN_DATABASE_URL=.*|AIVEN_DATABASE_URL=${AIVEN_URL}|" "$ENV_FILE"
      sed -i "s|^DATABASE_URL=.*|DATABASE_URL=${AIVEN_URL}|" "$ENV_FILE"
      pass ".env corregido"
    fi
  fi
else
  warn ".env no existe (si el sync funciona, no importa)"
fi
# el sync prefiere AIVEN_DATABASE_URL, si falta usa DATABASE_URL
[[ -z "$ENV_URL" && -n "$AIVEN_URL" ]] && {
  printf '\nAIVEN_DATABASE_URL=%s\nDATABASE_URL=%s\n' "$AIVEN_URL" "$AIVEN_URL" >> "$ENV_FILE"
  pass ".env creado con la URL de aiven-url.txt"
}

# ---------- 5. Conexión a Aiven ----------
section "5. Conexión a Aiven (ping SELECT 1)"
if [[ -n "$AIVEN_URL" && -d "$SERVER_DIR/node_modules/mysql2" ]]; then
  PING_OUT=$(cd "$SERVER_DIR" && AIVEN_DATABASE_URL="$AIVEN_URL" node --input-type=module -e "
    const url = process.env.AIVEN_DATABASE_URL;
    import('mysql2/promise').then(async ({default: mysql}) => {
      try {
        const c = await mysql.createConnection(url, {ssl:{rejectUnauthorized:false}, connectTimeout:15000});
        const [r] = await c.query('SELECT COUNT(*) n FROM noticias_cache');
        const [u] = await c.query('SELECT COUNT(*) n FROM usuarios');
        console.log('OK noticias_cache=' + r[0].n + ' usuarios=' + u[0].n);
        await c.end();
      } catch(e){ console.log('ERR ' + e.message); }
    });
  " 2>&1) || true
  if [[ "$PING_OUT" == OK* ]]; then
    pass "$PING_OUT"
  else
    fail "conexión falló: $PING_OUT"
    if [[ "$PING_OUT" == *"Access denied"* ]]; then
      echo "       → contraseña incorrecta o ROTADA"
      echo "         Consola Aiven → Users → avnadmin → Reset password"
      echo "       → pega la URI nueva en: nano $AIVEN_FILE"
    elif [[ "$PING_OUT" == *"ETIMEDOUT"* || "$PING_OUT" == *"ENOTFOUND"* ]]; then
      echo "       → Aiven apagado (free se suspende por inactividad)"
      echo "         Consola Aiven → Start service"
    fi
  fi
else
  fail "saltado (URL o mysql2 no disponibles)"
fi

# ---------- 6. Render ----------
section "6. Render (backend web)"
CODE=$(curl -sL -o /tmp/render-body.txt -w '%{http_code}' --max-time 25 "$RENDER_URL" || true)
[[ -z "$CODE" || "$CODE" == "000" ]] && CODE=$(printf '%s' "$CODE" | tr -dc '0-9')
case "$CODE" in
  200)    pass "Render vivo (200): $(head -c 120 /tmp/render-body.txt 2>/dev/null)" ;;
  502|503) warn "Render respondió $CODE (despertando, reintenta en 30s)" ;;
  *)      fail "Render no responde (HTTP '$CODE')" ;;
esac

# ---------- 7. Portal (scraper) ----------
section "7. Portal uniguajira.edu.co (origen del scrapeo)"
HTTP_CODE=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 20 "https://www.uniguajira.edu.co/" || true)
case "$HTTP_CODE" in
  200|301|302) pass "portal accesible desde el teléfono (HTTP $HTTP_CODE)" ;;
  403|451)     warn "portal bloquea esta red (HTTP $HTTP_CODE) — el sync fallará" ;;
  *)           fail "portal no accesible (HTTP '$HTTP_CODE')" ;;
esac

# ---------- 8. Logs recientes ----------
section "8. Logs recientes"
if [[ -f "$LOG_DIR/sync.log" ]]; then
  echo "  últimas 8 líneas de sync.log:"
  tail -8 "$LOG_DIR/sync.log" | sed 's/^/    /'
  # solo el ÚLTIMO resultado (lo viejo 'Access denied' ya no cuenta)
  LAST_RESULT=$(grep -E 'Scraper finalizado|OK: .*guardadas|Access denied|Error:' "$LOG_DIR/sync.log" | tail -1)
  if [[ "$LAST_RESULT" == *"Access denied"* || "$LAST_RESULT" == *"Error"* ]]; then
    fail "último sync falló: $LAST_RESULT"
  elif [[ -n "$LAST_RESULT" ]]; then
    pass "último sync: $LAST_RESULT"
  else
    warn "sin resultados de sync aún"
  fi
else
  warn "sin sync.log todavía"
fi

# ---------- 9. Proceso activo ----------
section "9. Proceso en ejecución"
if pgrep -f 'termux-sync.sh' >/dev/null 2>&1; then
  pass "bucle termux-sync.sh corriendo"
else
  warn "bucle NO corriendo → bash ~/termux-sync.sh (o --run)"
fi
if command -v termux-wake-lock >/dev/null 2>&1; then
  # wake-lock activo si existe el archivo de bloqueo del sistema
  if [[ -f "$PREFIX/var/run/termux-wake-lock" ]] || dumpsys 2>/dev/null | grep -qi 'termux.*wake'; then
    pass "wake-lock probablemente activo"
  else
    warn "ejecuta: termux-wake-lock"
  fi
fi

# ---------- Resumen ----------
echo ""
echo "════════════════════════════════"
if [[ "$FAILS" -eq 0 ]]; then
  echo "RESULTADO: TODO OK ✅"
else
  echo "RESULTADO: $FAILS problema(s) ❌ — corrige los puntos ❌ de arriba"
fi
echo "════════════════════════════════"
exit "$FAILS"
