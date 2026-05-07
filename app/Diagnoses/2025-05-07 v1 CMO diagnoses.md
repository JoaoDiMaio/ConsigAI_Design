# 🧠 Diagnóstico CMO — ConsigAI
*Análise como consultor sênior de marketing, growth e conversão*

---

## Parte 1 — Diagnóstico Comercial Geral

### Notas de 0 a 10

| Critério | Nota | Observação |
|---|---|---|
| Clareza da proposta de valor | **8/10** | Headline "Veja quanto você pode Economizar" é forte. Falta quantificar o benefício médio |
| Força da promessa principal | **7/10** | "Economizar" é boa âncora, mas genérica. Falta "R$ X por mês em média" |
| Confiança transmitida | **7.5/10** | LGPD presente, simulação sinalizad. Falta nome do banco parceiro visível |
| Facilidade de entender o produto | **6.5/10** | "Portabilidade", "Refinanciamento" são jargões sem explicação para leigos |
| Força dos CTAs | **7/10** | "Ver minha economia" (Entrada) excelente. "Ver detalhes da oferta" fraco |
| Clareza das ofertas | **6/10** | 3 cards simultâneos sobrecarregam. Cliente não sabe qual escolher |
| Redução de objeções | **5.5/10** | Golpe e contratação automática não respondidas explicitamente nas telas iniciais |
| Diferenciação da ConsigAI | **6/10** | IA mencionada, mas não explicada como diferencial real |
| Potencial de conversão | **7/10** | Funil bem estruturado, mas pontos de fricção em Upload e Ofertas |
| Adequação para fintech financeira | **8/10** | Visual premium, LGPD, tom profissional. Falta peso institucional |

### Respostas Diretas

| Pergunta | Resposta |
|---|---|
| Em 5 segundos, o cliente entende o que a ConsigAI faz? | **Sim** — "Veja quanto você pode Economizar" + subtítulo é claro |
| O cliente entende por que deveria continuar? | **Parcialmente** — Benefício está lá, mas não tem prova social ou número concreto |
| A promessa principal é forte? | **Moderada** — "Economizar" é vaga. Faltam números como "R$ 250/mês em média" |
| A promessa parece segura ou exagerada? | **Segura** — Tom adequado, "simulação" aparece nos CTAs secundários |
| O cliente entende que é simulação? | **Parcialmente** — Aparece em microcopy, não no headline. Pode confundir |
| O cliente entende o benefício específico para ele? | **Apenas depois das Ofertas** — Entrada não personaliza benefício |
| O produto parece confiável? | **Sim** — Visual premium e LGPD ajudam muito |
| Existe parte confusa/técnica/fraca comercialmente? | **Sim** — Tela Ofertas com 3 cards + jargões. UploadExtrato sem LGPD explícita |

---

## Parte 2 — Análise por Tela

