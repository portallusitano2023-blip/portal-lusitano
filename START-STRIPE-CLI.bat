@echo off
echo ========================================
echo    STRIPE CLI - WEBHOOKS LOCAIS
echo ========================================
echo.
echo IMPORTANTE: Deixar esta janela aberta!
echo.
cd C:\Users\USUARIO\portal-lusitano
stripe listen --forward-to localhost:3000/api/stripe/webhook
pause
