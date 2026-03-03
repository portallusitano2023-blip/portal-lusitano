# Script de Verificação — Portal Lusitano Build Check
# Roda isto localmente: .\verify-build.ps1

Write-Host "🔍 Portal Lusitano — Build Verification" -ForegroundColor Cyan
Write-Host "=" * 50

# Check 1: Versions
Write-Host "`n📦 Checking versions..." -ForegroundColor Yellow
node --version
npm --version

# Check 2: Install dependencies (se necessário)
Write-Host "`n📥 Installing dependencies..." -ForegroundColor Yellow
npm install

# Check 3: Type checking
Write-Host "`n🔤 Running TypeScript type check..." -ForegroundColor Yellow
npm run type-check

# Check 4: Linting
Write-Host "`n✏️ Running ESLint..." -ForegroundColor Yellow
npm run lint

# Check 5: Build
Write-Host "`n🏗️ Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ BUILD SUCCESSFUL!" -ForegroundColor Green
    Write-Host "All checks passed. Code is ready for deployment." -ForegroundColor Green
} else {
    Write-Host "`n❌ BUILD FAILED!" -ForegroundColor Red
    Write-Host "Please review errors above." -ForegroundColor Red
}
