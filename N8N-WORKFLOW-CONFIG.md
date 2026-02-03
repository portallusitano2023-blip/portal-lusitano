# 📧 Configuração do Workflow N8N - Automação de Emails Gmail

## 🎯 Objetivo do Workflow

Este workflow automatiza o processamento de emails do Gmail usando IA (OpenAI) e cria rascunhos automáticos baseados em condições específicas.

---

## 🔄 Fluxo do Workflow

```
Gmail Trigger → OpenAI → IF → Create Draft (true) ou No Operation (false)
```

---

## ⚙️ Configuração Passo a Passo

### 1. **Gmail Trigger** (Nó Inicial)

**Objetivo:** Detecta quando chega um novo email ao Gmail

**Configuração:**
```javascript
{
  "event": "message.received",
  "labelIds": ["INBOX"],
  "filters": {
    "from": "",  // Opcional: filtrar por remetente específico
    "subject": "", // Opcional: filtrar por assunto
    "hasAttachment": false
  }
}
```

**Passos:**
1. Conecta a tua conta Gmail (OAuth2)
2. Escolhe o evento: **"Message Received"**
3. Define filtros (opcional):
   - Label: `INBOX` ou `UNREAD`
   - De: deixa vazio para todos os emails
   - Assunto: deixa vazio ou define palavras-chave

**Output do nó:**
- `json.subject` - Assunto do email
- `json.from` - Remetente
- `json.body` - Corpo do email
- `json.date` - Data de recebimento

---

### 2. **OpenAI** (Processamento com IA)

**Objetivo:** Analisa o conteúdo do email e classifica/extrai informação

**Configuração:**

**Operation:** `Complete: Text`

**Prompt sugerido:**
```
Analisa este email e diz-me se é:
1. Uma consulta sobre cavalos Lusitanos que requer resposta personalizada (responde: CONSULTA)
2. Um email promocional ou spam (responde: SPAM)
3. Uma newsletter ou informação geral (responde: INFO)

Email:
Assunto: {{$json.subject}}
De: {{$json.from}}
Corpo: {{$json.body}}

Responde apenas com: CONSULTA, SPAM ou INFO
```

**Parâmetros OpenAI:**
```javascript
{
  "model": "gpt-3.5-turbo",
  "temperature": 0.3,  // Baixo para respostas consistentes
  "maxTokens": 50,     // Resposta curta
  "prompt": "[prompt acima]"
}
```

**Output do nó:**
- `json.text` - Resposta do OpenAI (CONSULTA, SPAM ou INFO)

---

### 3. **IF** (Nó Condicional) ⚡ **CONFIGURAÇÃO PRINCIPAL**

**Objetivo:** Decide se deve criar um rascunho ou ignorar o email

**Configuração do IF:**

#### **Condição 1: Verificar se é CONSULTA**

```javascript
{
  "conditions": {
    "string": [
      {
        "value1": "={{$node['OpenAI'].json.text}}",
        "operation": "contains",
        "value2": "CONSULTA"
      }
    ]
  },
  "combineOperation": "all"
}
```

**Explicação:**
- **value1**: Pega o resultado do OpenAI (`$node['OpenAI'].json.text`)
- **operation**: `contains` (contém)
- **value2**: `CONSULTA`
- Se TRUE → cria rascunho
- Se FALSE → não faz nada (No Operation)

#### **Alternativa: Condições Múltiplas**

Se quiseres criar rascunhos para CONSULTA OU para emails de domínios específicos:

```javascript
{
  "conditions": {
    "string": [
      {
        "value1": "={{$node['OpenAI'].json.text}}",
        "operation": "contains",
        "value2": "CONSULTA"
      },
      {
        "value1": "={{$node['Gmail Trigger'].json.from}}",
        "operation": "contains",
        "value2": "@apsl.pt"  // Exemplo: emails da APSL sempre criam rascunho
      }
    ]
  },
  "combineOperation": "any"  // TRUE se qualquer condição for verdadeira
}
```

**Opções de `combineOperation`:**
- `all` - Todas as condições devem ser TRUE (AND)
- `any` - Pelo menos uma condição TRUE (OR)

**Opções de `operation`:**
- `equals` - Igual
- `notEquals` - Diferente
- `contains` - Contém
- `notContains` - Não contém
- `startsWith` - Começa com
- `endsWith` - Termina com
- `regex` - Expressão regular