| Tela | O que comunica hoje | Problema comercial | Objeção do cliente | Sugestão de melhoria | Prioridade |
|---|---|---|---|---|---|
| **Entrada** | "Veja quanto você pode Economizar" + login | CTA "Ver minha economia" ótimo. Porém sem número concreto. "Criar minha conta" compete com "Ver minha economia" | "Isso é golpe?" / "Por que preciso de CPF?" | Adicionar microcopy ao lado do CPF: "Usado apenas para localizar contratos. Não compartilhamos." | 🔴 Alta |
| **Cadastro** | Formulário de dados pessoais + painel lateral com passos | Formulário longo sem justificativa clara. "Por que preciso dar todos esses dados?" não está respondido | "Vão usar meus dados?" / "É obrigatório tudo?" | Adicionar razão ao lado de cada campo (ex: CPF → "Para buscar seus contratos com segurança") | 🔴 Alta |
| **UploadExtrato** | "Envie seu extrato" | Não responde "vão contratar algo automaticamente?" Título do painel esquerdo não fala em segurança antifraude | "Vão assinar algo pelo meu extrato?" / "Meu documento está seguro?" | Adicionar bloco "O que fazemos com seu extrato" + frase "Nada é contratado sem sua confirmação" em destaque | 🔴 Alta |
| **CarregamentoOfertas** | Loading com passos e barra de progresso | Boa tela. Falta criar antecipação: "Estamos achando R$ X de economia para você" personalizado | "Quanto tempo vai demorar?" | Toast final "Análise concluída" é ótimo. Adicionar estimativa: "Em segundos você verá suas opções" | 🟡 Média |
| **Ofertas** | 3 cards: Novo Contrato, Refinanciamento, Turbo Economia | 3 cards simultâneos sem recomendação clara sobrecarregam. "Ver detalhes da oferta" é fraco. CTA fixo inferior é forte | "Qual oferta devo escolher?" / "Por que tem 3 opções?" | Destacar 1 oferta como "Recomendada para você". Trocar "Ver detalhes da oferta" por "Quero essa economia" | 🔴 Alta |
| **Portabilidade** | "Compare e veja quanto pode Economizar" + comparativo parcela antes/depois | Headline duplica o da Entrada. Badges "Prazo sem esticar" são bons mas pequenos | "Vou ficar preso num contrato longo?" | Mudar headline para "Pague R$54 a menos por mês — sem esticar seu prazo" (usando número real) | 🔴 Alta |
| **NovoContrato** | "Receba dinheiro na sua conta" | Falta explicar o que é "margem livre" para leigos | "Vou me endividar mais?" | Adicionar frase: "Só disponível se você tiver espaço na folha. A ConsigAI verifica por você." | 🟡 Média |
| **Refinanciamento** | "Dinheiro ajustando seu contrato" | Jargão "refinanciamento" no título. Usuário leigo não entende | "Isso aumenta minha dívida?" | Renomear para "Ajuste seu contrato e receba dinheiro" e explicar em 1 frase simples | 🔴 Alta |
| **Contratacao** | "Revise sua contratação" + checklist | Excelente estrutura. "Revise sua contratacao" com acento errado (sem cedilha em telas) | "É seguro confirmar agora?" | Corrigir caracteres especiais. Adicionar frase âncora: "Você está no controle. Nenhuma surpresa." | 🟡 Média |
| **DadosBancarios** | Dados bancários para recebimento | Não analisado visualmente — verificar se comunica claramente propósito | "Para que serve minha conta?" | Adicionar: "Usamos sua conta apenas para creditar os valores aprovados" | 🟡 Média |
| **AndamentoPropostas** | "Acompanhe suas propostas e contratos" | Ótima tela. Texto "retencao", "contraproposta" são jargões. Acentos faltando | "Por que o valor mudou do que foi apresentado?" | Trocar "retencao" por "O banco de origem tentou segurar sua portabilidade — entenda o que aconteceu" | 🟡 Média |

---

## Parte 3 — Proposta de Valor e Posicionamento

### Diagnóstico

1. **Proposta de valor atual percebida:** "Comparador de consignado que usa IA para mostrar economia"
2. **Proposta de valor ideal:** "A ConsigAI encontra onde você está pagando a mais e mostra o caminho mais simples para pagar menos — sem risco, sem surpresa"
3. **O que a ConsigAI está vendendo hoje:** Economia + Controle (misturado)
4. **O que deveria ser o eixo principal:** **Controle + Clareza** → "Você no controle, com clareza antes de decidir"
5. **O nome ConsigAI está sendo bem usado?** Parcialmente — "ConsigAI compara por você" é bom. "ConsigAI mostra" é melhor que "IA analisa"
6. **O conceito de IA ajuda ou parece genérico?** Genérico. "Nossa IA" sem explicação não diferencia
7. **Como explicar IA sem ser buzzword:** "A ConsigAI lê seu extrato e compara mais de 20 combinações em segundos para encontrar a melhor para você"
8. **O produto parece diferente de correspondente bancário?** Levemente. Falta enfatizar a comparação imparcial

### Textos Sugeridos

