# 🎯 Próximas Ações — Após Instalar PowerShell

## Tu Instalaste PowerShell, Mas...

O ambiente da CLI ainda não reconhece o `pwsh.exe`. Isto pode ser porque:

1. PowerShell não foi adicionado ao PATH do Windows
2. Precisa reiniciar o sistema
3. Precisa reiniciar o terminal

**Solução**: Corre o build **localmente no teu PC**, não via CLI.

---

## ✅ O Que Fazer AGORA

### Passo 1: Verifica os Scripts que Criei

Na pasta `C:\Users\USUARIO\portal-lusitano` vais encontrar 2 novos ficheiros:

- **`verify-build.ps1`** — Script PowerShell para verificar tudo
- **`verify-build.bat`** — Script Batch (CMD) alternativo
- **`BUILD_VERIFICATION.md`** — Guia de como correr

### Passo 2: Corre o Build Localmente

Abre **PowerShell** ou **Command Prompt** e corre:

```bash
cd C:\Users\USUARIO\portal-lusitano
.\verify-build.ps1
```

Ou se usares CMD:

```cmd
cd C:\Users\USUARIO\portal-lusitano
verify-build.bat
```

### Passo 3: Mostra-me o Resultado

Depois que o build terminar (OK ou erro), copia o output e cola aqui.

---

## 📋 O Que Estou a Verificar

Quando correres o build, vai:

✅ **Type-checking** — TypeScript sem erros?  
✅ **Linting** — ESLint sem warnings?  
✅ **Build** — Compila para produção?

Se tudo passa → **Código está pronto para deploy**  
Se falha → **Precisa de fixes específicas**

---

## 🎁 Scripts Criados

| Ficheiro                | Propósito                                 |
| ----------------------- | ----------------------------------------- |
| `verify-build.ps1`      | PowerShell script — corre todos os checks |
| `verify-build.bat`      | CMD script — alternativa ao PowerShell    |
| `BUILD_VERIFICATION.md` | Guia com instruções                       |
| `POWERSHELL_INSTALL.md` | Como instalar PowerShell 7+               |
| `SESSION_SUMMARY.md`    | Resumo completo da sessão                 |

---

## ⏱️ Timeline

1. **Agora**: Corre `.\verify-build.ps1` (leva ~2-5 min)
2. **Imediatamente depois**: Mostra-me o output
3. **Se OK**: Vamos fazer deploy ou continuar refactor
4. **Se erro**: Corrigimos o erro específico

---

## 💡 Dica

Se estiveres em dúvida com comandos, usa o ficheiro `BUILD_VERIFICATION.md` — tem instruções step-by-step com exemplos.

---

**Pronto? Corre o script e avisa-me!** 🚀
