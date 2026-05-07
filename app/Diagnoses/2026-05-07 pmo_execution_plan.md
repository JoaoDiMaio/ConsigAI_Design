# 📋 Plano PMO — ConsigAI Webapp
> **Data:** 2026-05-07 | **Baseado em:** `cto_audit_report.md` | **Responsável:** PMO Técnico

---

## 1. Sumário Executivo PMO

### Objetivo da execução
Transformar o webapp ConsigAI de protótipo avançado em produto preparado para integração com API real, com manutenção segura, padrões centralizados, documentação operacional e cobertura de testes que protejam os fluxos críticos.

### Riscos que serão reduzidos
| Risco atual | Redução esperada |
|---|---|
| CPF e dados pessoais fake em código-fonte | Eliminado na Fase 1 |
| Mock ativo em produção por acidente | Eliminado na Fase 1 |
| Lint error bloqueando pipeline CI | Eliminado na Fase 0 |
| Telas quebrando com API real (sem loading/error states) | Reduzido na Fase 2 |
| Mudança de CTA/botão afetando 8+ páginas manualmente | Reduzido na Fase 3 |
| Onboarding impossível sem README | Eliminado na Fase 4 |
| Regressão sem detecção automática | Reduzido na Fase 5 |

### Sequência de menor risco
**Fase 0 → 1 → 2 → 4 → 5 → 3 → 6**

> A Fase 4 (documentação) antecede a Fase 3 (visual) nesta recomendação porque padronizar estilos sem documentar o design system gera risco de inconsistência. A documentação ancora as decisões visuais.

### O que NÃO deve ser feito ainda
- Refatorar `Ofertas.jsx` em subcomponentes (risco alto — aguardar Fase 6)
- Migrar para TypeScript (decisão pendente D6 — não executar sem aprovação)
- Alterar rotas ou navegação (fora do escopo de todas as fases)
- Alterar valores financeiros nos mocks (bloqueado em todas as fases)
- Mexer em `iframeOfertasStyles.js` além de lazy import (aguardar Fase 6)

---

## 2. Roadmap por Fases

| Fase | Objetivo | Entregáveis | Prioridade | Esforço | Risco | Dependências | Critério de conclusão |
|---|---|---|---|---|---|---|---|
| **0** | Baseline e proteção | Lint corrigido, screenshots baseline | P0 | 1 dia | Baixo | Nenhuma | Lint 0 erros, 13 screenshots salvas |
| **1** | Dados e mocks seguros | Mocks centralizados, .env, strings corrigidas | P0 | 2–3 dias | Médio | Fase 0 | Build ok, perfil carrega, mock isolado |
| **2** | Camada API/services | hooks, services, loading/error states | P1 | 3–4 dias | Médio | Fase 1 | Telas com estados assíncronos |
| **4** | Documentação | README + 6 docs em docs/ | P1 | 2 dias | Baixo | Fase 2 | 7 arquivos criados e revisados |
| **5** | Testes de integridade | Flow tests, unit tests, test:integrity ok | P1 | 2 dias | Baixo | Fase 4 | test:integrity passa sem erros |
| **3** | Padronização visual | buttonStyles, cardStyles, breakpoints | P2 | 3–5 dias | Médio | Fase 5 | Build ok, visual idêntico ao baseline |
| **6** | Otimização | Lazy loading, bundle menor | P3 | 2–3 dias | Alto | Fase 3 | Bundle < 500 KB, rotas ok |

---

## 3. Backlog Técnico Priorizado