| Elemento | Texto Sugerido |
|---|---|
| **Headline principal** | "Veja exatamente quanto você pode deixar de pagar por mês" |
| **Subheadline** | "A ConsigAI compara seus contratos e mostra a melhor opção — com taxa, prazo e parcela antes de você decidir" |
| **Frase de posicionamento** | "Consignado com clareza. Você decide, sem surpresa." |
| **Promessa principal** | "Veja sua economia estimada em menos de 3 minutos" |
| **Promessa secundária** | "Nada é contratado sem sua confirmação" |
| **Frase de segurança** | "Seus dados protegidos pela LGPD. Zero compartilhamento com terceiros." |
| **Frase de diferenciação** | "Diferente de um correspondente bancário, a ConsigAI compara opções e mostra a melhor para o seu caso — não para o banco" |

---

## Parte 4 — Oferta e Conversão

### CTAs — Diagnóstico e Sugestões

| Tela | CTA atual | Problema | CTA sugerido | Motivo |
|---|---|---|---|---|
| Entrada | "Ver minha economia" | ✅ Excelente | Manter | Orientado a benefício |
| Entrada | "Criar minha conta" | Muito genérico | "Descobrir minha economia" | Foco no resultado |
| Cadastro | "Continuar" | Fraco, sem benefício | "Ver minhas opções de economia" | Reforça o próximo passo com valor |
| UploadExtrato | "Continuar" | Sem segurança | "Enviar com segurança e ver ofertas" | Reduz medo + aponta destino |
| Ofertas | "Ver detalhes da oferta" | Fraco, burocrático | "Quero essa economia" | Foco em ação com desejo |
| Ofertas (fixo) | "Continuar com esta oferta →" | Bom mas incompleto | "Continuar — você ainda pode revisar tudo" | Reduz medo de comprometimento |
| Portabilidade | Não identificado claramente | — | "Confirmar e ver como contratar" | Clareza do próximo passo |
| Contratacao | Não visível | — | "Confirmar solicitação — sem custos agora" | Remove objeção financeira |
| AndamentoPropostas | "Ver próximas ações" | Bom | Manter | Claro e orientado à ação |

---

## Parte 5 — Objeções do Cliente

| Objeção | Onde responder | Respondida hoje? | Texto sugerido | Prioridade |
|---|---|---|---|---|
| "Isso é golpe?" | Entrada + Cadastro | ❌ Não | "ConsigAI é plataforma regulada. CNPJ: XX. Parceiros: [banco]." | 🔴 Alta |
| "Vão contratar algo sem eu saber?" | UploadExtrato + Ofertas + Contratacao | ⚠️ Parcialmente | "Nada é contratado sem você ler, aceitar e confirmar. Passo a passo." | 🔴 Alta |
| "Meu CPF está seguro?" | Entrada | ❌ Não | "CPF usado apenas para localizar contratos. Protegido pela LGPD." | 🔴 Alta |
| "Por que preciso enviar extrato?" | UploadExtrato | ⚠️ Parcialmente | "Seu extrato mostra quais contratos podem ser melhorados. Sem ele, não conseguimos comparar com precisão." | 🔴 Alta |
| "Essa economia é garantida?" | Ofertas + Portabilidade | ⚠️ Parcialmente | "Estes valores são simulação estimada. A oferta real pode variar — você vê as condições exatas antes de confirmar." | 🟡 Média |
| "Vou pagar alguma coisa?" | Entrada + Ofertas | ❌ Não | "A consulta é gratuita. Você só avança se quiser — sem taxas de análise." | 🔴 Alta |
| "Minha parcela pode aumentar?" | Ofertas + Portabilidade | ❌ Não | "A ConsigAI só mostra opções onde sua parcela fica igual ou menor." | 🔴 Alta |
| "Isso afeta meu benefício INSS?" | Cadastro + UploadExtrato | ❌ Não | "Portabilidade e refinanciamento não afetam seu benefício. Apenas reorganizam o desconto na folha." | 🔴 Alta |
| "Quem está por trás da oferta?" | Ofertas | ❌ Não | Mostrar logo do banco parceiro no card de oferta | 🟡 Média |
| "Posso comparar antes de decidir?" | Ofertas | ✅ Sim | Manter. Reforçar com "Compare sem pressa. Nada acontece até você confirmar." | 🟢 Baixa |

---

## Parte 6 — UX Writing e Copywriting

