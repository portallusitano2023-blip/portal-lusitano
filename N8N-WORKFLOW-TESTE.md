# 🧪 Guia de Teste - Workflow N8N Gmail Automation

## ✅ Configuração Final do IF

```
Conditions:

Boolean (pode ignorar)
  Value 1: {{$node["OpenAI"].json.text}}
  Operation: Equal
  Value 2: true

String ✅ (condição principal)
  Value 1: {{$node["OpenAI"].json.text}}
  Operation: Contains
  Value 2: CONSULTA

Combine: ANY ← IMPORTANTE!
```

---

## 🧪 Como Testar o Workflow

### **Passo 1: Preparar o OpenAI**

Certifica-te que o **nó OpenAI** tem este prompt:

```
Analisa este email e classifica-o:

Email:
Assunto: {{$json.subject}}
De: {{$json.from}}
Corpo: {{$json.body}}

Responde APENAS com uma destas palavras:
- CONSULTA (se for pedido de informação sobre cavalos Lusitanos)
- SPAM (se for email promocional/publicidade)
- INFO (se for newsletter ou informação geral)

Não adiciones explicações. Apenas a palavra.
```

---

### **Passo 2: Ativar o Workflow**

1. No topo do N8N, clica no toggle para **ativar o workflow**
2. Deve aparecer **"Active"** a verde

---

### **Passo 3: Enviar Email de Teste**

Envia um email para a tua conta Gmail (a mesma que configuraste no Gmail Trigger) com:

**Email de Teste 1 - Deve criar DRAFT:**
```
Assunto: Pergunta sobre cavalo Lusitano
Corpo: Olá, gostaria de saber mais informações sobre a linhagem
       do meu cavalo Lusitano. Podem ajudar?
```

**Email de Teste 2 - NÃO deve criar draft:**
```
Assunto: Promoção especial - 50% desconto!
Corpo: Aproveite esta oferta imperdível...
```

---

### **Passo 4: Verificar o Resultado**

#### No N8N:
1. Vai ao menu **"Executions"** (lado esquerdo)
2. Deve aparecer uma nova execução
3. Clica nela para ver o fluxo

**O que deves ver:**
```
Gmail Trigger ✅
    ↓
OpenAI ✅ (classificou como "CONSULTA")
    ↓
IF ✅ (TRUE branch)
    ↓
Create Draft ✅ (criou rascunho no Gmail)
```

#### No Gmail:
1. Abre o Gmail
2. Vai a **"Drafts" (Rascunhos)**
3. Deve aparecer um novo rascunho de resposta ao email de teste

---

## 🐛 Troubleshooting

### **Problema 1: IF sempre retorna FALSE**

**Causa:** OpenAI não está a retornar exatamente "CONSULTA"

**Solução:**
1. Clica na execução no N8N
2. Clica no nó **OpenAI**
3. Vê o output no campo `json.text`
4. Se retornar algo como "A resposta é: CONSULTA", ajusta o prompt do OpenAI

**Prompt mais rigoroso:**
```
Classifica este email em UMA palavra:
- CONSULTA
- SPAM
- INFO

Email: {{$json.subject}} - {{$json.body}}

Responde APENAS com UMA palavra, nada mais.
```

---

### **Problema 2: Workflow não é triggered**

**Causa:** Gmail Trigger não está a detectar emails novos

**Solução:**
1. Desativa e reativa o workflow
2. Verifica as permissões do Gmail OAuth
3. Testa com **"Test Workflow"** (botão manual)

**Alternativa:** Usa **"Execute Workflow"** manualmente:
1. Clica em "Execute Workflow"
2. Simula um email com dados de teste
3. Vê se o fluxo funciona

---

### **Problema 3: Create Draft falha**

**Causa:** Permissões do Gmail ou configuração incorreta

**Solução:**
1. Verifica se o Gmail OAuth tem permissão **"gmail.compose"**
2. Testa com valores fixos no Create Draft:
   ```
   To: teu-email@gmail.com
   Subject: Teste
   Message: Isto é um teste
   ```
3. Se funcionar, o problema está nas variáveis

---

### **Problema 4: OpenAI dá erro**

**Causa:** API Key inválida ou limite de requests

**Solução:**
1. Verifica a API Key do OpenAI
2. Confirma que tens créditos na conta OpenAI
3. Testa com `gpt-3.5-turbo` (mais barato) em vez de `gpt-4`

---

## 📊 Output Esperado de Cada Nó

### **1. Gmail Trigger**
```json
{
  "id": "18d1234567890abc",
  "subject": "Pergunta sobre cavalo Lusitano",
  "from": "cliente@example.com",
  "body": "Olá, gostaria de saber...",
  "date": "2026-02-03T10:30:00Z",
  "messageId": "<abc123@mail.gmail.com>"
}
```