---

### 4. **Create Draft** (Caminho TRUE do IF)

**Objetivo:** Cria um rascunho de resposta ao email original

**Configuração:**

**Operation:** `Create Draft`

```javascript
{
  "to": "={{$node['Gmail Trigger'].json.from}}",
  "subject": "Re: {{$node['Gmail Trigger'].json.subject}}",
  "message": "={{$node['OpenAI'].json.draftResponse}}",  // Se OpenAI gerar a resposta
  "replyTo": "={{$node['Gmail Trigger'].json.messageId}}"  // Responde ao email original
}
```

**Exemplo de corpo do email (fixo):**
```javascript
{
  "message": "Olá,\n\nObrigado pelo teu email sobre cavalos Lusitanos.\n\nVou analisar o teu pedido e responder em breve.\n\nCumprimentos,\nPortal Lusitano"
}
```

**OU gerar resposta com OpenAI** (adicionar nó OpenAI antes do Create Draft):
```
Prompt: "Cria uma resposta profissional e simpática para este email sobre cavalos Lusitanos:
{{$node['Gmail Trigger'].json.body}}

A resposta deve:
- Agradecer o contacto
- Dizer que vamos analisar o pedido
- Ser cordial e profissional"
```

---

### 5. **No Operation** (Caminho FALSE do IF)

**Objetivo:** Não faz nada - termina o workflow

**Configuração:** Nenhuma necessária

Este nó existe apenas para completar o fluxo visualmente. Quando o IF retorna FALSE, o workflow termina aqui sem ações.

---

## 📝 Exemplo de Configuração Completa do IF

### **Caso de Uso: Portal Lusitano**

**Cenário:** Criar rascunhos apenas para emails sobre consultas de cavalos

**Configuração do IF:**

```javascript
{
  "conditions": {
    "string": [
      {
        "value1": "={{$node['OpenAI'].json.text}}",
        "operation": "contains",
        "value2": "CONSULTA"
      }
    ],
    "boolean": [
      {
        "value1": "={{$node['Gmail Trigger'].json.hasAttachment}}",
        "value2": false
      }
    ]
  },
  "combineOperation": "all"
}
```

**Isto significa:**
- Cria rascunho SE:
  - OpenAI classificou como CONSULTA
  - E o email NÃO tem anexos

---

## 🎨 Configurações Avançadas do IF

### **1. Filtrar por Assunto**

```javascript
{
  "value1": "={{$node['Gmail Trigger'].json.subject}}",
  "operation": "contains",
  "value2": "Lusitano"
}
```

### **2. Filtrar por Remetente (domínio)**

```javascript
{
  "value1": "={{$node['Gmail Trigger'].json.from}}",
  "operation": "endsWith",
  "value2": "@gmail.com"
}
```

### **3. Verificar se o email é recente (últimas 24h)**

```javascript
{
  "value1": "={{$now.diff($node['Gmail Trigger'].json.date, 'hours')}}",
  "operation": "smallerEqual",
  "value2": 24
}
```

### **4. Excluir emails automáticos**

```javascript
{
  "value1": "={{$node['Gmail Trigger'].json.from}}",
  "operation": "notContains",
  "value2": "noreply"
}
```

---

## 🚀 Fluxo Completo Recomendado para Portal Lusitano

```
┌─────────────┐
│Gmail Trigger│ (Recebe email)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   OpenAI    │ (Classifica email: CONSULTA/SPAM/INFO)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     IF      │ (Se CONSULTA = true)
└──┬────────┬─┘
   │        │
true│        │false
   ▼        ▼
┌─────┐  ┌────────────┐
│Draft│  │No Operation│
└─────┘  └────────────┘
```

---

## 🔧 Configuração Específica do IF para o Teu Caso

### **Opção 1: Simples (recomendado para começar)**

```javascript
Condition Type: String
Value 1: {{$node["OpenAI"].json.text}}
Operation: contains
Value 2: CONSULTA
```

### **Opção 2: Avançada (filtros múltiplos)**

```javascript
Conditions:
  String 1:
    Value 1: {{$node["OpenAI"].json.text}}
    Operation: contains
    Value 2: CONSULTA

  String 2:
    Value 1: {{$node["Gmail Trigger"].json.from}}
    Operation: notContains
    Value 2: noreply

  String 3:
    Value 1: {{$node["Gmail Trigger"].json.subject}}
    Operation: notContains
    Value 2: Unsubscribe

Combine: all (todas devem ser TRUE)
```

