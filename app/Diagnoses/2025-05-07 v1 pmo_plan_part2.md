# 📋 Plano PMO — ConsigAI Webapp (Parte 2/2)
*Sprints, Riscos, Testes, Métricas e Execução Segura*

---

## 5. Plano por Sprints

| Sprint | Objetivo | Tarefas | Telas | Entregáveis | Testes obrigatórios | Definição de pronto |
|---|---|---|---|---|---|---|
| **S0 — Preparação** | Baseline, segurança, branches | Nenhuma alteração de código | Todas | Branch `main` tagueada; screenshots baseline; build confirmado | `npm run build` ok; rotas todas acessíveis | Ambiente estável documentado |
| **S1 — Copy e CTA** | Quick wins de texto | B01–B06 | Entrada, Cadastro, UploadExtrato, Ofertas, Contratacao, AndamentoPropostas | 8 textos alterados | Build ok; fluxo Entrada→Ofertas ok; acentos corretos | PR revisado; nenhum erro de console |
| **S2 — Confiança** | Responder objeções críticas | B08–B12 | Entrada, Cadastro, UploadExtrato | 5 elementos de confiança adicionados | Build ok; mobile ok; textos visíveis em todas as resoluções | 5 objeções respondidas; zero quebra de layout |
| **S3 — Clareza Ofertas** | Reduzir sobrecarga na tela principal | B13–B15 + B04 (se pendente) | Ofertas | Badge recomendado; frases por oferta; comparativo reposicionado | Build ok; 3 cards funcionando; CTA fixo inferior ok; mobile ok | Decisão de recomendação implementada e testada |
| **S4 — Conversão** | Otimizar pontos de decisão | B16–B24 | Todas as demais | Bloco "Como funciona"; kickers atualizados; jargões simplificados | Funil completo Entrada→Andamento testado; zero undefined; mobile ok | Taxa de erro de console = 0; funil navegável |
| **S5 — Instrumentação** | Rastrear e testar hipóteses | B25, configuração analytics, variantes A/B | Entrada, Ofertas, UploadExtrato | 4 hipóteses de A/B configuradas; eventos rastreados | Eventos disparando corretamente; nenhum dado PII vazando | Hipóteses mensuráveis com baseline definido |

---

## 6. Dependências e Decisões Necessárias

| Decisão | Por que é necessária | Impacto se não decidir | Responsável | Prioridade |
|---|---|---|---|---|
| Posso usar "Consulta 100% gratuita"? | Modelo de negócio pode incluir taxas indiretas | Não inclui badge → objeção de custo sem resposta | CEO / Compliance | P0 |
| Qual benefício médio real (R$/mês)? | Necessário para promessa concreta sem ser enganosa | Entrada continua genérica, menor conversão | Dados / Produto | P0 |
| Pode exibir nome do banco parceiro? | Responde "quem está por trás da oferta" | Cards de oferta sem credibilidade institucional | Legal / Parceiro | P1 |
| Pode renomear "Turbo Economia"? | Nomenclatura de produto alinhada com time | Nome confuso permanece para leigos | Produto | P1 |
| Pode simplificar formulário de cadastro? | Menos campos = menos abandono, mas pode impactar análise de crédito | Cadastro continua com fricção alta | Produto / Ops | P1 |
| Pode mostrar prévia de economia antes do login? | Alto impacto em conversão inicial | Barreira do cadastro permanece sem motivação | Produto / Dados | P2 |
| Pode adicionar FAQ na tela Ofertas? | Responde objeções sem abandonar o fluxo | Objeções respondidas só em suporte | UX / Produto | P1 |
| Acentos faltando são bug ou encoding proposital? | Define se é correção técnica ou decisão editorial | Profissionalismo comprometido nas telas finais | Frontend | P0 |
| Texto aprovado de LGPD e "sem contratação automática"? | Risco legal se texto não for validado por compliance | Frase mal escrita pode gerar reclamação | Legal / Compliance | P0 |

---

## 7. Matriz de Risco

| Risco | Probabilidade | Impacto | Mitigação | Dono |
|---|---|---|---|---|
| Promessa comercial exagerada (ex: "economia garantida") | Baixa | Alto | Revisar todo copy novo com compliance antes de publicar | Legal |
| Confusão entre simulação e aprovação real | Média | Alto | Manter "(simulação estimada)" em todos os valores; nunca remover | Produto |
| Alteração quebrar fluxo crítico de navegação | Baixa | Muito alto | Build obrigatório + teste de funil completo antes de merge | Frontend |
| Alteração visual quebrar mobile | Média | Alto | Teste em 375px e 768px antes de cada sprint | Frontend |
| CTA gerar expectativa errada (ex: "gratuito" quando há custo) | Média | Alto | Decisão de compliance antes de adicionar badge | CEO / Legal |
| Jargão técnico substituído por texto impreciso | Baixa | Médio | Revisão de copy por alguém do time de produto que conheça o domínio | Produto / Marketing |
| Excesso de informação reduzir conversão | Baixa | Médio | Testar em A/B; não adicionar mais de 1 novo bloco por sprint sem validação | UX |
| Encoding de acentos causar erro em produção | Média | Médio | Verificar arquivo source + build em ambiente de staging | Frontend |
| Renomear oferta causar confusão com documentação interna | Baixa | Baixo | Alinhar nomenclatura com time antes de alterar | Produto |

