# AUDITORIA COMPLETA - CAVALOS FAMOSOS

**Data:** 2026-02-10
**Ficheiro:** `app/cavalos-famosos/data.ts`

## RESUMO EXECUTIVO

- **Total de cavalos:** 16
- **Com fontes verificadas:** 5 (31%)
- **Sem fontes:** 11 (69%)
- **Inconsistências detectadas:** 1 (pedigree Novilheiro/Opus 72)
- **Status:** 🔴 CRÍTICO - 69% dos dados não verificados

---

## ✅ CAVALOS COM FONTES VERIFICADAS (5/16)

### 1. Novilheiro ✅

- **Fontes:** HorseTelex + Lusitano Collection
- **URLs:**
  - https://www.horsetelex.com/horses/pedigree/1710500/novilheiro
  - http://www.lusitanocollection.com/novi.htm
- **Status:** VERIFICADO (linhas 12-13)
- **⚠️ INCONSISTÊNCIA:** Linha 105 - avoPaterno ano 1974 (deveria ser Dragão 1948)

### 2. Oxidado ✅

- **Fontes:** Lusitano Horse Finder + Horse Magazine
- **URLs:**
  - https://lusitanohorsefinder.com/joao-pedro-rodrigues/
  - https://www.horsemagazine.com/thm/2018/11/pedro-torres-new-face-at-equitana/
- **Status:** VERIFICADO (linhas 146-147)

### 3. Rubi AR ✅

- **Fontes:** Eurodressage + Superior Equine Sires
- **URLs:**
  - https://www.eurodressage.com/2010/10/12/rubi-king-lusitanos-takes-his-throne
  - https://www.superiorequinesires.com/rubi-alter-real/
- **Status:** VERIFICADO (linhas 194-195)

### 4. Quo Vadis ✅

- **Fontes:** Wikipedia + Eurodressage
- **URLs:**
  - https://en.wikipedia.org/wiki/2006_FEI_World_Equestrian_Games
  - https://eurodressage.com/2019/08/12/joao-torrao-and-equador-mvl-shooting-stars-portuguese-dressage
- **Status:** VERIFICADO (linhas 264-265)

### 5. Euclides ✅

- **Fontes:** Wikipedia + Horse Magazine
- **URLs:**
  - https://en.wikipedia.org/wiki/Nuno_Oliveira
  - https://www.horsemagazine.com/thm/2024/03/nuno-oliveira-and-his-treasure-trove-of-equestrian-wisdom/
- **Status:** VERIFICADO (linhas 313-314)

### 6. Equador MVL ✅ (PARCIAL)

- **Fontes:** Eurodressage + Horse & Hound
- **URLs:**
  - https://eurodressage.com/2019/08/12/joao-torrao-and-equador-mvl-shooting-stars-portuguese-dressage
  - https://www.horseandhound.co.uk/news/joao-torrao-equador-dies-786026
- **Status:** Dados básicos VERIFICADOS (linhas 801-802)
- **❌ SEM FONTE:** estatisticasDescendentes (28 descendentes, 22 aprovados...) - REMOVER

---

## ❌ CAVALOS SEM FONTES (10/16)

### PRIORIDADE 1 - OLÍMPICOS

#### 7. Opus 72 🔴 URGENTE

- **Linha:** 82
- **Dados:** Londres 2012, Boaventura Freire, Coudelaria Alter Real
- **Status:** 0% verificado
- **Pesquisar em:**
  - FEI Database: https://www.fei.org (buscar "Opus 72" ou "Boaventura Freire")
  - Eurodressage: "Opus 72 London 2012"
  - APSL: https://www.cavalo-lusitano.com
- **Dados a verificar:**
  - Ano nascimento: 1999
  - Pedigree: Ofensor (1990) x Quina (1992)
  - Jogos Olímpicos Londres 2012: 34º Individual, 67.3%
  - Avô paterno: Novilheiro 1974 (??? inconsistente - deveria ser 1971)