**Isto cria rascunho apenas se:**
- ✅ OpenAI classifica como CONSULTA
- ✅ Email não é automático (sem "noreply")
- ✅ Email não é newsletter (sem "Unsubscribe")

---

## 📊 Variáveis Disponíveis para o IF

### **Do Gmail Trigger:**
- `{{$node["Gmail Trigger"].json.subject}}` - Assunto
- `{{$node["Gmail Trigger"].json.from}}` - Remetente
- `{{$node["Gmail Trigger"].json.body}}` - Corpo do email
- `{{$node["Gmail Trigger"].json.date}}` - Data
- `{{$node["Gmail Trigger"].json.messageId}}` - ID da mensagem
- `{{$node["Gmail Trigger"].json.hasAttachment}}` - Tem anexo (true/false)

### **Do OpenAI:**
- `{{$node["OpenAI"].json.text}}` - Resposta do modelo
- `{{$node["OpenAI"].json.choices[0].message.content}}` - Resposta completa

---

## ✅ Checklist de Configuração

### Gmail Trigger
- [ ] Conta Gmail conectada
- [ ] Evento: Message Received
- [ ] Label: INBOX ou UNREAD

### OpenAI
- [ ] API Key da OpenAI configurada
- [ ] Model: gpt-3.5-turbo ou gpt-4
- [ ] Prompt para classificar emails criado

### IF
- [ ] Condição criada: `OpenAI.text contains "CONSULTA"`
- [ ] Output TRUE ligado a Create Draft
- [ ] Output FALSE ligado a No Operation

### Create Draft
- [ ] To: remetente original
- [ ] Subject: Re: assunto original
- [ ] Message: corpo da resposta
- [ ] ReplyTo: messageId original (opcional)

---

## 🧪 Testar o Workflow

1. **Ativa o workflow** (botão no topo)
2. **Envia um email de teste** para a tua conta Gmail com assunto sobre cavalos
3. **Verifica no n8n** se o workflow foi triggered
4. **Confere o resultado:**
   - Se classificado como CONSULTA → Deve criar rascunho no Gmail
   - Se classificado como SPAM/INFO → No Operation

---

## 🐛 Troubleshooting

### IF sempre retorna FALSE
**Problema:** A condição não está a funcionar
**Solução:**
1. Clica no nó OpenAI → vê o output `json.text`
2. Verifica se contém exatamente `CONSULTA`
3. Ajusta o prompt do OpenAI para garantir resposta consistente

### Rascunho não é criado
**Problema:** Create Draft falha
**Solução:**
1. Verifica se as permissões do Gmail incluem "gmail.compose"
2. Testa com valores fixos primeiro
3. Verifica se `to` tem um email válido

### Workflow não é triggered
**Problema:** Gmail Trigger não ativa
**Solução:**
1. Desativa e reativa o workflow
2. Verifica as permissões do Gmail OAuth
3. Testa com "Test Workflow" manual

---

## 💡 Melhorias Futuras

### 1. **Adicionar nó de log**
Guarda todos os emails processados numa tabela do Supabase

### 2. **Resposta automática via OpenAI**
Gera a resposta completa do email automaticamente

### 3. **Categorização avançada**
Classifica emails por tipo de consulta (venda, compra, linhagem, etc)

### 4. **Envio automático**
Em vez de rascunho, envia resposta diretamente (cuidado!)

---

## 📌 Configuração Rápida (Copy-Paste)

### IF Node Configuration (JSON)

```json
{
  "conditions": {
    "string": [
      {
        "value1": "={{$node[\"OpenAI\"].json.text}}",
        "operation": "contains",
        "value2": "CONSULTA"
      }
    ]
  },
  "combineOperation": "all"
}
```

**Cole isto na configuração do nó IF em "Settings" → "Expression" ou usa o editor visual.**

---

## 🎯 Resultado Final

Quando tudo estiver configurado:

1. ✅ **Email chega** ao Gmail
2. ✅ **OpenAI analisa** e classifica
3. ✅ **IF verifica** se é consulta
4. ✅ **Rascunho criado** automaticamente se TRUE
5. ✅ **Tu apenas revês e envias** o rascunho!

---

**Menos tempo a gerir emails, mais tempo com os Lusitanos! 🐴**
