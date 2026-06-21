@echo off
echo ================================
echo  AI Marketing Automation Setup
echo ================================
echo.
where npm >nul 2>&1
if %ERRORLEVEL%==0 (
  echo [1/3] Building React frontend...
  cd frontend
  call npm install
  call npm run build
  cd ..
) else (
  echo [1/3] npm not found - using pre-built frontend in frontend/dist
)
echo.
echo [2/3] Installing Python packages...
py -m pip install -r backend/requirements.txt
echo.
echo [3/3] Starting server...
echo.
echo Open http://127.0.0.1:8001 in your browser
echo Login: admin@demo.com / password123
echo.
py backend/server.py --port 8001