| Tela | Texto atual | Problema | Texto sugerido | Princípio usado |
|---|---|---|---|---|
| Entrada (painel esq.) | "Veja quanto você pode Economizar" | Ótimo mas sem número | "Veja se você pode pagar R$ 200 a menos por mês" | Especificidade converte mais |
| Entrada (subtítulo) | "A ConsigAI compara seus contratos e mostra opções para pagar menos..." | Longo | "Compare. Decida. Economize — com clareza." | Hierarquia e ritmo |
| Cadastro (kicker) | "Etapa 1 de 1 — Perfil" | Não transmite progresso com contexto | "Quase lá — seus dados garantem a simulação mais precisa" | Continuidade motivada |
| UploadExtrato (título) | "Envie seu extrato" | Comando frio | "Seu extrato é o mapa da sua economia" | PAS — mostra o porquê |
| Ofertas (card Refinanciamento) | "Dinheiro ajustando seu contrato" | Jargão implícito | "Pegue dinheiro e reduza o custo do seu contrato atual" | Clareza antes de persuasão |
| Ofertas (card Turbo) | "Escolha onde quer Economizar" | Abstrato | "Quer mais dinheiro agora ou pagar menos todo mês? Escolha." | Jobs To Be Done |
| Portabilidade | "Parcela atual R$550 → Parcela nova R$496" | Bom, mas sem contexto emocional | "De R$550 para R$496/mês — R$54 a mais no seu bolso todo mês" | Impacto emocional do ganho |
| CarregamentoOfertas | "Análise em andamento" | Kicker neutro | "Encontrando sua economia..." | Antecipação e desejo |
| CarregamentoOfertas | "Nenhuma contratação é feita sem sua confirmação" | Bom! | Manter e tornar mais visível | Redução de medo |
| AndamentoPropostas | "retencao", "contraproposta" | Jargão técnico | "O banco tentou manter o contrato — veja o que mudou" | Linguagem simples |
| Contratacao | "Revise sua contratacao" | Falta de acentos | "Revise sua contratação" | Profissionalismo |

---

## Parte 7 — Funil e Jornada

### AIDA aplicado ao ConsigAI

| Etapa | Tela | Força atual | Risco de abandono |
|---|---|---|---|
| **Atenção** | Entrada | ✅ Forte — headline claro, visual premium | Baixo |
| **Interesse** | Cadastro | ⚠️ Médio — formulário longo sem motivação incremental | Médio-alto |
| **Desejo** | UploadExtrato | ⚠️ Fraco — cliente não sabe o que vai receber | Alto |
| **Desejo** | CarregamentoOfertas | ✅ Bom — loading com contexto e segurança | Baixo |
| **Ação** | Ofertas | ⚠️ Médio — 3 cards sem recomendação clara | Alto |
| **Confiança** | Portabilidade/Refinanciamento | ✅ Bom — comparativo antes/depois | Baixo |
| **Decisão** | Contratacao | ✅ Bom — checklist e resumo claro | Baixo |
| **Continuidade** | AndamentoPropostas | ✅ Excelente — timeline, transparência total | Muito baixo |

### Pontos de Abandono

| Etapa | Motivo provável | Impacto | Como corrigir |
|---|---|---|---|
| Entrada → Cadastro | "Preciso criar conta só para ver?" | 🔴 Alto | Mostrar prévia da economia antes do cadastro (ex: "Pessoas como você economizaram R$ 180/mês em média") |
| Cadastro → Upload | Formulário longo sem benefício visível | 🔴 Alto | Barra de progresso com mensagem motivacional. Reduzir campos para CPF + nome + benefício |
| UploadExtrato → Carregamento | Medo de enviar documento | 🔴 Alto | Adicionar bloco "O que fazemos com seu extrato" + depoimento ou certificado de segurança |
| Ofertas → Detalhe | 3 ofertas simultâneas confundem | 🟡 Médio | Destacar 1 como recomendada. Esconder as outras com "Ver mais opções" |
| Ofertas → Contratacao | Medo de comprometimento | 🟡 Médio | CTA com "você ainda pode revisar" + lembrar que é simulação |

---

## Parte 8 — Novos Elementos Recomendados