- **❌ REMOVER SE SEM FONTE:** estatisticasDescendentes (45 desc), indiceReproducao (scorePrepotencia 72)

### PRIORIDADE 2 - LENDAS MODERNAS

#### 8. Firme 🔴

- **Linha:** 342
- **Apelido:** "O Patriarca Moderno"
- **Dados:** 1956-1978, pai de Novilheiro
- **Status:** 0% verificado
- **Pesquisar em:**
  - HorseTelex: "Firme 1956"
  - Lusitano Horse Finder
  - APSL: pesquisar "Firme" na base de dados
- **Dados a verificar:**
  - Pai de Novilheiro, Nilo, Neptuno, Opus II
  - Coudelaria Fernando Sommer d'Andrade
  - Pedigree: Dragão (1948) x Fadista (1950)
- **❌ REMOVER SE SEM FONTE:**
  - estatisticasDescendentes (523 desc, 412 aprovados) - dados MUITO detalhados
  - indiceReproducao (scorePrepotencia 98, blupEstimado 142)
  - influenciaGenetica: 22.4

#### 9. Nilo 🔴

- **Linha:** 412
- **Apelido:** "Chefe de Raça"
- **Dados:** 1971-1995, Campeão dos Campeões Golegã 1974
- **Status:** 0% verificado
- **Pesquisar em:**
  - APSL: Campeão dos Campeões 1974
  - Interagro: https://interagro.com.br (linhagem Nilo)
  - Google: "Nilo Campeão dos Campeões 1974"
- **Dados a verificar:**
  - Irmão de Novilheiro
  - Pai de Cagancho (Hermoso de Mendoza)
  - Campeão dos Campeões 1974
- **❌ REMOVER SE SEM FONTE:** estatisticasDescendentes (389), indiceReproducao

#### 10. Xaquiro 🔴

- **Linha:** 472
- **Apelido:** "O Pai de Campeões"
- **Dados:** 1980-2005, mais de 100 medalhas de ouro nos descendentes
- **Status:** 0% verificado
- **Pesquisar em:**
  - APSL: "Xaquiro" + FIPSL 1988/2004
  - Lusitano Horse Finder
  - Google: "Xaquiro Reprodutor de Mérito 2010"
- **Dados a verificar:**
  - Medalhas FIPSL 1988 (Garanhões) e 2004 (Descendentes)
  - Pai de Oxidado (JÁ verificado ter pai Xaquiro)
  - Pedigree: Quieto (1972) x Quieta (1974)
- **❌ REMOVER SE SEM FONTE:** estatisticasDescendentes (412), indiceReproducao

### PRIORIDADE 3 - FUNDADORES (1923-1943)

#### 11-16. Os 6 Fundadores 🟡

- **Agareno** (1931, linha 559)
- **Primoroso** (1927, linha 625)
- **Destinado** (1930, linha 657)
- **Marialva II** (1930, linha 686)
- **Hucharia** (1943, linha 715)
- **Regedor** (1923, linha 745)

**Fonte atual:** "Livro Genealógico Português de Equinos (31/Dez/1989)"
**Problema:** Fonte genérica, não verificável online

**Pesquisar em:**

- APSL oficial: https://www.cavalo-lusitano.com/pt/apsl/livro-genealogico/
- Wikipedia PT: "Puro Sangue Lusitano" artigo sobre fundadores
- EQUISPORT: artigos históricos sobre a raça

**Opção 1:** Se encontrar artigo/PDF do Livro Genealógico online → MANTER
**Opção 2:** Se APSL confirmar os 6 fundadores → MANTER com nova fonte
**Opção 3:** Se não verificável → MARCAR com `_aviso: "Dados históricos não verificáveis online"`

**❌ REMOVER SE SEM FONTE:**

- Todos os `estatisticasDescendentes` (dados muito detalhados para cavalos de 1920-1940)
- Todos os `indiceReproducao`
- `influenciaGenetica` (cálculo sem fonte)

---

## 🔴 INCONSISTÊNCIAS CRÍTICAS

