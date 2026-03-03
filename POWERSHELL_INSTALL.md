# 📦 Como Instalar PowerShell 6+ (PowerShell Core)

## O Que É?

- **Windows PowerShell 5.1** (vem com Windows) — Antigo, limitado
- **PowerShell 7+ (Core)** — Moderno, cross-platform, melhorado

Tu precisas do PowerShell 7+ para rodar comandos via CLI.

---

## 🚀 Instalação Rápida (3 Passos)

### Opção 1: Instalador MSI (Mais Fácil)

1. **Abre este link no browser:**

   ```
   https://github.com/PowerShell/PowerShell/releases
   ```

2. **Procura "PowerShell-7.4.1-win-x64.msi"** (ou a versão mais recente com `.msi`)
   - Clica no link para download
   - Espera completar

3. **Duplo-clique no ficheiro .msi e segue o instalador**
   - Accept license
   - Clica "Next" até instalar
   - Clica "Finish"

4. **Pronto!** PowerShell está instalado

---

### Opção 2: Instalador Winget (Mais Rápido, se tens Winget)

Se já tens Windows 11 ou tens Winget instalado:

```powershell
winget install Microsoft.PowerShell
```

Depois reinicia o terminal.

---

### Opção 3: Chocolatey

Se tens Chocolatey instalado:

```powershell
choco install powershell-core
```

---

## ✅ Como Verificar Se Está Instalado

Abre o **Command Prompt** (cmd.exe) e escreve:

```cmd
pwsh --version
```

Se vires algo tipo `PowerShell 7.4.1`, está funcionando ✅

Se vir erro `'pwsh.exe' is not recognized`, ainda não está instalado.

---

## 🎯 Como Usar (Depois de Instalar)

### Em Visual Studio Code:

1. Ctrl + ` (backtick) para abrir terminal
2. Clica no dropdown ao lado direito
3. Escolhe **PowerShell** (em vez de Command Prompt)
4. Pronto! Agora podes correr comandos npm, git, etc.

### Em Windows Terminal (Recomendado):

1. Abre **Windows Terminal** (search na taskbar)
2. PowerShell aparece como opção por defeito
3. Ou clica no dropdown e escolhe PowerShell 7

### Via Command Prompt:

```cmd
pwsh
```

Isto abre o PowerShell 7 dentro de cmd.

---

## 📝 Depois de Instalar

Volta aqui e corre:

```powershell
cd C:\Users\USUARIO\portal-lusitano
npm run build
```

E vamos ver se há erros de compilação.

---

## 🔗 Links Oficiais

- **Download**: https://github.com/PowerShell/PowerShell/releases (procura `win-x64.msi`)
- **Docs**: https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows

---

## ❓ Problemas Comuns

**Erro: "PowerShell está bloqueado"**

- Windows Defender bloqueou. Clica "More info" no instalador e "Run anyway"

**Erro: "Execution Policy"**

- Run PowerShell como Admin (direito-clique → "Run as administrator")

**Não aparece em VS Code**

- Reinicia VS Code completamente (fechar e abrir)

---

## ⏱️ Tempo Total

- Download: ~2 min
- Instalação: ~1 min
- Setup: ~1 min
- **Total: ~5 minutos**

Instala e depois diz quando tiver pronto! 🚀
