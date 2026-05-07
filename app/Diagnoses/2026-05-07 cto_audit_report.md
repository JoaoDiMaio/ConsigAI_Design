# 🏗️ Auditoria Técnica CTO — ConsigAI Webapp

> **Data:** 2026-05-07 | **Escopo:** `app/` | **Auditor:** CTO / Arquiteto Frontend

---

## 1. Sumário Executivo

O projeto está **em bom estado para seu estágio atual**. É um protótipo avançado com qualidade acima da média para um webapp de fintech em desenvolvimento. Possui design system centralizado, separação inicial de dados, hook de carregamento com fallback para mock, validadores e formatadores isolados, e testes Playwright funcionais.

**Pontos críticos a resolver antes de produção:**

1. **Páginas monolíticas** — `Ofertas.jsx` (88 KB, ~1981 linhas), `Contratacao.jsx` (49 KB), `Cadastro.jsx` e `AndamentoPropostas.jsx` (39 KB cada) concentram estilos inline, dados, lógica e layout em um único arquivo.
2. **Estilos inline massivos** — `styles/iframeOfertasStyles.js` tem **95 KB / 2842 linhas** de CSS como string JS sem tokens do design system.
3. **Dados mockados parcialmente centralizados** — `src/data/` existe e é útil, mas `profileStorage.js` ainda tem CPF e dados pessoais fake hardcoded como `defaultProfileData`.
4. **Sem camada `api/` ou `services/`** — apenas `useOffersData` tem integração preparada para API real.
5. **README é o template padrão do Vite** — sem instruções de setup, rotas, mocks ou design system.

---

## 2. Diagnóstico da Arquitetura Atual

### Estrutura de pastas

```
app/src/
  App.jsx              ✅ Roteamento flat e limpo — sem lazy loading
  pages/               ⚠️ 13 páginas, maioria monolítica
  components/          ⚠️ Poucos componentes reutilizáveis (6 arquivos + 1 subdir)
  data/                ✅ Dados mockados centralizados (5 arquivos)
  hooks/               ✅ 3 hooks (useMediaQuery, useFontSize, useOffersData)
  lib/                 ✅ Utilitários isolados (formatters, validators, masks, offerUtils)
  ui/                  ✅ Design system parcialmente consolidado (theme.js, cardSelection.js)
  styles/              🔴 1 arquivo de 95 KB de CSS inline — gigante e sem tokens
  assets/              ✅ OK
```

### Respostas ao diagnóstico

| Pergunta | Resposta |
|---|---|
| O projeto está organizado para crescer? | Parcialmente — separação de camadas existe mas não é usada por todas as telas |
| Páginas grandes demais? | Sim — Ofertas (88 KB), Contratacao (49 KB), Cadastro e AndamentoPropostas (39 KB) |
| Componentes com responsabilidade demais? | Sim — páginas acumulam layout + dados + estilos + navegação + cálculo |
| Duplicação de layout/card/botão? | Sim — estilos inline de botão, card e shadow repetidos em 8+ páginas |
| Mocks dentro de JSX? | Não nas pages, mas `profileStorage.js` tem CPF/dados pessoais fake como default |
| Camada clara para API futura? | Parcial — apenas `useOffersData` tem estrutura preparada |
| Separação UI / dados / regras? | Parcial — existe em lib/data/ui, mas não aplicada em todas as telas |
| Fácil de manter? | Moderado — telas menores sim; Ofertas.jsx e iframeOfertasStyles.js são problemáticas |

---

## 3. Tabela 1 — Arquivos e Responsabilidades