| Elemento | Onde inserir | Problema que resolve | Impacto esperado | Prioridade |
|---|---|---|---|---|
| Bloco "Como funciona" (3 passos) | Entrada — abaixo do formulário | Cliente não sabe o processo | ↑ Confiança + ↓ abandono no cadastro | 🔴 Alta |
| Microcopy ao lado do CPF | Entrada + Cadastro | Medo de fraude/golpe | ↓ Hesitação no formulário | 🔴 Alta |
| Badge "Consulta 100% gratuita" | Entrada e Ofertas | Medo de custo oculto | ↑ Taxa de início | 🔴 Alta |
| Bloco "Nada é contratado sem sua confirmação" | UploadExtrato + CarregamentoOfertas | Medo de contratação automática | ↓ Abandono nesta etapa | 🔴 Alta |
| Card "Recomendado para você" | Ofertas | Cliente não sabe qual oferta escolher | ↑ Conversão para detalhe | 🔴 Alta |
| Microcopy "Simulação estimada" | Cards de oferta | Expectativa de garantia | ↓ Reclamações pós-conversão | 🟡 Média |
| Explicação de jargão inline | Portabilidade, Refinanciamento | Leigos não entendem os termos | ↑ Engajamento | 🟡 Média |
| Bloco "Por que enviar seu extrato?" | UploadExtrato | Resistência ao upload | ↓ Abandono nesta etapa | 🔴 Alta |
| Número de pessoas beneficiadas | Entrada | Falta prova social | ↑ Confiança inicial | 🟡 Média |
| FAQ curto (3 perguntas) | Abaixo das Ofertas | Objeções não respondidas | ↓ Abandono antes de contratar | 🟡 Média |

---

## Parte 9 — O que Preservar

| Elemento | Por que funciona |
|---|---|
| CTA "Ver minha economia" (Entrada) | Orientado a benefício, não a ação burocrática |
| Visual premium azul+verde | Transmite confiança de fintech séria |
| Comparativo antes/depois (Portabilidade) | Concretiza o benefício de forma visual e clara |
| Loading com passos e progresso (CarregamentoOfertas) | Mantém engajamento, reduz ansiedade |
| Frase "Nenhuma contratação é feita sem sua confirmação" | Responde a principal objeção de medo |
| Bloco "Você no controle" (Ofertas, sidebar) | Excelente — combate medo de perda de controle |
| Checklist de documentos (Contratacao) | Transparência que gera confiança |
| Comparativo oferta apresentada vs. concretizada (AndamentoPropostas) | Diferencial raro. Mantém reputação |
| Badge LGPD (Cadastro) | Necessário para público 60+ |
| FontSizeToggle (A/A+) | Inclusão para público idoso. Excelente detalhe |
| Timeline de proposta (AndamentoPropostas) | Raríssimo em fintechs. Cria lealdade |

---

## Parte 10 — Plano de Ação

### Fase 1 — Correções Rápidas de Copy e CTA *(1–2 dias)*

**Objetivo:** Eliminar textos fracos e jargões que causam confusão
- Corrigir todos os acentos faltando (Contratacao, AndamentoPropostas)
- Trocar "Ver detalhes da oferta" por "Quero essa economia" nos 3 cards
- Trocar "Continuar" (UploadExtrato) por "Enviar com segurança e ver ofertas"
- Adicionar "(simulação estimada)" abaixo de todos os valores monetários em cards de oferta
- Renomear "Refinanciamento" para "Ajuste seu contrato" no card de Ofertas

**Impacto esperado:** ↑ CTR dos cards de oferta. ↓ Confusão no UploadExtrato
**Risco:** Baixo
**Prioridade:** 🔴 Imediata

---

### Fase 2 — Confiança e Objeções *(3–5 dias)*

**Objetivo:** Responder às 5 objeções principais que causam abandono
- Adicionar microcopy ao lado do campo CPF: "Apenas para localizar seus contratos. Não compartilhamos."
- Adicionar bloco "Nada é contratado sem sua confirmação" no UploadExtrato (painel direito)
- Adicionar badge "Consulta 100% gratuita" na Entrada e no topo das Ofertas
- Adicionar frase anti-phishing na Entrada: "A ConsigAI nunca liga pedindo senha ou código"
- Adicionar "Por que enviar seu extrato?" com 3 bullets no painel esquerdo do UploadExtrato

