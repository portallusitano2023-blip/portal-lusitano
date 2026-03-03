cd 'C:\Users\USUARIO\portal-lusitano'

Write-Host "=== Commit 1: next.config.js ===" -ForegroundColor Cyan
git add next.config.js
git commit -m @"
fix(docker): add output standalone to next.config.js

Dockerfile COPYs .next/standalone but Next.js only generates that
directory when output: 'standalone' is set in next.config.js.
Without it the build succeeded silently but the container crashed
at runtime because the entrypoint was missing.

Co-authored-by: GitHub Copilot <copilot@github.com>
"@
if ($LASTEXITCODE -eq 0) {
    $sha1 = git rev-parse HEAD
    Write-Host "✓ Commit 1 SUCCESS - SHA: $sha1" -ForegroundColor Green
} else {
    Write-Host "✗ Commit 1 FAILED" -ForegroundColor Red
}

Write-Host "`n=== Commit 2: api-factory-middleware.ts ===" -ForegroundColor Cyan
git add lib/api-factory-middleware.ts
git commit -m @"
fix(security): implement real rate limiting with Upstash Redis

checkRateLimit() was a no-op stub — every route using
createApiRoute({ rateLimit: {...} }) was completely unprotected
despite believing rate limiting was active.

Now uses @upstash/ratelimit (already in package.json) with a
sliding-window algorithm. Ratelimit instances are cached by config
key to avoid per-request reconstruction overhead. Fails open when
Redis is not configured or temporarily unreachable so a Redis
outage never brings down the API.

Co-authored-by: GitHub Copilot <copilot@github.com>
"@
if ($LASTEXITCODE -eq 0) {
    $sha2 = git rev-parse HEAD
    Write-Host "✓ Commit 2 SUCCESS - SHA: $sha2" -ForegroundColor Green
} else {
    Write-Host "✗ Commit 2 FAILED" -ForegroundColor Red
}

Write-Host "`n=== Commit 3: auth.ts + env.ts ===" -ForegroundColor Cyan
git add lib/auth.ts lib/env.ts
git commit -m @"
fix(security): replace SHA-256 with scrypt for admin password hashing

SHA-256 is a general-purpose hash with no salting — trivially cracked
with rainbow tables and GPU brute force.  Replace with Node.js built-in
crypto.scryptSync (memory-hard, N=16384 r=8 p=1, 64-byte key + 16-byte
random salt), which is as secure as bcrypt but requires no new dependency.

New ADMIN_PASSWORD_HASH format: 'scrypt:<hex_salt>:<hex_hash>'
Generate a new hash:
  node -e "const {hashPassword}=require('./lib/auth'); console.log(hashPassword('yourpassword'))"

Zero-downtime migration: the legacy SHA-256 path is preserved as a
fallback so existing deployments keep working until ADMIN_PASSWORD_HASH
is updated to the new scrypt format.

Co-authored-by: GitHub Copilot <copilot@github.com>
"@
if ($LASTEXITCODE -eq 0) {
    $sha3 = git rev-parse HEAD
    Write-Host "✓ Commit 3 SUCCESS - SHA: $sha3" -ForegroundColor Green
} else {
    Write-Host "✗ Commit 3 FAILED" -ForegroundColor Red
}

Write-Host "`n=== Commit 4: ci.yml ===" -ForegroundColor Cyan
git add .github/workflows/ci.yml
git commit -m @"
fix(ci): remove continue-on-error from production deploy job

continue-on-error: true on deploy-production caused failed Vercel
deployments to show as green in CI.  A broken prod deploy is a
blocker — it must fail loudly.

The Lighthouse step intentionally keeps continue-on-error: true
because a score regression should warn, not block deployment.

Co-authored-by: GitHub Copilot <copilot@github.com>
"@
if ($LASTEXITCODE -eq 0) {
    $sha4 = git rev-parse HEAD
    Write-Host "✓ Commit 4 SUCCESS - SHA: $sha4" -ForegroundColor Green
} else {
    Write-Host "✗ Commit 4 FAILED" -ForegroundColor Red
}

Write-Host "`n=== Summary ===" -ForegroundColor Yellow
git log --oneline -4
