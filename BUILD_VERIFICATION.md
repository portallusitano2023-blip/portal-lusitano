# ✅ Como Verificar o Build Localmente

Tu podes correr a verificação do build de 2 formas:

## Opção 1: Script PowerShell (Recomendado)

1. Abre PowerShell (Windows Terminal ou PowerShell)
2. Navega até à pasta do projeto:
   ```powershell
   cd C:\Users\USUARIO\portal-lusitano
   ```
3. Corre o script:
   ```powershell
   .\verify-build.ps1
   ```

Isto vai:

- ✅ Verificar Node.js e npm
- ✅ Instalar dependências
- ✅ Rodar type-check (TypeScript)
- ✅ Rodar linting (ESLint)
- ✅ Fazer build completo

---

## Opção 2: Script Batch (CMD.exe)

1. Abre Command Prompt (cmd.exe)
2. Navega até à pasta:
   ```cmd
   cd C:\Users\USUARIO\portal-lusitano
   ```
3. Corre:
   ```cmd
   .\verify-build.bat
   ```

Mesmo resultado.

---

## Opção 3: Manual — Comando por Comando

Se preferires correr cada coisa manualmente:

```bash
# 1. Verifica versões
node --version
npm --version

# 2. Instala dependências
npm install

# 3. TypeScript check
npm run type-check

# 4. Linting
npm run lint

# 5. Build
npm run build
```

---

## O Que Esperar

### ✅ Se Tudo OK:

```
✅ BUILD SUCCESSFUL!
All checks passed. Code is ready for deployment.
```

### ❌ Se Houver Erros:

- Mostra as linhas com problemas
- Geralmente em ficheiros específicos
- Ex: `components/analise-perfil/useQuizLogic.ts:245`

---

## Se Houver Erros

Depois de ver o erro, volta aqui com:

- O ficheiro afectado
- O número da linha
- A mensagem de erro

E vamos corrigir! 🔧

---

## ⏱️ Tempo Total

O build completo demora ~2-5 minutos (depende do teu PC).

Corre agora e avisa-me com o resultado! 🚀