| ID | Tarefa | Fase | Arquivos prováveis | Tipo | Prioridade | Impacto | Esforço | Risco | Dependências | Critério de aceite |
|---|---|---|---|---|---|---|---|---|---|---|
| T01 | Corrigir lint NovoContrato.jsx L188 | 0 | `pages/NovoContrato.jsx` | bugfix | P0 | Alto | 30 min | Baixo | — | `npm run lint` retorna 0 erros |
| T02 | Screenshots baseline de 13 rotas | 0 | `screenshots/` | teste | P0 | Alto | 1h | Baixo | T01 | 13 imagens salvas |
| T03 | Mover defaultProfileData para mocks/mockProfile.js | 1 | `lib/profileStorage.js`, `mocks/mockProfile.js` | segurança/LGPD | P0 | Alto | 1h | Médio | T01 | Perfil carrega, CPF fake fora do lib |
| T04 | Substituir FORCED_VISIBLE_OFFER_IDS por VITE_USE_MOCK_OFFERS | 1 | `data/offersMock.js`, `.env`, `.env.example` | mock/API | P0 | Alto | 1h | Médio | T03 | Ofertas carregam em dev e mock desativável |
| T05 | Corrigir strings sem acento em andamentoPropostasDataClean.js | 1 | `data/andamentoPropostasDataClean.js` | bugfix | P0 | Médio | 30 min | Baixo | — | Textos corretos na tela |
| T06 | Criar src/mocks/mockProposalApi.js com shape documentado | 1 | `mocks/mockProposalApi.js` | mock/API | P1 | Alto | 2h | Baixo | T03 | Arquivo criado com shape comentado |
| T07 | Criar src/api/endpoints.js com constantes de URL | 1 | `api/endpoints.js` | mock/API | P1 | Alto | 1h | Baixo | — | Constantes exportadas e documentadas |
| T08 | Criar src/hooks/useProfile.js | 2 | `hooks/useProfile.js`, `services/customerService.js` | service/hook | P1 | Alto | 3h | Médio | T03, T07 | Hook retorna perfil, loading e error |
| T09 | Criar src/hooks/useProposalStatus.js | 2 | `hooks/useProposalStatus.js`, `services/proposalService.js` | service/hook | P1 | Alto | 3h | Médio | T06, T07 | Hook retorna propostas, loading e error |
| T10 | Criar src/services/customerService.js com toggle mock/real | 2 | `services/customerService.js`, `mocks/mockCustomerApi.js` | service/hook | P1 | Alto | 2h | Médio | T07 | Service usa mock em dev, real em prod |
| T11 | Criar src/services/proposalService.js com toggle mock/real | 2 | `services/proposalService.js`, `mocks/mockProposalApi.js` | service/hook | P1 | Alto | 2h | Médio | T06, T07 | Service usa mock em dev, real em prod |
| T12 | Adicionar loading/error/empty states em Contratacao.jsx | 2 | `pages/Contratacao.jsx` | service/hook | P1 | Alto | 2h | Médio | T10 | Tela não quebra sem dados |
| T13 | Adicionar loading/error/empty states em AndamentoPropostas.jsx | 2 | `pages/AndamentoPropostas.jsx` | service/hook | P1 | Alto | 2h | Médio | T11 | Tela não quebra sem dados |
| T14 | Reescrever README.md | 4 | `README.md` | documentação | P1 | Alto | 2h | Baixo | Fase 2 | Setup local funciona a partir do README |
| T15 | Criar docs/ARCHITECTURE.md | 4 | `docs/ARCHITECTURE.md` | documentação | P1 | Alto | 2h | Baixo | T14 | Estrutura de pastas documentada |
| T16 | Criar docs/ROUTES_AND_FLOWS.md | 4 | `docs/ROUTES_AND_FLOWS.md` | documentação | P1 | Alto | 1h | Baixo | T15 | Todas as rotas e fluxos mapeados |
| T17 | Criar docs/MOCK_API.md | 4 | `docs/MOCK_API.md` | documentação | P1 | Alto | 1h | Baixo | T06, T07 | Toggle mock/prod documentado |
| T18 | Criar docs/API_READY_GUIDE.md | 4 | `docs/API_READY_GUIDE.md` | documentação | P2 | Médio | 2h | Baixo | T10, T11 | Guia de integração com backend |
| T19 | Criar docs/DESIGN_SYSTEM.md | 4 | `docs/DESIGN_SYSTEM.md` | documentação | P2 | Médio | 2h | Baixo | T15 | Tokens, cores, componentes documentados |
| T20 | Criar docs/TESTING.md | 4 | `docs/TESTING.md` | documentação | P2 | Médio | 1h | Baixo | T14 | Scripts de teste documentados |
| T21 | Adicionar flow tests Playwright: Entrada → Ofertas | 5 | `tests/flow-entrada-ofertas.spec.js` | teste | P1 | Alto | 3h | Baixo | T14 | Fluxo navega sem erro |
| T22 | Adicionar flow tests Playwright: Ofertas → Contratacao | 5 | `tests/flow-ofertas-contratacao.spec.js` | teste | P1 | Alto | 3h | Baixo | T21 | CTA de contratação funciona |
| T23 | Adicionar unit tests Vitest: formatters.js | 5 | `src/__tests__/formatters.test.js` | teste | P1 | Alto | 2h | Baixo | — | `fmt`, `fmtDec`, `parseMoney` cobertos |
| T24 | Adicionar unit tests Vitest: validators.js | 5 | `src/__tests__/validators.test.js` | teste | P1 | Alto | 2h | Baixo | — | CPF, telefone, email, CEP cobertos |
| T25 | Validar npm run test:integrity completo | 5 | — | teste | P1 | Alto | 30 min | Baixo | T21–T24 | Pipeline 0 erros |
| T26 | Criar ui/buttonStyles.js | 3 | `ui/buttonStyles.js` | design system | P2 | Médio | 2h | Médio | Fase 5 | Estilos centralizados, sem mudança visual |
| T27 | Centralizar breakpoints em ui/theme.js | 3 | `ui/theme.js` | design system | P2 | Médio | 1h | Baixo | T26 | `BREAKPOINTS.desktop = 768` exportado |
| T28 | Extrair `<style>` JSX do Cadastro.jsx para .css | 3 | `pages/Cadastro.jsx`, `Cadastro.css` | design system | P2 | Médio | 3h | Alto | T26 | Visual idêntico ao baseline |
| T29 | Criar ui/cardStyles.js com estilos de card centralizados | 3 | `ui/cardStyles.js` | design system | P2 | Médio | 2h | Médio | T26 | Cards sem mudança visual |
| T30 | Lazy loading com React.lazy por rota em App.jsx | 6 | `src/App.jsx` | performance | P3 | Alto | 3h | Alto | Fase 3 | Todas as rotas funcionam, bundle menor |
| T31 | Lazy import de iframeOfertasStyles.js em Ofertas.jsx | 6 | `pages/Ofertas.jsx` | performance | P3 | Médio | 1h | Médio | T30 | Ofertas carregam normalmente |
| T32 | Remover tailwindcss se confirmado sem uso | 6 | `package.json` | limpeza | P3 | Baixo | 30 min | Baixo | T30 | Build passa sem tailwind |
| T33 | Avaliar extração de Ofertas.jsx em subcomponentes | 6 | `pages/Ofertas.jsx` | limpeza | P3 | Alto | 5+ dias | Alto | T30 | Funcionalidade preservada |

