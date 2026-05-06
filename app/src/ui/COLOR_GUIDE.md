# ConsigAI Color Guide

> Documento legado. Guia oficial atualizado: [BRAND_COLOR_GUIDE.md](/C:/Users/joaod/OneDrive/Documents/GitHub/ConsigAI_Design/app/src/ui/BRAND_COLOR_GUIDE.md:1)

Fonte oficial: [`theme.js`](/C:/Users/joaod/OneDrive/Documents/GitHub/ConsigAI_Design/app/src/ui/theme.js)

## Regras rápidas

- Azul comunica marca, confiança, navegação, CTA e seleção.
- Verde comunica economia, ganho, redução e benefício financeiro.
- Cinza comunica contexto neutro, estado anterior e texto auxiliar.
- Dourado comunica recomendação editorial ou atenção leve.
- Vermelho comunica erro real, validação ou perda real.

## Tokens oficiais

| Token | Hex | Usar em | Não usar em |
|---|---|---|---|
| `--color-brand-primary` | `#043B8B` | CTA principal, links, marca | economia |
| `--color-brand-dark` | `#002D6E` | títulos, números principais, header | sucesso |
| `--color-brand-interactive` | `#2454D6` | hover, foco, borda selecionada | economia |
| `--color-brand-soft` | `#F4F9FF` | fundos suaves e áreas neutras | CTA |
| `--color-success` | `#00A86B` | economia mensal, economia total, ganho | seleção principal |
| `--color-success-dark` | `#007A52` | texto positivo curto | CTA principal |
| `--color-success-soft` | `#F0FFF8` | cards de benefício e bloco "depois" | cards neutros |
| `--color-success-border` | `#BDECD7` | bordas positivas | selected state |
| `--color-text-primary` | `#071B45` | texto principal e labels fortes | microcopy secundária |
| `--color-text-secondary` | `#64748B` | descrição, apoio, microcopy | valores principais |
| `--color-border` | `#DDE8F6` | divisores, inputs, cards padrão | destaque selecionado |
| `--color-surface` | `#FFFFFF` | cards e painéis | badges semânticos |
| `--color-warning` | `#9A6500` | estimado, sujeito à análise | erro real |
| `--color-error` | `#B32727` | erro real e validação | comparação neutra |

## Semântica de ofertas

- `Selecionada`: azul (`--color-brand-interactive`) com fundo suave azul.
- `Recomendada`: badge dourado discreto. Não pintar o card inteiro.
- `Disponível`: azul suave/neutro. Nunca verde.
- `Economia`: verde. Se for estimativa, combinar com selo/apoio de warning.
- `Valor liberado`: azul escuro. Crédito novo não é economia.
- `Antes`: cinza.
- `Depois`: azul ou verde, conforme o tipo de resultado.
- `Ganho`: verde.

## Ordem de decisão

1. Primeiro escolher a função semântica.
2. Depois escolher o token oficial.
3. Só usar hex direto quando o valor ainda não existir em `theme.js`.