### 1. Opus 72 - Pedigree Impossível (linha 105)

```typescript
pedigree: {
  pai: { nome: "Ofensor", ano: 1990, ... },
  mae: { nome: "Quina", ano: 1992, ... },
  avoPaterno: { nome: "Novilheiro", ano: 1974, destaque: true }, // ❌ ERRO!
}
```

**Problema:**

- Novilheiro nasceu em **1971**, não 1974
- Opus 72 é de 1999, Ofensor (pai) é de 1990
- Se Ofensor (1990) tem pai Novilheiro, este seria de 1971
- **AÇÃO:** Corrigir `ano: 1974` → `ano: 1971`

---

## ⚠️ DADOS SEM FONTE A REMOVER

### Categoria 1: Estatísticas de Descendentes

**Problema:** Números MUITO específicos sem fonte
**Exemplo:** "totalDescendentes: 523, descendentesAprovados: 412, campeoes: 147"

**Cavalos afetados:**

- Novilheiro (linhas 48-58)
- Opus 72 (linhas 135-143)
- Quo Vadis (linhas 294-301)
- Firme (linhas 375-396)
- Nilo (linhas 445-456)
- Xaquiro (linhas 505-525)
- Agareno (linhas 589-609)
- Regedor (linhas 775-785)
- Equador MVL (linhas 862-869)

**AÇÃO:**

- Se encontrar fonte APSL/Interagro → MANTER
- Se não encontrar → REMOVER campo `estatisticasDescendentes` completo

### Categoria 2: Índices de Reprodução

**Problema:** Cálculos estatísticos (scorePrepotencia, blupEstimado) sem fonte

**TODOS os cavalos** têm campo `indiceReproducao` sem fonte:

- scorePrepotencia: 72-99
- consistenciaTipo: 78-96
- taxaAprovacao: 65-83
- blupEstimado: 112-155

**AÇÃO:** REMOVER campo `indiceReproducao` de TODOS os cavalos (não verificável)

### Categoria 3: Influência Genética

**Problema:** Percentagens exatas sem metodologia

**Exemplos:**

- Agareno: 28.5%
- Primoroso: 31.2%
- Firme: 22.4%

**AÇÃO:** REMOVER campo `influenciaGenetica` de TODOS (cálculo sem fonte)

---

## 📋 CHECKLIST DE AÇÕES

### FASE 2: PESQUISA (PRÓXIMA TAREFA)

- [ ] Pesquisar Opus 72 em FEI Database
- [ ] Pesquisar Firme em HorseTelex/APSL
- [ ] Pesquisar Nilo "Campeão dos Campeões 1974"
- [ ] Pesquisar Xaquiro FIPSL 1988/2004
- [ ] Verificar 6 fundadores em APSL/Wikipedia

### FASE 3: CORREÇÃO DO CÓDIGO

- [ ] Corrigir ano avô paterno de Opus 72 (1974→1971)
- [ ] Adicionar comentários `// FONTE:` com URLs
- [ ] Remover `estatisticasDescendentes` não verificados
- [ ] Remover TODOS os `indiceReproducao`
- [ ] Remover TODOS os `influenciaGenetica`
- [ ] Marcar dados históricos com `_aviso` se necessário

### FASE 4: VALIDAÇÃO

- [ ] Script de validação criado
- [ ] 0 dados sem fonte
- [ ] 0 inconsistências de datas
- [ ] 100% cavalos verificados

---

## 🎯 OBJETIVOS FINAIS

**ANTES:** 5/16 cavalos verificados (31%)
**META:** 16/16 cavalos verificados (100%)

**CRITÉRIO DE SUCESSO:**

- Cada cavalo tem pelo menos 1 URL de fonte verificável
- 0 inconsistências de datas/pedigrees
- 0 dados não verificados (ou marcados com `_aviso`)
- Código passa em script de validação

---

**PRÓXIMA AÇÃO:** Começar pesquisa sistemática dos 10 cavalos sem fontes