---

## 4. Impacto x Esforço

| Grupo | Tarefas | Justificativa |
|---|---|---|
| **1. Quick wins** | T01, T02, T05, T07 | Baixo risco, alta visibilidade, menos de 1h cada |
| **2. Projetos críticos** | T03, T04, T08–T13, T21–T25 | Necessários antes de produção, esforço moderado |
| **3. Melhorias estruturais** | T06, T14–T20, T26–T29 | Aumentam manutenibilidade, baixo risco se bem testados |
| **4. Otimizações futuras** | T30, T31, T32 | Alto impacto, mas alto risco — aguardar estabilização |
| **5. Não fazer agora** | T33 (refatorar Ofertas.jsx) | Risco alto demais no estágio atual |

---

## 5. Plano por Sprints

| Sprint | Objetivo | Tarefas | Arquivos afetados | Entregáveis | Testes obrigatórios | Definição de pronto |
|---|---|---|---|---|---|---|
| **S0** | Proteção e baseline | T01, T02 | `NovoContrato.jsx`, `screenshots/` | Lint limpo, 13 screenshots | build, lint, smoke test | lint=0, screenshots salvas |
| **S1** | Mocks e dados seguros | T03, T04, T05, T06, T07 | `lib/`, `data/`, `mocks/`, `api/`, `.env` | Dados fake isolados, mock via .env | build, lint, smoke test | Perfil carrega, ofertas ok, CPF fora do lib |
| **S2** | Camada API/services/hooks | T08–T13 | `hooks/`, `services/`, `mocks/`, `pages/Contratacao`, `pages/AndamentoPropostas` | Hooks e services criados, loading/error states | build, lint, smoke test | Telas não quebram sem dados |
| **S4** | Documentação técnica | T14–T20 | `README.md`, `docs/` | 7 documentos criados | build, lint | Novo dev consegue rodar o projeto |
| **S5** | Testes e QA | T21–T25 | `tests/`, `src/__tests__/` | Flow tests e unit tests | test:integrity completo | test:integrity = 0 erros |
| **S3** | Padronização visual | T26–T29 | `ui/`, `pages/Cadastro.jsx` | buttonStyles, cardStyles, breakpoints centralizados | build, lint, smoke test, screenshots | Visual idêntico ao baseline |
| **S6** | Otimização/performance | T30–T32 | `src/App.jsx`, `pages/Ofertas.jsx`, `package.json` | Lazy loading, bundle menor | build, smoke test, todas as rotas | Rotas funcionam, bundle reduzido |

