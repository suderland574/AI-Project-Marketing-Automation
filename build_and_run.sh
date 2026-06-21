#!/bin/bash
echo "================================"
echo " AI Marketing Automation Setup"
echo "================================"
echo "[1/3] Building React frontend..."
cd frontend && npm install && npm run build && cd ..
echo "[2/3] Installing Python packages..."
pip install -r backend/requirements.txt
echo "[3/3] Starting server..."
echo "Open http://127.0.0.1:8001 in your browser"
echo "Login: admin@demo.com / password123"
python backend/server.py --port 8001