---

## 8. Critérios de Aceite por Tela

| Tela | Critérios de aceite | Testes obrigatórios |
|---|---|---|
| **Entrada** | CTA "Ver minha economia" preservado; microcopy CPF visível; badge "gratuito" presente; frase anti-phishing; sem promessa de aprovação; mobile ok | Renderização 375px + 1280px; fluxo para Cadastro ok; console limpo |
| **Cadastro** | Kicker motivacional; microcopy de uso dos dados; badge LGPD visível; CTA "Ver minhas opções de economia"; formulário sem erros de validação | Fluxo para UploadExtrato ok; validações CPF/data funcionando; mobile ok |
| **UploadExtrato** | Bloco "Por que enviar?" com 3 bullets; "Nada é contratado sem sua confirmação" em destaque; CTA "Enviar com segurança"; erro de arquivo vazio tratado | Upload de arquivo ok; navegação para CarregamentoOfertas; console limpo |
| **CarregamentoOfertas** | Loading com passos funcionando; estimativa de perfil (INSS/SIAPE); texto de segurança visível; toast de conclusão funcionando | Timer e navegação para Ofertas ok; nenhum undefined; mobile ok |
| **Ofertas** | "(simulação estimada)" em todos os valores; frases explicativas por oferta; 1 card com badge recomendado; CTA "Quero essa economia"; CTA fixo inferior ok; sidebar "Você no controle" preservada | 3 cards renderizando; CTA fixo funcionando; fluxo para detalhe ok; mobile ok |
| **NovoContrato** | "Margem livre" explicado em linguagem simples; sem promessa de aprovação; CTA claro | Renderização ok; navegação de volta para Ofertas; mobile ok |
| **Refinanciamento** | Rótulo em linguagem simples; explicação de 1 linha sem jargão; comparativo antes/depois preservado | Renderização ok; dados de comparativo corretos; mobile ok |
| **Portabilidade** | Headline com valor dinâmico ou placeholder claro; badges "Prazo sem esticar" visíveis; comparativo antes/depois ok | Renderização ok; navegação para Contratacao; mobile ok |
| **Contratacao** | Acentos corretos; CTA "Confirmar solicitação — sem custos agora"; frase âncora de controle; checklist de documentos preservado; resumo da oferta correto | Fluxo para DadosBancarios ok; checklist funcional; mobile ok; console limpo |
| **DadosBancarios** | Frase propósito da conta visível; sem promessa de crédito garantido | Renderização ok; navegação correta; console limpo |
| **AndamentoPropostas** | Acentos corretos; "retencao"/"contraproposta" em linguagem simples; timeline funcionando; comparativo oferta apresentada vs concretizada preservado | Timeline ok; cards de proposta renderizando; mobile ok; console limpo |

---

## 9. Plano de Testes

| Teste | Objetivo | Como executar | Critério de aprovação |
|---|---|---|---|
| Build de produção | Verificar se código compila sem erros | `npm run build` na pasta `/app` | Exit code 0; sem erros fatais |
| Lint (se existir) | Verificar qualidade de código | `npm run lint` | Zero erros (warnings tolerados) |
| Renderização telas críticas | Verificar que nenhuma tela quebrou | Navegar manualmente para cada rota | Todas as 13 rotas carregam sem tela branca |
| Fluxo completo Entrada→AndamentoPropostas | Verificar funil sem interrupção | Seguir jornada completa de usuário | Nenhuma rota 404 ou erro de runtime |
| Console sem erro | Verificar ausência de erros JS | DevTools → Console em cada tela | Zero erros vermelhos (warnings aceitáveis) |
| Valores numéricos corretos | Verificar que cálculos não quebraram | Verificar NaN/undefined em todos os valores monetários | Nenhum NaN ou undefined visível |
| Mobile/responsivo | Verificar layout em telas pequenas | DevTools → 375px (iPhone SE) e 768px (iPad) | Sem overflow horizontal; CTAs clicáveis |
| CTAs funcionando | Verificar que todos os botões navegam | Clicar em cada CTA principal | Rota correta ativada; sem erro |
| Screenshots antes/depois | Documentar mudanças visuais | Screenshot de cada tela afetada antes e depois do sprint | Par de imagens arquivado por sprint |
| Revisão de copy e compliance | Verificar textos sem promessa enganosa | Leitura humana de todos os textos novos | Nenhuma promessa de aprovação garantida ou economia garantida |

**Fluxos críticos a testar em cada sprint:**
1. Entrada → Cadastro → UploadExtrato → CarregamentoOfertas → Ofertas
2. Ofertas → NovoContrato → Contratacao → DadosBancarios
3. Ofertas → Refinanciamento → Contratacao
4. Ofertas → Portabilidade → Contratacao
5. Contratacao → AndamentoPropostas