---

## 6. Critérios de Aceite por Fase

| Fase | Critérios de aceite | Evidências obrigatórias |
|---|---|---|
| **0** | Lint 0 erros; build ok; 13 screenshots salvas | Output `npm run lint` sem erros; pasta `screenshots/` com 13 arquivos |
| **1** | CPF fake fora de `lib/`; ofertas carregam via .env; textos com acentos corretos; build ok | `profileStorage.js` sem CPF hardcoded; `.env.example` com `VITE_USE_MOCK_OFFERS`; smoke test ok |
| **2** | `useProfile` e `useProposalStatus` exportam loading/error/data; telas não quebram sem API | Unit test dos hooks; smoke test das telas afetadas |
| **4** | README permite setup local em < 10 min; todas as rotas documentadas | Checklist de docs preenchido; smoke test ok |
| **5** | `npm run test:integrity` passa sem erros; flow tests cobrem 2 fluxos críticos | Output de `test:integrity`; relatório Playwright |
| **3** | Visual idêntico ao baseline (screenshots); nenhum estilo inline duplicado em buttonStyles | Screenshots antes/depois; `npm run build` ok |
| **6** | Bundle < 500 KB gzip; todas as 13 rotas funcionam | Output de `vite build`; smoke test ok |

---

## 7. Plano de Testes

| Teste | Quando rodar | Objetivo | Critério de aprovação | Obrigatório em qual fase |
|---|---|---|---|---|
| `npm run build` | Antes e depois de cada PR | Build sem erro | Exit code 0 | Todas |
| `npm run lint` | Antes e depois de cada PR | Qualidade de código | 0 erros | Todas |
| Smoke test (13 rotas) | Antes e depois de cada sprint | Rotas renderizam | `#root` visível, sem pageerror | Todas |
| `npm run test:integrity` | Fim do Sprint 5 e cada sprint posterior | Pipeline completo | 0 erros | S5, S3, S6 |
| Screenshots baseline | Sprint 0 | Referência visual | 13 imagens salvas | S0 |
| Screenshots antes/após | Sprint 3 (mudanças visuais) | Validar sem regressão visual | Visual idêntico ao baseline | S3 |
| Flow test: Entrada → Ofertas | Sprint 5 | Fluxo principal navega | CTA visível em cada tela | S5 |
| Flow test: Ofertas → Contratacao | Sprint 5 | Fluxo de contratação | Formulário e CTA final visíveis | S5 |
| Unit test formatters | Sprint 5 | Lógica financeira coberta | 100% dos casos | S5 |
| Unit test validators | Sprint 5 | Validações cobertas | Casos válidos e inválidos | S5 |
| Console sem error | Todos os sprints | Qualidade runtime | 0 erros em console | Todas |
| Sem undefined/NaN em tela | Todos os sprints | Dados mockados corretos | Nenhum undefined visível | Todas |

---

## 8. Matriz de Riscos