**Impacto esperado:** ↓ Abandono no UploadExtrato (estimativa: -20%). ↑ Confiança inicial
**Risco:** Baixo
**Prioridade:** 🔴 Alta

---

### Fase 3 — Clareza das Ofertas *(5–7 dias)*

**Objetivo:** Reduzir sobrecarga cognitiva na tela mais importante do funil
- Destacar 1 card com badge "Recomendado para você" (baseado no perfil do cliente)
- Adicionar frase de 1 linha explicando cada tipo de oferta em linguagem leiga:
  - Novo Contrato: "Para quem tem margem disponível e quer dinheiro na conta"
  - Refinanciamento: "Para quem já tem contrato e quer pegar mais dinheiro ou reduzir custo"
  - Turbo Economia: "Para quem quer só pagar menos — sem novo dinheiro"
- Substituir "Turbo Economia" por "Reduzir o que pago" (mais claro para leigos)
- Mover o comparativo antes/depois para cima dos cards na Ofertas

**Impacto esperado:** ↑ Conversão na Ofertas. ↓ Tempo de decisão. ↓ Abandono por confusão
**Risco:** Médio (teste visual recomendado)
**Prioridade:** 🔴 Alta

---

### Fase 4 — Conversão por Tela *(1–2 semanas)*

**Objetivo:** Otimizar cada ponto de decisão no funil
- Entrada: Adicionar bloco "Como funciona em 3 passos" abaixo do formulário
- Cadastro: Reduzir formulário para campos essenciais. Mover campos secundários para depois
- CarregamentoOfertas: Adicionar estimativa personalizada "Buscando opções para perfil INSS"
- Portabilidade: Mudar headline para incluir o valor real (ex: "R$54 a menos por mês")
- AndamentoPropostas: Simplificar jargões ("retencao" → "banco tentou manter o contrato")

**Impacto esperado:** ↑ Taxa de conclusão do funil completo
**Risco:** Médio
**Prioridade:** 🟡 Média

---

### Fase 5 — Testes A/B Futuros *(após Fases 1-4)*

**Objetivo:** Validar hipóteses com dados reais

| Hipótese | Variável A | Variável B | Métrica |
|---|---|---|---|
| Número concreto na Entrada aumenta conversão? | "Veja quanto pode Economizar" | "Clientes economizam R$ 180/mês em média" | CTR → Cadastro |
| Badge "Recomendado" aumenta cliques no card? | 3 cards iguais | 1 card destacado como recomendado | CTR → Detalhe |
| "Gratuito" reduz abandono? | Sem menção a custo | Badge "Consulta gratuita" | Abandono na Entrada |
| Explicação de extrato reduz abandono? | Tela atual | Tela com bloco "Por que seu extrato?" | Abandono no Upload |

---

## Parte 11 — Decisões que Precisam de Aprovação

Antes de implementar qualquer alteração, confirme:

1. **Nome do(s) banco(s) parceiro(s)** podem ser exibidos nos cards de oferta? → Necessário para responder "quem está por trás da oferta"
2. **Qual é o benefício médio real dos clientes?** (R$/mês) → Necessário para promessa concreta na Entrada sem ser enganosa
3. **Posso adicionar "Consulta 100% gratuita"?** → Confirmar modelo de negócio (comissão do banco, não do cliente)
4. **Podemos simplificar o cadastro** (menos campos inicialmente)? → Impacto técnico/operacional
5. **"Turbo Economia" pode ser renomeado** para linguagem mais simples? → Decisão de produto
6. **Podemos mostrar prévia de economia antes do login** (ex: "Pessoas como você economizaram R$ X")? → Decisão de produto/dados
7. **Posso adicionar FAQ** na tela de Ofertas sem prejudicar o fluxo visual? → Decisão de UX
8. **Os acentos faltando** (Contratacao, AndamentoPropostas) são intencionais ou bug? → Verificar encoding

---

*Análise realizada com base na revisão visual de todas as telas, código-fonte de cada página e navegação como usuário real. Frameworks aplicados: AIDA, PAS, Jobs To Be Done, Value Proposition Canvas, Psicologia de Decisão.*
