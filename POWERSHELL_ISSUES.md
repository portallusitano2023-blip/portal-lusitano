# 🔧 Problemas de PowerShell — Soluções Rápidas

## Problema: PowerShell Não Executa Scripts

Se vires erros como:

- `'pwsh.exe' is not recognized`
- `cannot be loaded because running scripts is disabled`
- `ExecutionPolicy`

---

## ✅ Solução Rápida (5 minutos)

### Passo 1: Abre PowerShell como ADMINISTRADOR

Clica **botão direito** na barra de pesquisa:

1. Procura: **PowerShell**
2. Clica direito em **Windows PowerShell** (ou **PowerShell 7** se instalaste)
3. Seleciona: **"Run as Administrator"**

### Passo 2: Muda a Execution Policy

Cole este comando e pressiona Enter:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Responde: `Y` (sim) quando pedir confirmação

### Passo 3: Verifica se Funcionou

```powershell
Get-ExecutionPolicy -Scope CurrentUser
```

Deve aparecer: `RemoteSigned` ✅

---

## 🚀 Agora Podes Correr Scripts

Navega até ao projeto e corre:

```powershell
cd C:\Users\USUARIO\portal-lusitano
.\verify-build.ps1
```

Ou o script de build:

```powershell
npm run build
```

---

## ❓ Se Ainda Não Funcionar

### Problema: "node scripts/copy-favicon.js" não funciona

**Solução**: Corre na pasta do projeto:

```powershell
cd C:\Users\USUARIO\portal-lusitano
node scripts/copy-favicon.js
```

Isto copia favicons manualmente.

---

## 🔐 Execution Policy Explicado

| Policy         | Significado                                                    |
| -------------- | -------------------------------------------------------------- |
| `RemoteSigned` | ✅ **Recomendado** — Executa scripts locais, bloqueia internet |
| `Restricted`   | ❌ Não executa nada                                            |
| `Unrestricted` | ⚠️ Executa tudo (menos seguro)                                 |
| `AllSigned`    | Apenas scripts assinados                                       |

Use **RemoteSigned** — é seguro e funciona.

---

## 📋 Checklist Completo

- [ ] Abre PowerShell como **Administrator**
- [ ] Corre: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- [ ] Responde: `Y`
- [ ] Verifica: `Get-ExecutionPolicy -Scope CurrentUser` → deve ser `RemoteSigned`
- [ ] Navega: `cd C:\Users\USUARIO\portal-lusitano`
- [ ] Corre: `.\verify-build.ps1` ou `npm run build`
- [ ] ✅ Build deve funcionar

---

## 💡 Dica Extra

Se preferires não mexer em Execution Policy, podes sempre usar **Command Prompt** (cmd.exe) em vez disso:

```cmd
cd C:\Users\USUARIO\portal-lusitano
npm run build
```

Isto não precisa de Execution Policy porque cmd é diferente de PowerShell.

---

## 🆘 Ainda Não Funciona?

Mostra-me o erro exacto e a linha onde aparece. Tira screenshot se possível!

**Vai aparecer em vermelho no PowerShell:**

```
❌ [erro aqui]
```

Copia tudo e cola aqui.
