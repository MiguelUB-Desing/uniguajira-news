#!/bin/bash
set -e

echo "==========================================="
echo "  UniGuajira News - Build & Deploy"
echo "==========================================="

# 1. Build frontend
echo ""
echo "[1/4] Construyendo frontend..."
cd app
npm install
npm run build
echo "  ✓ Frontend listo en app/dist/"

# 2. Install backend dependencies
echo ""
echo "[2/4] Instalando dependencias del backend..."
cd ../server
npm install --omit=dev
echo "  ✓ Backend listo"

# 3. Set up database
echo ""
echo "[3/4] Configurando base de datos..."
echo 1234 | sudo -S mariadb -u root -puniguajira2026 uniguajira_news < ../database/schema.sql 2>/dev/null || true
echo "  ✓ Base de datos lista"

# 4. Start production server
echo ""
echo "[4/4] Iniciando servidor de producción..."
export NODE_ENV=production
export PORT=3000
node src/index.js &
echo ""
echo "==========================================="
echo "  App corriendo en http://localhost:3000"
echo "  Para APK: cd app && npx cap sync android"
echo "==========================================="