| Risco | Probabilidade | Impacto | Fase afetada | Mitigação | Dono |
|---|---|---|---|---|---|
| Quebrar tela crítica ao refatorar | Média | Alto | S3, S6 | Screenshot baseline + smoke test antes e depois | Dev |
| Mexer em mock e alterar dados exibidos | Alta | Médio | S1 | Nunca alterar valores financeiros nos mocks | PMO |
| Divergência entre mock e API futura | Alta | Alto | S1, S2 | Documentar shape esperado em MOCK_API.md | Dev + PO |
| Mover defaultProfileData e quebrar perfil | Média | Alto | S1 | Testar todas as telas que usam profileStorage | Dev |
| Centralizar estilos e mudar visual | Média | Alto | S3 | Screenshots antes/após; merge só com aprovação visual | Dev |
| Documentação ficar desatualizada | Alta | Médio | S4+ | PR checklist exige atualização de docs | PMO |
| Criar services antes de contrato mínimo definido | Alta | Alto | S2 | Definir shape mínimo de resposta antes de T08 | Dev + PO |
| Lazy loading quebrar rotas | Baixa | Alto | S6 | Testar todas as 13 rotas após implementar | Dev |
| Remover Tailwind e afetar build | Baixa | Médio | S6 | Verificar uso com grep antes de remover | Dev |
| Fallback mock ocultar erros de integração | Alta | Alto | S2 | Log explícito quando mock está ativo | Dev |

---

## 9. Decisões Pendentes

| Decisão | Opção recomendada | Alternativas | Impacto | Risco | Quando decidir | Responsável |
|---|---|---|---|---|---|---|
| D1: Toggle mock | `VITE_USE_MOCK=true` no `.env` | Manter `FORCED_VISIBLE_OFFER_IDS` | Deploy seguro | Baixo | Antes do Sprint 1 | Dev + PO |
| D2: CSS Cadastro | Arquivo `.css` separado | CSS Module (`.module.css`) | Padrão de estilos | Médio | Antes do Sprint 3 | Dev |
| D3: Criar `src/api/` agora | Criar estrutura vazia com TODO | Esperar contrato real | Preparação API | Baixo | Sprint 1 | Dev + PO |
| D4: Lazy loading | Implementar no Sprint 6 | Manter imports estáticos | Performance | Alto | Sprint 6 | Dev |
| D5: Remover Tailwind | Remover após verificar uso com grep | Manter | Build speed | Baixo | Sprint 6 | Dev |
| D6: TypeScript | Não migrar agora — JSDoc se necessário | Migrar gradualmente | Manutenção longo prazo | Alto | Após produção estabilizada | CTO + PO |

---

## 10. Primeiros 10 Tickets Recomendados

| Ordem | Ticket | Por que vem agora | Pré-condição | Teste depois |
|---|---|---|---|---|
| 1 | T01 — Corrigir lint L188 | Bloqueia pipeline CI | Nenhuma | `npm run lint` |
| 2 | T02 — Screenshots baseline | Referência de regressão visual | T01 | Visual — comparar antes/após |
| 3 | T05 — Corrigir strings acento mock | Baixo risco, alto valor | T01 | Smoke test, visual |
| 4 | T03 — Mover defaultProfileData | LGPD — dado sensível em lib/ | T01 | Smoke test, perfil carrega |
| 5 | T04 — Toggle mock via .env | Segurança de deploy | T03 | Ofertas carregam, mock desativável |
| 6 | T07 — Criar api/endpoints.js | Base para services — sem risco | T04 | Build ok |
| 7 | T06 — Criar mocks/mockProposalApi.js | Base para useProposalStatus | T03, T07 | Build ok |
| 8 | T10 — Criar customerService.js | Habilita useProfile | T07 | Build ok |
| 9 | T08 — Criar useProfile.js | Elimina loadProfileData() espalhado | T10 | Hook retorna dados corretos |
| 10 | T14 — Reescrever README.md | Documenta o que foi feito no S1 | T04 | Setup local funciona |

---

## 11. Branches e Commits Sugeridos