| Arquivo/Pasta | Função atual | Problema | Recomendação | Prioridade |
|---|---|---|---|---|
| `pages/Ofertas.jsx` | Tela principal de ofertas | 88 KB monolítico: estilos inline, iframe, lógica, mock | Separar componentes + hook `useOfertas` | Alta |
| `pages/Contratacao.jsx` | Fluxo de contratação | 49 KB com estilos inline e dados hardcoded na sidebar | Separar sidebar como componente, extrair dados | Alta |
| `pages/Cadastro.jsx` | Formulário de cadastro | 39 KB com `<style>` JSX embutido de ~600 linhas | Mover CSS para arquivo `.css` ou módulo | Alta |
| `pages/AndamentoPropostas.jsx` | Acompanhamento de propostas | 39 KB, dados mock com strings sem acentos | Separar + corrigir strings | Média |
| `styles/iframeOfertasStyles.js` | CSS injetado no iframe de Ofertas | 95 KB / 2842 linhas, sem tokens do design system | Manter separado; migrar tokens para vars CSS | Média |
| `data/andamentoPropostasDataClean.js` | Mock de propostas | `summaryCardDefs` com strings sem acentos | Corrigir strings + documentar shape da API | Média |
| `lib/profileStorage.js` | Perfil do usuário via localStorage | CPF `177.665.442-80` e dados pessoais fake hardcoded | Mover dados fake para `mocks/mockProfile.js` | Alta |
| `components/` | Componentes compartilhados | Poucos componentes — Button, MiniCard, AppHeader | Extrair mais componentes das páginas grandes | Média |
| `ui/theme.js` | Design system de cores/spacing | Bem estruturado. Paleta legacy ainda ativa | Deprecar paleta legacy gradualmente | Baixa |
| `hooks/useOffersData.js` | Carregamento de ofertas com fallback | Único hook com integração API preparada | Replicar padrão para propostas e perfil | Alta |
| `README.md` | Documentação | Template padrão do Vite — não documenta nada | Reescrever completamente | Alta |
| `docs/api.md` | Contrato da API | Existe e está detalhado | Validar contra shape de `offersMock.js` | Média |
| `tests/` | Smoke tests Playwright | 2 arquivos, cobre todas as 13 rotas críticas | Ampliar com flow tests | Média |

---

## 4. Tabela 2 — Problemas Técnicos

| Item técnico | Onde aparece | Risco | Ação recomendada | Fase |
|---|---|---|---|---|
| Arquivo CSS de 95 KB como string JS | `styles/iframeOfertasStyles.js` | Manutenção impossível sem contexto | Documentar e modularizar onde possível | Fase 3 |
| `<style>` JSX embutido em páginas | Cadastro, Contratacao, Ofertas | Impossível reusar, difícil de manter | Mover para `.css` ou CSS module | Fase 3 |
| Estilos inline repetidos (botão, card, shadow) | 8+ páginas | Qualquer mudança exige busca manual | Criar `ui/buttonStyles.js` e `ui/cardStyles.js` | Fase 3 |
| Breakpoint `768px` hardcoded | 9 páginas | Inconsistência se o breakpoint mudar | Centralizar em `ui/theme.js` como `breakpoints.desktop` | Fase 3 |
| `FORCED_VISIBLE_OFFER_IDS` como toggle mock/prod | `data/offersMock.js` | Risco de deploy em produção com mock ativo | Substituir por `VITE_USE_MOCK_OFFERS` em `.env` | Fase 1 |
| CPF e dados pessoais fake hardcoded | `lib/profileStorage.js` | LGPD — dado realista em código-fonte | Mover para `mocks/mockProfile.js` | Alta / Fase 1 |
| Lint error em `NovoContrato.jsx` L188 | `pages/NovoContrato.jsx` | `test:integrity` falha | Corrigir expressão constante no `&&` | Imediato |
| Strings sem acento em dados mock | `data/andamentoPropostasDataClean.js` | Exibição incorreta em produção | Corrigir textos | Fase 1 |
| Ausência de loading/error/empty state | Todas exceto Ofertas e CarregamentoOfertas | Branco ou crash com API real | Adicionar estados de UI assíncronos | Fase 2 |
| Rota `/acompanhamento` → `AndamentoPropostas` | `App.jsx` L32 | Nome de rota diferente do componente | Documentar em `ROUTES_AND_FLOWS.md` | Fase 4 |
| `tailwindcss` instalado mas não usado | `package.json` devDependencies | Build desnecessariamente mais lento | Remover se confirmado sem uso | Fase 6 |
| Rotas duplicadas para EstrategiaCombinada | `App.jsx` L34-36 | `/novo-economia` e `/refin-economia` mapeiam ao mesmo componente | Documentar intenção ou limpar rotas | Fase 4 |

