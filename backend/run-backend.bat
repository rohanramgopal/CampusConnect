@echo off
echo Starting CampusConnect Backend...

IF NOT EXIST node_modules (
    npm install
)

IF NOT EXIST .env (
    copy .env.example .env
    echo.
    echo Please open backend/.env and add your MongoDB Atlas connection string.
    pause
)

npm run dev
pause