### **2. OpenAI**
```json
{
  "text": "CONSULTA"
}
```
ou
```json
{
  "choices": [
    {
      "message": {
        "content": "CONSULTA"
      }
    }
  ]
}
```

### **3. IF**
```json
{
  "branch": "true"
}
```

### **4. Create Draft**
```json
{
  "id": "r-9876543210",
  "message": "Draft created successfully"
}
```

---

## 🎯 Checklist de Funcionamento

Testa cada um destes cenários:

### ✅ Cenário 1: Email de Consulta
- [ ] Email enviado com pergunta sobre Lusitanos
- [ ] OpenAI classificou como "CONSULTA"
- [ ] IF retornou TRUE
- [ ] Rascunho criado no Gmail
- [ ] Rascunho tem subject correto (Re: assunto original)

### ✅ Cenário 2: Email Spam
- [ ] Email enviado com conteúdo promocional
- [ ] OpenAI classificou como "SPAM"
- [ ] IF retornou FALSE
- [ ] No Operation executado
- [ ] Nenhum rascunho criado

### ✅ Cenário 3: Newsletter
- [ ] Email enviado com informação geral
- [ ] OpenAI classificou como "INFO"
- [ ] IF retornou FALSE
- [ ] No Operation executado
- [ ] Nenhum rascunho criado

---

## 🔍 Logs Úteis para Debug

### Ver todos os outputs:
1. Clica na execução
2. Clica em cada nó
3. Vê o tab **"Output"**
4. Copia o JSON se precisares de debug

### Ver erros:
1. Se um nó tiver ❌, clica nele
2. Vê o tab **"Error"**
3. Lê a mensagem de erro

---

## 📈 Métricas de Sucesso

Depois de 1 semana de uso, verifica:

**No N8N Dashboard:**
- Taxa de sucesso das execuções (deve ser >95%)
- Número de drafts criados vs emails recebidos
- Tempo médio de execução (deve ser <10s)

**No Gmail:**
- Quantos rascunhos foram criados
- Quantos desses rascunhos foram úteis
- Falsos positivos (rascunhos que não deviam existir)

---

## 🎨 Melhorias Futuras

### 1. **Resposta Automática Completa**
Em vez de criar rascunho vazio, adiciona outro nó OpenAI antes do Create Draft:

```
Prompt: Cria uma resposta profissional para este email sobre cavalos Lusitanos:

{{$node["Gmail Trigger"].json.body}}

A resposta deve:
- Ser cordial e profissional
- Agradecer o contacto
- Responder à pergunta se possível
- Pedir mais informações se necessário
- Assinar como "Equipa Portal Lusitano"
```

### 2. **Categorização Avançada**
Adiciona mais categorias ao OpenAI:
- VENDA (pedido para vender cavalo)
- COMPRA (pedido para comprar cavalo)
- LINHAGEM (pergunta sobre genealogia)
- EVENTO (pergunta sobre eventos)
- OUTRO (outros assuntos)

E cria diferentes templates de resposta para cada categoria.

### 3. **Log em Supabase**
Adiciona um nó para guardar todos os emails processados:
```
Table: emails_processados
Columns:
- id
- subject
- from
- classificacao (CONSULTA/SPAM/INFO)
- draft_criado (boolean)
- created_at
```

### 4. **Notificação Slack/Discord**
Quando criar um draft, envia notificação:
```
🔔 Novo email de consulta recebido!
De: cliente@example.com
Assunto: Pergunta sobre Lusitano
Classificação: CONSULTA
Ação: Draft criado
```

---

## 🚀 Próximos Passos

1. ✅ **Testaste o workflow?**
   - Se sim, passa para o passo 2
   - Se não, envia email de teste agora

2. ✅ **Workflow funcionou?**
   - Se sim, deixa ativo e monitoriza durante 1 semana
   - Se não, segue o troubleshooting acima

3. ✅ **Ajustes finais:**
   - Ajusta o prompt do OpenAI conforme os resultados
   - Melhora o template do Create Draft
   - Adiciona filtros extra no IF se necessário

4. ✅ **Monitorização:**
   - Verifica diariamente os drafts criados
   - Avalia se a classificação está correta
   - Ajusta o prompt do OpenAI se necessário

---

## 💡 Dicas Finais

### **Para evitar muitos drafts:**
Adiciona mais condições ao IF:

```
String 1: OpenAI.text contains "CONSULTA"
String 2: Gmail.from notContains "noreply"
String 3: Gmail.subject notContains "Unsubscribe"

Combine: ALL (todas devem ser TRUE)
```

### **Para testar sem spam:**
Durante os testes, muda o Create Draft para apenas fazer log:
```
Operation: Log to console
Message: {{$node["Gmail Trigger"].json.subject}}
```

Assim não crias drafts reais enquanto testas.

---

**Workflow configurado com sucesso! 🎉🐴**

Qualquer dúvida, consulta a documentação completa em `N8N-WORKFLOW-CONFIG.md`