---

## 5. Preparação para API Real

### Estado atual

Apenas `useOffersData.js` tem estrutura de integração com API. O restante das telas usa:
- `localStorage` para perfil (via `profileStorage.js`)
- Mock hardcoded nos arquivos `src/data/`
- Dados hardcoded diretamente em JSX (contratação, andamento)

### Arquitetura proposta

```
app/src/
  api/
    httpClient.js        # fetch wrapper com timeout, headers, baseURL
    endpoints.js         # constantes: GET /api/ofertas, POST /api/perfil, etc.
  services/
    customerService.js   # getProfile(), updateProfile()
    offerService.js      # getOffers() — baseado em useOffersData
    proposalService.js   # getProposals(), acceptProposal()
    simulationService.js # runSimulation(params)
  mocks/
    mockCustomerApi.js   # substituto de customerService em dev
    mockOfferApi.js      # mover de data/offersMock.js
    mockProposalApi.js   # substituto de proposalService em dev
    mockProfile.js       # mover defaultProfileData de profileStorage.js
  hooks/
    useOffersData.js     # ✅ já existe
    useProfile.js        # a criar
    useProposalStatus.js # a criar
  adapters/
    offerAdapter.js      # normaliza resposta API → shape UI
    proposalAdapter.js   # normaliza resposta de propostas → shape UI
```

### Toggle mock/prod recomendado

```js
// .env.development
VITE_USE_MOCK=true

// .env.production
VITE_USE_MOCK=false

// api/httpClient.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
```

---

## 6. Tabela 3 — Dados Mockados e Hardcoded

| Dado | Onde está | Como deveria ficar | Prioridade |
|---|---|---|---|
| `defaultProfileData` com CPF/email fake | `lib/profileStorage.js` | `mocks/mockProfile.js` | Alta |
| `MOCK_DADOS` (ofertas, usuário, impacto) | `data/offersMock.js` | `mocks/mockOfferApi.js` + documentar shape | Média |
| `FORCED_VISIBLE_OFFER_IDS` | `data/offersMock.js` | Variável de ambiente `VITE_USE_MOCK_OFFERS` | Alta |
| `financialSummary`, `proposals` | `data/andamentoPropostasDataClean.js` | `mocks/mockProposalApi.js` + corrigir strings | Média |
| Dados de Refinanciamento e Portabilidade | `data/refinanciamentoData.js`, `portabilidadeData.js` | `mocks/` correspondentes | Média |
| Dados da sidebar (tempo, suporte) | `Contratacao.jsx` L1454-1491 | `data/contratacaoConfig.js` ou props | Média |
| `(11) 99999-0000` telefone fake | `Contratacao.jsx` L1327, L1382 | `profile.telefone` via hook `useProfile` | Média |

---

## 7. Separação de Responsabilidades

### Estado atual por página

| Página | Layout | Dados mock | Cálculo | Estilos inline | Navegação | Regra negócio |
|---|---|---|---|---|---|---|
| `Ofertas.jsx` | ✅ | ⚠️ via hook | ✅ offerUtils | 🔴 extensos | ✅ | ⚠️ misturado |
| `Contratacao.jsx` | ✅ | 🔴 direto no JSX | — | 🔴 extensos | ✅ | ⚠️ |
| `Cadastro.jsx` | ✅ | 🔴 default profile | ✅ validators | 🔴 `<style>` JSX | ✅ | ✅ |
| `AndamentoPropostas.jsx` | ✅ | ⚠️ via data/ | — | ⚠️ inline | ✅ | ⚠️ |
| `Refinanciamento.jsx` | ✅ | ✅ via data/ | — | ⚠️ inline | ✅ | ✅ |

### Proposta de separação

