# 📋 Plano PMO — ConsigAI Webapp (Parte 1/2)
*Baseado no Diagnóstico CMO de 2025-05-07*
**Versão:** 1.0 | **Responsável:** Product Manager / PMO Sênior

---

## 1. Sumário Executivo

O diagnóstico CMO identificou **5 pontos críticos de abandono** no funil e **9 objeções sem resposta** explícita nas telas. O produto tem visual premium e estrutura sólida — os gaps são em copy, confiança e clareza das ofertas.

**Meta principal:** ↑15% conversão Entrada→Contratação | ↓20% abandono no UploadExtrato

**Premissas inegociáveis:**
- Nenhuma alteração em cálculos financeiros ou regras de negócio
- Nenhuma rota ou tela pode ficar inacessível
- Branch separada por fase + build obrigatório antes de cada merge
- Screenshots antes/depois de cada sprint

---

## 2. Roadmap por Fases

| Fase | Objetivo | Escopo | Prioridade | Esforço | Risco | Dependências | Critério de conclusão |
|---|---|---|---|---|---|---|---|
| **F1 — Copy e CTA** | Eliminar textos fracos e jargões | CTAs, headlines, acentos, microcopy | P0 | Baixo | Baixo | Nenhuma | Build ok + copy revisada |
| **F2 — Confiança** | Responder objeções críticas | Microcopy CPF, bloco extrato, badge gratuito, anti-phishing | P0 | Baixo-Médio | Baixo | F1 concluída | 5 objeções respondidas + build ok |
| **F3 — Clareza Ofertas** | Reduzir sobrecarga cognitiva na tela mais importante | Badge recomendado, frases por oferta, posição comparativo | P1 | Médio | Médio | F2 + aprovação produto | Decisão recomendação aprovada |
| **F4 — Conversão** | Otimizar pontos de decisão por tela | Bloco "Como funciona", kicker cadastro, headline portabilidade | P1 | Médio | Médio | F3 concluída | Funil completo testado |
| **F5 — Testes A/B** | Validar hipóteses com dados reais | Instrumentação, variantes copy, análise métricas | P2 | Alto | Baixo | F4 + analytics ativo | 4 hipóteses rastreáveis configuradas |

---

## 3. Backlog Priorizado

### P0 — Crítico (Fases 1 e 2)

| ID | Tarefa | Tela | Tipo | Esforço | Risco | Critério de aceite |
|---|---|---|---|---|---|---|
| B01 | Corrigir acentos/encoding corrompidos | Contratacao, AndamentoPropostas | Copy | Baixo | Baixo | Zero caracteres corrompidos visíveis |
| B02 | Trocar "Ver detalhes da oferta" → "Quero essa economia" (3 cards) | Ofertas | CTA | Baixo | Baixo | CTA atualizado nos 3 cards, build ok |
| B03 | Trocar "Continuar" → "Enviar com segurança e ver ofertas" | UploadExtrato | CTA | Baixo | Baixo | CTA primário atualizado, fluxo ok |
| B04 | Adicionar "(simulação estimada)" abaixo dos valores nos cards | Ofertas | Microcopy | Baixo | Baixo | Texto visível sob cada valor monetário |
| B05 | Trocar "Criar minha conta" → "Descobrir minha economia" | Entrada | CTA | Baixo | Baixo | CTA secundário atualizado |
| B06 | Trocar "Continuar" → "Ver minhas opções de economia" | Cadastro | CTA | Baixo | Baixo | CTA primário atualizado |
| B07 | Renomear rótulo "Refinanciamento" → "Ajuste seu contrato" no card | Ofertas | Copy | Baixo | Médio | Aprovação produto + build ok |
| B08 | Microcopy ao lado do CPF: "Apenas para localizar contratos. Não compartilhamos." | Entrada, Cadastro | Confiança | Baixo | Baixo | Texto visível ao lado do campo CPF |
| B09 | Bloco "Nada é contratado sem sua confirmação" em destaque | UploadExtrato | Confiança | Baixo | Baixo | Bloco visível no painel esquerdo/direito |
| B10 | Badge "Consulta gratuita" | Entrada, Ofertas | Confiança | Baixo | Baixo | Badge visível; aprovação compliance |
| B11 | Frase anti-phishing: "A ConsigAI nunca liga pedindo senha ou código" | Entrada | Confiança | Baixo | Baixo | Frase visível na tela de login |
| B12 | Expandir bloco "Por que enviar seu extrato?" com 3 bullets | UploadExtrato | Confiança | Baixo | Baixo | 3 motivos claros no painel esquerdo |

### P1 — Alto (Fases 3 e 4)

