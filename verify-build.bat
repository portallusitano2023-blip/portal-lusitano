@echo off
REM Script de Verificação — Portal Lusitano Build Check
REM Roda isto localmente: .\verify-build.bat

setlocal enabledelayedexpansion

echo.
echo 🔍 Portal Lusitano — Build Verification
echo ====================================================
echo.

REM Check 1: Versions
echo 📦 Checking versions...
node --version
npm --version

REM Check 2: Install dependencies
echo.
echo 📥 Installing dependencies...
call npm install

REM Check 3: Type checking
echo.
echo 🔤 Running TypeScript type check...
call npm run type-check

REM Check 4: Linting
echo.
echo ✏️ Running ESLint...
call npm run lint

REM Check 5: Build
echo.
echo 🏗️ Building project...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD SUCCESSFUL!
    echo All checks passed. Code is ready for deployment.
) else (
    echo.
    echo ❌ BUILD FAILED!
    echo Please review errors above.
)

pause