1. **Pages** → apenas composição de componentes + chamar hooks
2. **Components** → UI sem lógica de negócio
3. **Services/API** → buscar dados com swap mock/real
4. **Hooks** → `useState` + chamar services + retornar dados prontos para UI
5. **Adapters** → transformar shape da API no shape da UI
6. **Utils/lib** → formatters, masks, validators ✅ já existe
7. **Theme/UI** → cores, tokens, cardStyles, buttonStyles ✅ parcialmente

---

## 8. Duplicações e Limpeza

| Item duplicado | Ocorrências | Classificação | Ação |
|---|---|---|---|
| Estilos de botão CTA inline | 8+ páginas | Consolidar | Criar `ui/buttonStyles.js` |
| `useMediaQuery('(min-width: 768px)')` | 9 páginas | Consolidar | `BREAKPOINTS.desktop` em `theme.js` |
| `radial-gradient` + `linear-gradient` de card | 6+ páginas | Consolidar | `ui/cardStyles.js` |
| `box-shadow` de card hardcoded | 5+ páginas | Consolidar | Usar `shadow.*` do `theme.js` |
| `fontFamily: 'Plus Jakarta Sans'` inline | 3+ páginas | Consolidar | Usar `appFontFamily` do `theme.js` |
| `loadProfileData()` chamado em 5+ páginas | Todas com AppHeader | Consolidar | Hook `useProfile()` |
| Cores hex hardcoded fora do theme | `iframeOfertasStyles.js` | Revisar manualmente | Migrar tokens gradualmente |
| `tailwindcss` instalado sem uso | `package.json` | Remover | Verificar e remover |
| Strings sem acento em data mock | `andamentoPropostasDataClean.js` | Corrigir | Imediato |

---

## 9. Design System — Estado e Gaps

### O que existe e está bem

| Arquivo | Conteúdo |
|---|---|
| `ui/theme.js` | Cores semânticas, spacing, radius, shadow, gradient, fontWeight |
| `ui/cardSelection.js` | Estados de card: base, hover, selected |
| `ui/BRAND_COLOR_GUIDE.md` | Documentação de cores |
| `lib/formatters.js` | `fmt`, `fmtDec`, `parseMoney`, `toClientCallName` |
| `lib/validators.js` | CPF, telefone, email, data, CEP, upload |
| `lib/masks.js` | Máscaras de input |

### O que falta criar

| Arquivo | Conteúdo | Prioridade |
|---|---|---|
| `ui/buttonStyles.js` | CTA primário, secundário, ghost, disabled, hover, active | Alta |
| `ui/typography.js` | Títulos, subtítulos, labels, valores financeiros, microcopy | Média |
| `ui/breakpoints.js` ou em `theme.js` | `desktop: 768`, `wide: 1080` | Média |

---

## 10. Performance e Otimização

| Problema | Impacto | Ação | Fase |
|---|---|---|---|
| Bundle único de 705 KB (gzip: 168 KB) | Carregamento inicial lento | Lazy loading por rota com `React.lazy()` | Fase 6 |
| `iframeOfertasStyles.js` (95 KB) sempre importado | Presente no bundle mesmo sem iframe ativo | Lazy import quando Ofertas montar | Fase 6 |
| Nenhuma rota com `React.lazy` | Todas as 13 páginas carregadas no boot | Code splitting por rota | Fase 6 |
| Objetos de estilo inline recriados no render | Todas as páginas com estilos inline | Extrair para constantes fora do componente | Fase 3 |
| `@tailwindcss/vite` no devDependencies | Processa sem uso, aumenta tempo de build | Remover se não usado | Fase 6 |

---

## 11. Segurança / LGPD / Fintech Readiness

