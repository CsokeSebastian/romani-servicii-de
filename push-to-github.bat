@echo off
REM Script to push code to GitHub (Windows)

echo Pushing code to GitHub...

REM Initialize git if not already initialized
if not exist .git (
    git init
)

REM Add all files
git add .

REM Commit
git commit -m "Deploy ServiciiPentruRomani"

REM Remove old origin if it exists
git remote remove origin 2>nul

REM Add new origin
git remote add origin https://github.com/CsokeSebastian/Servicii-Pentru-Romani.git

REM Set main branch
git branch -M main

REM Push to GitHub
git push -u origin main

echo.
echo ✅ Code pushed to GitHub successfully!
echo.
echo Next steps:
echo 1. Go to https://app.netlify.com
echo 2. Click 'Add new site' → 'Import an existing project'
echo 3. Choose GitHub and select 'Servicii-Pentru-Romani' repository
echo 4. Deploy and add environment variables (see DEPLOYMENT_GUIDE.md)
echo.
pause
