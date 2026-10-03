# UniGuajira News en Termux (mini VPS en tu Android)

Este runner **solo** hace dos cosas (el backend y frontend ya viven en Render/Vercel):

1. **`npm run sync`** — scrapea uniguajira.edu.co → Aiven (cada 30 min)
2. **Ping** a Aiven (SELECT 1) y a Render `/api/health` (cada 3 min) para que no se duerman

## Instalar (desde cero)

En Termux (instálalo desde **F-Droid**, no Play Store):

```bash
pkg update && pkg install -y wget
wget -O termux-sync.sh https://raw.githubusercontent.com/MiguelUB-Desing/uniguajira-news/main/termux/termux-sync.sh
bash termux-sync.sh
```

La primera vez instala node, clona el repo, hace `npm install` y entra en el bucle.

## Comandos

| Comando | Qué hace |
|---------|----------|
| `bash termux-sync.sh` | Instala todo + bucle infinito (dejar corriendo) |
| `bash termux-sync.sh --run` | Solo el bucle (si ya instalaste) |
| `bash termux-sync.sh --once` | Un sync inmediato y sale |

## Variables (opcionales)

```bash
SYNC_EVERY_MIN=30   # minutos entre scrapes
PING_EVERY_MIN=3    # minutos entre pings (2–5 ok)
AIVEN_DATABASE_URL=mysql://...   # si cambias la contraseña de Aiven
RENDER_URL=https://uniguajira-news.onrender.com/api/health
```

## Que Android no lo mate

1. Ajustes → Apps → **Termux** → Batería → **Sin restricciones**
2. El script ya pide `termux-wake-lock`
3. Mejor con la pantalla encendida o cargando mientras sustentas

## Logs

```bash
tail -f ~/uniguajira-logs/loop.log
tail -f ~/uniguajira-logs/sync.log
```

## ¿Backend local en el cel? (opcional)

No hace falta para Render. Si algún día lo quieres:

```bash
cd ~/uniguajira-news/server && node src/index.js
# http://<IP-del-cel>:3000/api/health
```