| Ponto | Status | Risco | Ação |
|---|---|---|---|
| CPF fake `177.665.442-80` em `profileStorage.js` | 🔴 Presente | Dado pessoal realista em código-fonte | Mover para `mocks/mockProfile.js` |
| `(11) 99999-0000` hardcoded em Contratacao | ⚠️ Deve vir do perfil | Baixo | Usar `profile.telefone` via hook |
| `console.log` em produção | ✅ Não encontrado | — | OK |
| Linguagem de aprovação garantida | ✅ Não encontrado | — | OK — textos usam "simulação" |
| Distinção simulação vs. contratação | ✅ Clara na interface | — | OK |
| Validação de upload (MIME + extensão + tamanho) | ✅ `validators.js` implementado | — | OK |
| Dados no localStorage sem criptografia | ⚠️ Perfil salvo em claro | Inaceitável em produção | Criptografar ou usar sessão segura |
| Dados fake realistas em `src/data/` | ⚠️ Valores BRL, CPF, email | Risco de vazamento em repositório público | Mover para `src/mocks/` |

---

## 12. Tabela 4 — Documentação Necessária

| Documento | Objetivo | Conteúdo mínimo | Prioridade |
|---|---|---|---|
| `README.md` | Onboarding de novo dev | Setup local, scripts, variáveis de ambiente, rotas | Alta |
| `docs/ARCHITECTURE.md` | Visão técnica do projeto | Estrutura de pastas, responsabilidades, padrões, decisões | Alta |
| `docs/ROUTES_AND_FLOWS.md` | Mapa de navegação | Todas as rotas, fluxos críticos, mapeamento rota → componente | Alta |
| `docs/MOCK_API.md` | Guia de mocks | Como ativar mock, shape dos dados, toggle prod/mock | Alta |
| `docs/DESIGN_SYSTEM.md` | Tokens visuais | Cores, spacing, radius, shadow, tipografia, componentes | Média |
| `docs/API_READY_GUIDE.md` | Integração com backend | Como trocar mock por API real, padrão de services/hooks/adapters | Média |
| `docs/TESTING.md` | Guia de testes | Como rodar lint, build, smoke tests, critério de aprovação | Média |

---

## 13. Tabela 5 — Testes de Integridade

| Teste | Objetivo | Ferramenta | Critério de aprovação |
|---|---|---|---|
| `npm run build` | Build sem erro | Vite | Exit code 0, sem erros |
| `npm run lint` | Qualidade de código | ESLint | 0 erros (warnings OK) |
| Smoke test de rotas | 13 rotas renderizam sem erro | Playwright ✅ já existe | `#root` visível, sem pageerror, sem console.error |
| Flow test: Entrada → Ofertas | Fluxo principal navegável | Playwright | CTA visível em cada etapa |
| Flow test: Ofertas → Contratacao | Fluxo de contratação | Playwright | Formulário e CTA final visíveis |
| Unit tests formatters | `fmt`, `fmtDec`, `parseMoney` | Vitest | 100% dos casos cobertos |
| Unit tests validators | CPF, telefone, email, CEP | Vitest | Casos válidos e inválidos cobertos |
| `npm run test:integrity` | Pipeline completo encadeado | Todos acima | ✅ já configurado no `package.json` |

---

## 14. Plano Técnico por Fases

### Fase 0 — Baseline e proteção (1 dia)
- [x] Build confirmado ✅ `built in 263ms`
- [x] Smoke tests existem e cobrem 13 rotas ✅
- [ ] **Corrigir lint em `NovoContrato.jsx` L188** — bloqueia `test:integrity`
- [ ] Screenshots de todas as rotas críticas como baseline

### Fase 1 — Dados e mocks (2–3 dias)
- [ ] Mover `defaultProfileData` fake para `src/mocks/mockProfile.js`
- [ ] Substituir `FORCED_VISIBLE_OFFER_IDS` por `VITE_USE_MOCK_OFFERS=true` no `.env`
- [ ] Corrigir strings sem acento em `andamentoPropostasDataClean.js`
- [ ] Criar `src/mocks/mockProposalApi.js` com shape documentado
- [ ] Criar `src/api/endpoints.js` com constantes de URL

### Fase 2 — Hooks e services (3–4 dias)
- [ ] Criar `src/hooks/useProfile.js`
- [ ] Criar `src/hooks/useProposalStatus.js`
- [ ] Criar `src/services/customerService.js` com toggle mock/real
- [ ] Criar `src/services/proposalService.js`
- [ ] Adicionar `loading` / `error` / `empty` states nas telas críticas