---

## 10. Métricas de Sucesso

| Métrica | Tela/Funil | Por que importa | Como medir | Meta inicial |
|---|---|---|---|---|
| CTR Entrada → Cadastro | Entrada | Principal gargalo de entrada | Analytics: clique em CTA → rota /cadastro | Baseline + 10% em 30 dias |
| Taxa de conclusão do Cadastro | Cadastro | Fricção do formulário | Analytics: início vs. envio do form | Baseline + 8% |
| Taxa de upload concluído | UploadExtrato | Principal ponto de abandono | Analytics: arquivo enviado com sucesso | Baseline + 20% |
| Abandono no UploadExtrato | UploadExtrato | Medo de enviar documento | Analytics: sessões que chegam mas não avançam | Redução de 20% |
| CTR por card de Oferta | Ofertas | Eficácia da recomendação | Analytics: clique em "Quero essa economia" por card | Card recomendado ≥ 50% dos cliques |
| CTR em "Continuar com esta oferta" | Ofertas | Conversão principal | Analytics: clique no CTA fixo inferior | Baseline + 12% |
| Taxa de avanço para Contratacao | Ofertas → Contratacao | Qualidade da decisão | Analytics: rota /contratacao iniciada | Baseline + 10% |
| Taxa de propostas no Andamento | AndamentoPropostas | Retenção pós-conversão | Analytics: sessões em /andamento-propostas | Crescimento proporcional ao volume |
| Erro de formulário por campo | Cadastro, DadosBancarios | Fricção por campo | Analytics: evento de erro por campo | Redução de 15% nos erros de CPF |
| Abandono mobile vs. desktop | Todas | Gap de experiência mobile | Analytics: taxa de conclusão segmentada | Gap < 10 pontos percentuais |

---

## 11. Plano Técnico de Implementação Segura

| Fase | Branch sugerida | Commits sugeridos | Teste antes do merge |
|---|---|---|---|
| **S0 — Baseline** | `baseline/pre-pmo-snapshot` | `chore: tag baseline pre-pmo v1.0` | Build ok; todas as rotas ok; screenshots tirados |
| **S1 — Copy e CTA** | `feature/s1-copy-cta` | `copy(ofertas): replace card CTA text` / `copy(entrada): update secondary CTA` / `fix(encoding): restore accented characters` | Build ok; fluxo Entrada→Ofertas ok; console limpo |
| **S2 — Confiança** | `feature/s2-trust-signals` | `copy(entrada): add cpf microcopy` / `copy(upload): add confirmation block` / `feat(entrada): add anti-phishing notice` | Build ok; mobile 375px ok; 5 elementos visíveis |
| **S3 — Clareza Ofertas** | `feature/s3-offers-clarity` | `feat(ofertas): add recommended badge` / `copy(ofertas): add offer type explanations` / `ux(ofertas): reorder comparison section` | Build ok; 3 cards funcionando; CTA fixo ok; mobile ok |
| **S4 — Conversão** | `feature/s4-conversion` | `feat(entrada): add how-it-works block` / `copy(portabilidade): dynamic headline` / `copy(andamento): simplify retention language` | Funil completo testado; zero console errors; mobile ok |
| **S5 — Instrumentação** | `feature/s5-analytics` | `feat(analytics): add funnel events` / `feat(ofertas): ab-test variant copy` | Eventos disparando; nenhum dado PII em logs |

**Regras de commit e branch:**
- Um commit por tipo de mudança (copy, feat, fix, ux)
- Nunca misturar copy com lógica no mesmo commit
- Sempre rodar `npm run build` antes de abrir PR
- PR requer aprovação de ao menos 1 revisor antes do merge
- Nunca alterar arquivos de cálculo financeiro (`offerUtils.js`, hooks de dados) sem revisão separada

---

## 12. Próximos 5 Passos Recomendados

| # | Ação | Responsável | Prazo sugerido | Bloqueio |
|---|---|---|---|---|
| 1 | **Aprovar decisões de compliance** (gratuito, LGPD, anti-phishing) — sem isso, S2 não pode começar | CEO + Legal | Até 2 dias | Nenhum |
| 2 | **Criar branch baseline** e tagar o estado atual do código antes de qualquer alteração | Frontend | Imediato | Nenhum |
| 3 | **Executar Sprint S1** (B01–B06): apenas correções de texto, acentos e CTAs — zero risco | Frontend + Marketing | 1–2 dias | Nenhuma |
| 4 | **Decidir qual card de Oferta será "Recomendado"** e com qual lógica — necessário para S3 | Produto | Até 5 dias | Define estratégia de recomendação |
| 5 | **Configurar baseline de métricas** (analytics ou logs) para ter comparação antes/depois das mudanças | Dados / Frontend | Antes do S1 finalizar | Necessário para medir impacto real |

---

*Documento gerado com base no Diagnóstico CMO de 2025-05-07. Frameworks aplicados: PMO clássico, MoSCoW, matriz impacto×esforço, Definition of Done por sprint.*