| ID | Tarefa | Tela | Tipo | Esforço | Risco | Critério de aceite |
|---|---|---|---|---|---|---|
| B13 | Badge "Recomendado para você" no card prioritário | Ofertas | Visual/UX | Médio | Médio | 1 card destacado; lógica aprovada por produto |
| B14 | Frase explicativa por tipo de oferta (1 linha em linguagem leiga) | Ofertas (3 cards) | Copy | Baixo | Baixo | 3 frases visíveis em linguagem simples |
| B15 | Mover comparativo antes/depois para acima dos cards | Ofertas | UX | Médio | Médio | Comparativo acima dos cards; mobile ok |
| B16 | Trocar kicker "Etapa 1 de 1" por copy motivacional | Cadastro | Copy | Baixo | Baixo | "Quase lá — seus dados garantem a simulação mais precisa" |
| B17 | Headline Portabilidade com valor real/dinâmico | Portabilidade | Copy | Baixo | Médio | Valor dinâmico ou placeholder documentado |
| B18 | Simplificar "retencao"/"contraproposta" para linguagem leiga | AndamentoPropostas | Copy | Baixo | Baixo | Nenhum jargão técnico sem explicação |
| B19 | Bloco "Como funciona em 3 passos" | Entrada | Componente | Médio | Baixo | Visível, não quebra layout mobile |
| B20 | Estimativa personalizada no loading (INSS/SIAPE) | CarregamentoOfertas | Copy | Baixo | Baixo | "Buscando opções para perfil INSS" visível |
| B21 | Explicar "margem livre" inline | NovoContrato | Copy | Baixo | Baixo | Tooltip ou frase explicativa visível |
| B22 | Frase propósito conta bancária | DadosBancarios | Copy | Baixo | Baixo | "Usamos apenas para creditar valores aprovados" |
| B23 | CTA Contratacao: "Confirmar solicitação — sem custos agora" | Contratacao | CTA | Baixo | Baixo | CTA de confirmação atualizado |
| B24 | Frase âncora: "Você está no controle. Nenhuma surpresa." | Contratacao | Copy | Baixo | Baixo | Frase visível próxima ao CTA |

### P2 — Backlog Futuro (Fase 5+)

| ID | Tarefa | Tela | Tipo | Esforço | Risco | Bloqueio |
|---|---|---|---|---|---|---|
| B25 | FAQ curto (3 perguntas) | Ofertas | Componente | Médio | Baixo | Aprovação UX/Produto |
| B26 | Prova social com número real de beneficiados | Entrada | Copy | Médio | Alto | Dado real + compliance |
| B27 | Logo banco parceiro nos cards | Ofertas | Visual | Médio | Alto | Aprovação banco + legal |
| B28 | Prévia de economia antes do login | Entrada | UX/Dados | Alto | Alto | Decisão estratégica + dados |
| B29 | Simplificar formulário cadastro (menos campos) | Cadastro | UX | Alto | Alto | Avaliação operacional |
| B30 | Renomear "Turbo Economia" para linguagem leiga | Ofertas | Copy | Baixo | Alto | Aprovação produto |

---

## 4. Priorização Impacto × Esforço

### 🟢 Grupo 1 — Quick Wins (Alto impacto, Baixo esforço)
**Execute imediatamente. Sem dependências.**

Tarefas: **B01, B02, B03, B04, B05, B06, B08, B09, B10, B11, B12, B14, B16, B18, B20, B21, B22, B23, B24**

Justificativa: Apenas alterações de texto em componentes existentes. Nenhuma lógica alterada. Impacto direto em confiança e taxa de clique. Risco técnico mínimo.

### 🔵 Grupo 2 — Projetos Prioritários (Alto impacto, Esforço médio)
**Execute após Quick Wins, com planejamento.**

Tarefas: **B13, B15, B17, B19**

Justificativa: Requerem decisão de produto (qual card recomendar, lógica de destaque) e teste visual em mobile. Impacto alto em conversão na tela mais crítica do funil.

### 🟡 Grupo 3 — Melhorias Incrementais (Médio impacto, Esforço baixo)
**Execute em ciclos futuros após aprovação.**

Tarefas: **B07, B25, B30**

Justificativa: Dependem de aprovação de produto. Baixo risco técnico, mas requerem alinhamento estratégico sobre nomenclatura do produto.

### ⚪ Grupo 4 — Deixar para Depois (Alta incerteza ou esforço alto)
**Não execute sem dados reais e aprovações formais.**

Tarefas: **B26, B27, B28, B29**

Justificativa: Risco de compliance, dependência de dados reais de clientes, ou impacto operacional na captação de dados. Requerem decisão executiva antes de qualquer implementação.