### Fase 3 — Padronização visual (3–5 dias)
- [ ] Criar `ui/buttonStyles.js` e aplicar nas páginas
- [ ] Centralizar breakpoints em `ui/theme.js`
- [ ] Extrair `<style>` JSX embutido do `Cadastro.jsx` para arquivo `.css`
- [ ] Extrair estilos inline repetidos de card para `ui/cardStyles.js`

### Fase 4 — Documentação (2 dias)
- [ ] Reescrever `README.md`
- [ ] Criar `docs/ARCHITECTURE.md`
- [ ] Criar `docs/ROUTES_AND_FLOWS.md`
- [ ] Criar `docs/MOCK_API.md`

### Fase 5 — Testes de integridade (2 dias)
- [ ] Adicionar flow tests Playwright (Entrada → Ofertas, Ofertas → Contratacao)
- [ ] Adicionar unit tests Vitest para `formatters.js` e `validators.js`
- [ ] Validar `npm run test:integrity` passando completamente

### Fase 6 — Otimização (2–3 dias)
- [ ] Lazy loading com `React.lazy` por rota no `App.jsx`
- [ ] Lazy import de `iframeOfertasStyles.js` dentro de `Ofertas.jsx`
- [ ] Remover `tailwindcss` se confirmado sem uso
- [ ] Avaliar extração de `Ofertas.jsx` em subcomponentes

---

## 15. Backlog Priorizado

| # | Item | Fase | Prioridade | Risco se ignorar |
|---|---|---|---|---|
| 1 | Corrigir lint `NovoContrato.jsx` L188 | 0 | 🔴 Alta | `test:integrity` falha no CI |
| 2 | Mover dados fake de perfil para `mocks/` | 1 | 🔴 Alta | LGPD — dados sensíveis em código-fonte |
| 3 | Toggle mock via variável de ambiente | 1 | 🔴 Alta | Deploy acidental com mock em produção |
| 4 | Reescrever `README.md` | 4 | 🔴 Alta | Onboarding de novo dev impossível |
| 5 | Hook `useProfile` + `useProposalStatus` | 2 | 🟡 Média | Integração API exige reescrita das telas |
| 6 | Loading / error / empty states | 2 | 🟡 Média | Crash ou tela em branco com API real |
| 7 | `ui/buttonStyles.js` centralizado | 3 | 🟡 Média | Mudança de CTA exige busca manual em 8+ arquivos |
| 8 | Flow tests Playwright | 5 | 🟡 Média | Regressão de fluxo sem detecção |
| 9 | Unit tests formatters + validators | 5 | 🟡 Média | Lógica financeira sem cobertura |
| 10 | Lazy loading por rota | 6 | 🟢 Baixa | Performance — não funcionalidade |
| 11 | Docs ARCHITECTURE + API_READY | 4 | 🟢 Baixa | Conhecimento concentrado em 1 pessoa |
| 12 | Remover `tailwindcss` se não usado | 6 | 🟢 Baixa | Build ligeiramente mais lento |

---

## 16. Decisões para Aprovar Antes de Executar

| # | Decisão | Opção A | Opção B |
|---|---|---|---|
| D1 | Toggle mock/prod | Variável `VITE_USE_MOCK` no `.env` ✅ recomendado | Manter `FORCED_VISIBLE_OFFER_IDS` como array vazio |
| D2 | CSS do `Cadastro.jsx` | Arquivo `.css` separado | CSS Module (`.module.css`) |
| D3 | Criar `src/api/` agora | Criar estrutura vazia com TODO comentado | Esperar contrato de API definido |
| D4 | Lazy loading por rota | Implementar em Fase 6 | Manter imports estáticos |
| D5 | Remover `tailwindcss` | Remover agora | Manter caso entre no projeto |
| D6 | TypeScript no futuro | Migrar gradualmente | Manter JS puro com JSDoc |

---

*Relatório gerado em: 2026-05-07 | Próxima revisão recomendada: após conclusão da Fase 2*
