#!/bin/bash
echo "Iniciando UniGuajira News..."
echo "1234" | sudo -S mariadbd-safe --skip-grant-tables 2>/dev/null &

ROOT=/home/miguel/uniguajira-news
export PATH="$HOME/.local/node22/bin:$PATH"

echo "1234" | sudo -S mariadbd-safe --skip-grant-tables 2>/dev/null &

cd $ROOT/server
node src/index.js &
SERVER_PID=$!
echo "Backend PID: $SERVER_PID"

cd $ROOT/app
npx vite --host &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "==================================="
echo "  Backend:  http://localhost:3000  "
echo "  Frontend: http://localhost:5173  "
echo "==================================="

wait
