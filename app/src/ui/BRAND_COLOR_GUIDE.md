# ConsigAI Brand Color Guide

Fonte oficial: [theme.js](/C:/Users/joaod/OneDrive/Documents/GitHub/ConsigAI_Design/app/src/ui/theme.js:1)

## Objetivo

Este documento define a funcao de cada cor no ConsigAI.
Cor no produto deve comunicar funcao financeira, nao apenas beleza.

## Regras base

- Azul comunica marca, confianca, selecao, interacao, CTA e valor financeiro estrutural.
- Verde comunica economia, ganho, reducao de custo e beneficio positivo.
- Cinza comunica contexto neutro, valor anterior, apoio e informacao auxiliar.
- Dourado comunica recomendacao editorial discreta.
- Ambar comunica aviso leve, estimativa ou sujeito a analise.
- Vermelho comunica erro real, perda real ou falha operacional.

## Tokens oficiais

| Token | Hex | Funcao | Usar em | Nao usar em |
|---|---|---|---|---|
| `--color-brand-primary` | `#043B8B` | azul principal da marca | CTA principal, links, elementos institucionais | economia |
| `--color-brand-dark` | `#002D6E` | azul escuro institucional | titulos, resumos, valores principais | estados positivos |
| `--color-brand-interactive` | `#2454D6` | azul de selecao e foco | borda selected, abas, hover, foco | economia |
| `--color-brand-soft` | `#F4F9FF` | fundo azul suave | cards neutros, superficies leves | CTA principal |
| `--color-brand-accent` | `#1DA1EB` | acento de marca | logo, brilho, detalhe ilustrativo | economia semantica |
| `--color-success` | `#00A86B` | verde de beneficio vivo | economia mensal, ganho recorrente, destaque positivo | selecao principal |
| `--color-success-dark` | `#007A52` | verde positivo sobrio | economia total, texto positivo curto, beneficio consolidado | CTA principal |
| `--color-success-soft` | `#F0FFF8` | fundo positivo | cards de beneficio, bloco "depois", comparacao favoravel | cards neutros |
| `--color-success-border` | `#BDECD7` | borda positiva | bordas de blocos verdes | selected state |
| `--color-text-primary` | `#071B45` | texto forte | texto principal, labels importantes | microcopy leve |
| `--color-text-secondary` | `#64748B` | texto auxiliar | descricao, apoio, observacoes | valores-chave |
| `--color-text-muted` | `#8A9AB8` | apoio leve | placeholder, apoio secundario | titulos e totais |
| `--color-border` | `#DDE8F6` | borda neutra | divisores, inputs, cards padrao | destaque selecionado |
| `--color-border-strong` | `#BFD4F6` | borda azul funcional | ghost buttons, secundarios, apoio de interacao | borda default de tudo |
| `--color-surface` | `#FFFFFF` | superficie principal | cards, paineis e blocos | badge semantico |
| `--color-surface-subtle` | `#F8FBFF` | superficie suave | areas comparativas e paineis leves | CTA |
| `--color-warning` | `#9A6500` | atencao leve | estimado, sujeito a analise | erro real |
| `--color-warning-soft` | `#FFF6E7` | fundo de aviso | selos leves, aviso discreto | ganho |
| `--color-error` | `#B32727` | erro real | erro de formulario, falha, perda real | valor anterior neutro |
| `--color-error-strong` | `#E53E3E` | erro forte | destaque de falha | comparativo comum |

## Azul: quando usar

- `brand-primary`: acao principal e identidade.
- `brand-dark`: titulo, valor financeiro principal, headline institucional.
- `brand-interactive`: selected, tabs, hover, borda ativa.
- `brand-soft`: superficies neutras e comparativas.
- `brand-accent`: detalhe visual e logo. Nao usar como economia.

## Verde: quando usar

- `success`: economia mensal, alivio recorrente, ganho mais imediato.
- `success-dark`: economia total, beneficio consolidado, texto positivo curto.
- `success-soft`: fundo positivo.
- `success-border`: moldura de bloco favoravel.

## Regras semanticas obrigatorias

- Selecao de card ou oferta deve ser azul.
- Economia deve ser verde.
- Credito liberado deve ser azul escuro, nunca verde.
- Valor anterior deve ser cinza ou neutro; vermelho so quando houver perda ou erro real.
- Ciano nao comunica economia.
- Nao criar novo verde ou azul fora dos tokens oficiais.

## Padroes de ofertas

| Situacao | Cor |
|---|---|
| Oferta selecionada | `--color-brand-interactive` |
| Oferta recomendada | dourado discreto em badge |
| Oferta disponivel | azul suave ou neutro |
| Valor liberado | `--color-brand-dark` |
| Economia mensal | `--color-success` |
| Economia total | `--color-success-dark` |
| Parcela nova favoravel | `--color-success-dark` |
| Margem livre | `--color-brand-dark` |
| Taxa e prazo | `--color-text-secondary` ou `--color-brand-dark` |
| Antes | `--color-text-secondary` |
| Depois favoravel | verde |

## Padroes por pagina

### Novo Contrato

- Oferta recomendada pode ter badge institucional azul.
- Oferta de maior dinheiro usa azul mais ativo.
- Oferta de menor impacto mensal pode usar apoio verde.
- Selecao continua azul em todos os casos.

### Refinanciamento

- Cenario estrutural e CTA em azul.
- Cenario com maior dinheiro pode usar azul interativo.
- Cenario de alivio ou melhora pode usar verde.
- Comparativos antes/depois mantem "antes" neutro e "depois" favoravel em verde.

### Portabilidade

- Abas de estrategia usam selecao azul.
- `Quero Economizar` e `Parcela Menor` se diferenciam pelo beneficio, nao pela selecao.
- Economia total usa `--color-success-dark`.
- Alivio mensal usa `--color-success`.

### Ofertas

- Selecao sempre azul.
- Ganho ou beneficio sempre verde.
- Oferta disponivel nao pode parecer aprovada so porque esta verde.
- `Turbo Economia` pode diferenciar:
- `No contrato`: verde mais sobrio.
- `Na parcela`: verde mais vivo.

## Estimado vs confirmado

- `Estimado`: pode usar verde com apoio de warning ou texto explicativo.
- `Confirmado`: pode usar verde direto sem ambiguidade.
- Nunca deixar economia estimada parecer aprovacao garantida.

## Proibicoes

- Nao usar verde para tudo.
- Nao usar vermelho para simples valor anterior se isso gerar susto.
- Nao usar `#00E7FF` como economia.
- Nao inventar novo tom sem criar token em `theme.js`.
- Nao usar cor sem funcao definida.

## Ordem de decisao

1. Definir a funcao semantica.
2. Escolher o token oficial.
3. Aplicar o mesmo padrao da pagina mais proxima.
4. So usar hex direto quando o token ainda nao existir em `theme.js`.