| Fase | Branch sugerida | Commits sugeridos | Regra de merge |
|---|---|---|---|
| 0 | `fix/baseline-integrity` | `fix: corrigir lint NovoContrato L188`, `chore: screenshots baseline` | PR com lint+build ok |
| 1 | `refactor/mocks-api-ready` | `refactor: mover defaultProfileData para mocks/`, `feat: toggle mock via VITE_USE_MOCK_OFFERS`, `fix: corrigir acentos andamentoPropostasDataClean`, `feat: criar mocks/mockProposalApi`, `feat: criar api/endpoints` | PR com smoke test ok |
| 2 | `feat/api-service-layer` | `feat: criar customerService com toggle mock`, `feat: criar proposalService`, `feat: criar useProfile hook`, `feat: criar useProposalStatus hook`, `feat: loading/error states Contratacao`, `feat: loading/error states AndamentoPropostas` | PR com smoke test ok |
| 4 | `docs/project-architecture` | `docs: reescrever README`, `docs: ARCHITECTURE.md`, `docs: ROUTES_AND_FLOWS.md`, `docs: MOCK_API.md`, `docs: API_READY_GUIDE.md`, `docs: DESIGN_SYSTEM.md`, `docs: TESTING.md` | PR com revisão de conteúdo |
| 5 | `test/critical-flows` | `test: flow Entrada→Ofertas`, `test: flow Ofertas→Contratacao`, `test: unit formatters`, `test: unit validators`, `chore: validar test:integrity` | PR com test:integrity ok |
| 3 | `refactor/design-system-tokens` | `feat: criar ui/buttonStyles`, `feat: centralizar breakpoints theme.js`, `refactor: extrair CSS Cadastro.jsx`, `feat: criar ui/cardStyles` | PR com screenshots antes/após |
| 6 | `perf/lazy-loading` | `perf: React.lazy por rota App.jsx`, `perf: lazy import iframeOfertasStyles`, `chore: remover tailwindcss`, `refactor: avaliar subcomponentes Ofertas` | PR com smoke test e bundle report |

---

## 12. Checklist de Proteção por PR

```
## Checklist de PR — ConsigAI

### Integridade do produto
- [ ] Não alterou valores financeiros sem aprovação explícita
- [ ] Não alterou rotas ou paths de navegação
- [ ] Não alterou copy/texto fora do escopo do ticket
- [ ] Não alterou design visual fora do escopo do ticket

### Qualidade técnica
- [ ] `npm run build` passou (exit code 0)
- [ ] `npm run lint` passou (0 erros)
- [ ] Smoke test das 13 rotas passou
- [ ] Console sem `error` em nenhuma rota crítica
- [ ] Sem `undefined` ou `NaN` visível em tela

### Mudanças visuais (apenas se aplicável)
- [ ] Screenshot antes e depois incluída na PR
- [ ] Visual idêntico ao baseline aprovado

### Documentação (se aplicável)
- [ ] README atualizado se mudou setup ou scripts
- [ ] Arquivo de docs correspondente atualizado
- [ ] MOCK_API.md atualizado se mudou shape ou toggle

### Segurança
- [ ] Nenhum dado pessoal real ou CPF hardcoded introduzido
- [ ] Nenhuma chave de API, token ou secret no código
- [ ] Mock não está ativo em configuração de produção
```

---

## 13. Próximos 5 Passos

| # | Passo | Responsável | Prazo sugerido |
|---|---|---|---|
| 1 | **Aprovar decisões D1–D6** desta tabela antes de executar qualquer ticket | PO + Dev | Hoje |
| 2 | **Executar T01** (lint NovoContrato.jsx) — 30 min, zero risco | Dev | Imediato |
| 3 | **Executar T02** (screenshots baseline) para ter referência visual antes de qualquer mudança | Dev | Após T01 |
| 4 | **Executar Sprint 1** (T03, T04, T05, T06, T07) em branch `refactor/mocks-api-ready` | Dev | Esta semana |
| 5 | **Revisar shape de API** com backend antes de iniciar Sprint 2 (services/hooks) | PO + Dev + Backend | Antes do Sprint 2 |

---

*Plano gerado em: 2026-05-07 | Próxima revisão: após conclusão do Sprint 1*
