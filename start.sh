#!/bin/bash
echo "Iniciando UniGuajira News..."
echo "1234" | sudo -S mariadbd-safe --skip-grant-tables 2>/dev/null &

cd /home/miguel/proyecto_de_grado/server
node src/index.js &
SERVER_PID=$!
echo "Backend PID: $SERVER_PID"

cd /home/miguel/proyecto_de_grado/app
npx vite --host &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "==================================="
echo "  Backend:  http://localhost:3000  "
echo "  Frontend: http://localhost:5173  "
echo "==================================="

wait
