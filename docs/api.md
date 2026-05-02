# ConsigAI — Documentação da API

**Base URL:** `https://api.consigai.com.br/v1`  
**Autenticação:** Bearer token no header `Authorization`  
**Content-Type:** `application/json`

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Fluxo Principal](#fluxo-principal)
4. [Endpoints](#endpoints)
   - [POST /leads](#post-leads)
   - [POST /simulacao](#post-simulacao)
   - [GET /simulacao/{token}](#get-simulacaotoken)
   - [POST /propostas](#post-propostas)
   - [GET /propostas/{cpf}](#get-propostascpf)
   - [PUT /clientes/{cpf}/perfil](#put-clientescpfperfil)
5. [Modelos de Dados](#modelos-de-dados)
6. [Erros](#erros)

---

## Visão Geral

A API ConsigAI suporta o fluxo completo de crédito consignado INSS:

```
Cadastro → Simulação → Seleção de Oferta → Contratação → Acompanhamento
```

Todos os valores monetários estão em **BRL (R$)** como `number` com 2 casas decimais.  
Todas as datas no formato **ISO 8601** (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:MM:SSZ`).

---

## Autenticação

```http
Authorization: Bearer <token>
```

Tokens são emitidos por endpoint separado (fora do escopo deste documento). Tokens expiram em 24h.

---

## Fluxo Principal

```
1. POST /leads
   → retorna simulacaoToken

2. POST /simulacao  (usa simulacaoToken)
   → retorna todas as ofertas (portabilidade, refinanciamento, novo contrato, combinadas)

3. [Usuário seleciona oferta na UI]

4. POST /propostas
   → retorna propostaId + protocolo

5. GET /propostas/{cpf}
   → polling de status / histórico
```

Se o usuário retornar em outra sessão, use `GET /simulacao/{token}` para recuperar a simulação sem recadastrar.

---

## Endpoints

---

### POST /leads

Cadastra o lead e inicia o processo. Retorna um `simulacaoToken` para a próxima etapa.

**Request:**

```json
{
  "nomeCompleto": "Carlos Eduardo Martins",
  "cpf": "123.456.789-00",
  "dataNascimento": "1970-04-15",
  "telefone": "11999990000",
  "email": "carlos@email.com",
  "extratoInss": {
    "arquivo": "<base64>",
    "mimeType": "application/pdf",
    "nomeArquivo": "extrato.pdf"
  }
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `nomeCompleto` | string | ✓ | Nome completo (máx. 120 chars) |
| `cpf` | string | ✓ | CPF com ou sem máscara |
| `dataNascimento` | string | ✓ | Formato `YYYY-MM-DD` |
| `telefone` | string | ✓ | Somente dígitos, com DDD |
| `email` | string | ✓ | Máx. 254 chars |
| `extratoInss.arquivo` | string | — | Base64 do arquivo (PDF, JPG, PNG, máx. 10 MB) |
| `extratoInss.mimeType` | string | — | MIME type do arquivo |
| `extratoInss.nomeArquivo` | string | — | Nome original do arquivo |

**Response `201 Created`:**

```json
{
  "leadId": "lead_abc123",
  "cpf": "123.456.789-00",
  "nomeCompleto": "Carlos Eduardo Martins",
  "status": "ativo",
  "simulacaoToken": "sim_xyz789",
  "proximoPasso": "/ofertas"
}
```

**Erros possíveis:** `lead_duplicado`, `cpf_invalido`, `extrato_ilegivel`

---

### POST /simulacao

Gera todas as ofertas disponíveis para o cliente. É a chamada central — o frontend usa a resposta para montar as telas de Portabilidade, Refinanciamento, Novo Contrato e Estratégia Combinada **sem chamadas adicionais**.

**Request:**

```json
{
  "cpf": "123.456.789-00",
  "leadId": "lead_abc123",
  "dadosBancarios": {
    "bancoNome": "Caixa",
    "tipoConta": "corrente",
    "agencia": "0001",
    "conta": "12345-6",
    "pix": "carlos@email.com"
  }
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `cpf` | string | ✓ | CPF do cliente |
| `leadId` | string | ✓ | ID retornado em `/leads` |
| `dadosBancarios.bancoNome` | string | ✓ | Nome do banco |
| `dadosBancarios.tipoConta` | string | ✓ | `corrente`, `poupanca` ou `pagamento` |
| `dadosBancarios.agencia` | string | ✓ | Agência (máx. 6 dígitos) |
| `dadosBancarios.conta` | string | ✓ | Conta com dígito (ex: `12345-6`) |
| `dadosBancarios.pix` | string | — | Chave PIX (máx. 120 chars) |

**Response `200 OK`:**

```json
{
  "simulacaoId": "sim_xyz789",
  "expiresAt": "2026-05-01T18:00:00Z",

  "cliente": {
    "nomeCompleto": "Carlos Eduardo Martins",
    "cpf": "123.456.789-00",
    "dataNascimento": "1970-04-15",
    "beneficioNumero": "1234567890",
    "beneficioTipo": "Aposentadoria por Idade",
    "salarioBruto": 2200.00,
    "margemDisponivel": 770.00,
    "margemUsada": 550.00,
    "margemTotal": 1320.00
  },

  "contratos": [
    {
      "id": "ctr_001",
      "banco": "Banco PAN",
      "codigoContrato": "PAN-2022-0419",
      "saldoDevedor": 12400.00,
      "parcelaAtual": 280.00,
      "prazoRestante": 60,
      "taxaMensal": 2.14,
      "elegivel": {
        "portabilidade": true,
        "refinanciamento": true
      }
    },
    {
      "id": "ctr_002",
      "banco": "Facta",
      "codigoContrato": "FAC-2023-1102",
      "saldoDevedor": 8900.00,
      "parcelaAtual": 180.00,
      "prazoRestante": 72,
      "taxaMensal": 2.28,
      "elegivel": {
        "portabilidade": true,
        "refinanciamento": true
      }
    },
    {
      "id": "ctr_003",
      "banco": "C6 Consig",
      "codigoContrato": "C6C-2023-0887",
      "saldoDevedor": 5200.00,
      "parcelaAtual": 90.00,
      "prazoRestante": 84,
      "taxaMensal": 1.95,
      "elegivel": {
        "portabilidade": false,
        "refinanciamento": true
      }
    }
  ],

  "ofertas": {

    "portabilidade": {
      "disponivel": true,
      "modos": {
        "economia": {
          "parcelaNova": 496.00,
          "economiaTotal": 2399.00,
          "economiaMensal": 54.00,
          "margemLivre": 320.00,
          "creditoDisponivel": 5033.00,
          "contratosIncluidos": ["ctr_001", "ctr_002"],
          "taxaMedia": 1.79,
          "prazo": 84
        },
        "parcelaMenor": {
          "parcelaNova": 433.00,
          "economiaMensal": 117.00,
          "margemLivre": 480.00,
          "creditoDisponivel": 7593.00,
          "contratosIncluidos": ["ctr_001", "ctr_002"],
          "taxaMedia": 1.79,
          "prazo": 84
        }
      }
    },

    "refinanciamento": {
      "disponivel": true,
      "cenarios": [
        {
          "key": "max_dinheiro",
          "label": "Máximo dinheiro",
          "voceRecebe": 12930.00,
          "parcelaNova": 1191.00,
          "margemLivre": 56.00,
          "creditoDisponivel": 880.00,
          "contratosIncluidos": ["ctr_001", "ctr_002", "ctr_003"],
          "troco": [
            { "contratoId": "ctr_001", "banco": "Banco PAN", "valor": 5820.00 },
            { "contratoId": "ctr_002", "banco": "Facta", "valor": 4810.00 },
            { "contratoId": "ctr_003", "banco": "C6 Consig", "valor": 2300.00 }
          ]
        },
        {
          "key": "max_margem",
          "label": "Máxima margem",
          "voceRecebe": 9730.00,
          "parcelaNova": 893.00,
          "margemLivre": 120.00,
          "creditoDisponivel": 1880.00,
          "contratosIncluidos": ["ctr_002", "ctr_003"],
          "troco": [
            { "contratoId": "ctr_002", "banco": "Facta", "valor": 5200.00 },
            { "contratoId": "ctr_003", "banco": "C6 Consig", "valor": 4530.00 }
          ]
        },
        {
          "key": "menor_parcela",
          "label": "Menor parcela",
          "voceRecebe": 5550.00,
          "parcelaNova": 381.00,
          "margemLivre": 389.00,
          "creditoDisponivel": 6102.00,
          "contratosIncluidos": ["ctr_002"],
          "troco": [
            { "contratoId": "ctr_002", "banco": "Facta", "valor": 5550.00 }
          ]
        }
      ]
    },

    "novoContrato": {
      "disponivel": true,
      "margemDisponivel": 770.00,
      "creditoMaximo": 8400.00,
      "valorMinimo": 500.00,
      "taxaMensal": 1.88,
      "prazosDisponiveis": [24, 48, 84],
      "ancoras": [
        { "valor": 8400.00, "prazo": 84, "parcela": 158.40, "recomendado": true },
        { "valor": 5000.00, "prazo": 84, "parcela": 94.40, "recomendado": false },
        { "valor": 2500.00, "prazo": 48, "parcela": 74.20, "recomendado": false }
      ]
    },

    "combinadas": {
      "novoMaisEconomia": {
        "disponivel": true,
        "cenarios": [
          {
            "key": "novo_max",
            "title": "Máximo crédito",
            "desc": "Receba o máximo disponível e quite contratos antigos",
            "voceRecebe": 8400.00,
            "economia": 2100.00,
            "parcelaNova": 720.00,
            "margem": 56.00
          },
          {
            "key": "novo_bal",
            "title": "Equilibrado",
            "desc": "Crédito extra com folga na margem",
            "voceRecebe": 5000.00,
            "economia": 2100.00,
            "parcelaNova": 560.00,
            "margem": 210.00
          },
          {
            "key": "novo_min",
            "title": "Mínimo compromisso",
            "desc": "Crédito menor, maior alívio mensal",
            "voceRecebe": 2500.00,
            "economia": 2100.00,
            "parcelaNova": 380.00,
            "margem": 390.00
          }
        ]
      },
      "refinMaisEconomia": {
        "disponivel": true,
        "cenarios": [
          {
            "key": "refin_money",
            "title": "Máximo dinheiro",
            "desc": "Refinancia tudo e recebe o maior valor possível",
            "voceRecebe": 12930.00,
            "economia": 0,
            "parcelaNova": 1191.00,
            "margem": 56.00
          },
          {
            "key": "refin_margin",
            "title": "Máxima margem",
            "desc": "Equilíbrio entre crédito e alívio de margem",
            "voceRecebe": 9730.00,
            "economia": 1200.00,
            "parcelaNova": 893.00,
            "margem": 120.00
          },
          {
            "key": "refin_install",
            "title": "Menor parcela",
            "desc": "Parcela mais baixa, mais sobra no salário",
            "voceRecebe": 5550.00,
            "economia": 2200.00,
            "parcelaNova": 381.00,
            "margem": 389.00
          }
        ]
      }
    }

  },

  "recomendacao": {
    "ofertaPrincipal": "portabilidade",
    "modoRecomendado": "economia",
    "motivo": "Maior economia total com menor impacto na margem"
  },

  "impacto": {
    "salarioBruto": 2200.00,
    "parcelaAtual": 550.00,
    "sobrasAtual": 1650.00,
    "cenarioRecomendado": {
      "parcelaNova": 496.00,
      "sobrasNovas": 1704.00,
      "creditoExtra": 5033.00
    }
  }
}
```

**Erros possíveis:** `cpf_sem_margem`, `simulacao_expirada`, `dados_bancarios_invalidos`

---

### GET /simulacao/{token}

Recupera simulação existente. Útil para sessões retomadas sem recadastrar o cliente.

**Path param:** `token` — valor de `simulacaoId` retornado em `/leads` ou `/simulacao`

**Response `200 OK`:** Mesmo schema de `POST /simulacao`

**Erros possíveis:** `simulacao_expirada`, `simulacao_nao_encontrada`

---

### POST /propostas

Contrata a oferta selecionada pelo cliente. Cria a proposta e aciona o fluxo operacional.

**Request:**

```json
{
  "simulacaoId": "sim_xyz789",
  "cpf": "123.456.789-00",
  "ofertaSelecionada": {
    "tipo": "portabilidade",
    "chave": "economia",
    "contratosIncluidos": ["ctr_001", "ctr_002"]
  },
  "dadosBancarios": {
    "bancoNome": "Caixa",
    "tipoConta": "corrente",
    "agencia": "0001",
    "conta": "12345-6",
    "pix": "carlos@email.com"
  },
  "aceiteTermos": true,
  "aceiteConsultaCredito": true
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `simulacaoId` | string | ✓ | ID da simulação ativa |
| `cpf` | string | ✓ | CPF do cliente |
| `ofertaSelecionada.tipo` | string | ✓ | `portabilidade`, `refinanciamento`, `novoContrato`, `combinada` |
| `ofertaSelecionada.chave` | string | ✓ | Chave do modo/cenário selecionado (ex: `economia`, `max_dinheiro`) |
| `ofertaSelecionada.contratosIncluidos` | string[] | ✓ | IDs dos contratos envolvidos |
| `dadosBancarios` | object | ✓ | Dados bancários para crédito (mesmo schema do `/simulacao`) |
| `aceiteTermos` | boolean | ✓ | Deve ser `true` para prosseguir |
| `aceiteConsultaCredito` | boolean | ✓ | Deve ser `true` para prosseguir |

**Response `201 Created`:**

```json
{
  "propostaId": "prop_aaa111",
  "protocolo": "CSG-2026-05001",
  "status": "enviada",
  "ofertaContratada": {
    "tipo": "portabilidade",
    "parcelaNova": 496.00,
    "economiaTotal": 2399.00,
    "prazo": 84
  },
  "proximosPassos": [
    { "label": "Proposta enviada", "done": true },
    { "label": "Análise da margem", "done": false },
    { "label": "Retenção aplicada", "done": false },
    { "label": "Aceite final do cliente", "done": false },
    { "label": "Pagamento", "done": false }
  ],
  "contatoWhatsapp": "11999998888",
  "tempoEstimado": "até 2 horas úteis"
}
```

**Erros possíveis:** `simulacao_expirada`, `contrato_nao_elegivel`, `aceite_ausente`, `dados_bancarios_invalidos`

---

### GET /propostas/{cpf}

Retorna histórico e status de todas as propostas do cliente. Usado na tela de Acompanhamento.

**Path param:** `cpf` — CPF do cliente (com ou sem máscara)

**Query params opcionais:**

| Param | Tipo | Descrição |
|-------|------|-----------|
| `status` | string | Filtra por status: `enviada`, `andamento`, `aceita`, `recusada`, `concluida`, `retida` |
| `limit` | number | Máx. de registros (padrão: 20) |
| `offset` | number | Paginação (padrão: 0) |

**Response `200 OK`:**

```json
{
  "resumo": {
    "aceitas": 3,
    "naoAceitas": 1,
    "emAndamento": 2,
    "concluidas": 4
  },
  "propostas": [
    {
      "id": "prop_aaa111",
      "protocolo": "CSG-2026-05001",
      "produto": "Portabilidade",
      "abertaEm": "2026-04-28",
      "status": "andamento",
      "ofertaInicial": {
        "cashOut": null,
        "parcela": 496.00,
        "prazo": "84x"
      },
      "ofertaEfetivada": {
        "cashOut": null,
        "parcela": 510.00,
        "prazo": "84x",
        "nota": "Parcela ajustada pela análise da margem"
      },
      "passos": [
        { "label": "Proposta enviada", "done": true },
        { "label": "Análise da margem", "done": true },
        { "label": "Retenção aplicada", "done": false },
        { "label": "Aceite final do cliente", "done": false },
        { "label": "Pagamento", "done": false }
      ]
    }
  ]
}
```

**Status possíveis de proposta:**

| Valor | Descrição |
|-------|-----------|
| `enviada` | Proposta criada, aguardando análise |
| `andamento` | Em processamento pela operação |
| `retida` | Banco de origem tentou reter o cliente |
| `aceita` | Proposta aprovada e aceita |
| `recusada` | Proposta negada |
| `concluida` | Crédito pago / operação finalizada |

---

### PUT /clientes/{cpf}/perfil

Atualiza dados cadastrais do cliente (usado na tela de Configurações).

**Path param:** `cpf` — CPF do cliente

**Request:**

```json
{
  "pessoal": {
    "nomeCompleto": "Carlos Eduardo Martins",
    "dataNascimento": "1970-04-15",
    "telefone": "11999990000",
    "email": "carlos@email.com"
  },
  "endereco": {
    "logradouro": "Rua das Flores",
    "numero": "123",
    "complemento": "Apto 4B",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01310-100"
  },
  "dadosBancarios": {
    "bancoNome": "Nubank",
    "tipoConta": "pagamento",
    "agencia": "0001",
    "conta": "98765-4",
    "pix": "carlos@email.com"
  }
}
```

Todos os campos são opcionais — envie apenas as seções que foram alteradas.

**Response `200 OK`:**

```json
{
  "cpf": "123.456.789-00",
  "atualizadoEm": "2026-05-01T14:32:00Z",
  "camposAtualizados": ["pessoal", "dadosBancarios"]
}
```

---

## Modelos de Dados

### Contrato

```typescript
interface Contrato {
  id: string;
  banco: string;
  codigoContrato: string;
  saldoDevedor: number;
  parcelaAtual: number;
  prazoRestante: number;       // em meses
  taxaMensal: number;          // percentual, ex: 2.14 = 2,14% a.m.
  elegivel: {
    portabilidade: boolean;
    refinanciamento: boolean;
  };
}
```

### Oferta de Portabilidade — Modo

```typescript
interface ModoPortabilidade {
  parcelaNova: number;
  economiaTotal: number;
  economiaMensal: number;
  margemLivre: number;
  creditoDisponivel: number;
  contratosIncluidos: string[];  // IDs de Contrato
  taxaMedia: number;
  prazo: number;                 // em meses
}
```

### Cenário de Refinanciamento

```typescript
interface CenarioRefinanciamento {
  key: string;
  label: string;
  voceRecebe: number;
  parcelaNova: number;
  margemLivre: number;
  creditoDisponivel: number;
  contratosIncluidos: string[];
  troco: Array<{
    contratoId: string;
    banco: string;
    valor: number;
  }>;
}
```

### Âncora de Novo Contrato

```typescript
interface AncoraNovoContrato {
  valor: number;
  prazo: number;
  parcela: number;
  recomendado: boolean;
}
```

### Passo de Proposta

```typescript
interface PassoProposta {
  label: string;
  done: boolean;
}
```

---

## Erros

Todas as respostas de erro seguem o schema:

```json
{
  "erro": "codigo_do_erro",
  "mensagem": "Descrição legível para o usuário.",
  "codigo": 422
}
```

### Tabela de erros

| Código HTTP | `erro` | Descrição |
|:-----------:|--------|-----------|
| 400 | `requisicao_invalida` | Payload malformado ou campo inválido |
| 401 | `nao_autorizado` | Token ausente ou expirado |
| 404 | `nao_encontrado` | Recurso não existe |
| 409 | `lead_duplicado` | CPF já cadastrado |
| 409 | `contrato_nao_elegivel` | Contrato não aceita a operação solicitada |
| 422 | `cpf_invalido` | CPF com dígitos verificadores incorretos |
| 422 | `cpf_sem_margem` | CPF sem margem consignável disponível |
| 422 | `dados_bancarios_invalidos` | Banco rejeitou os dados bancários informados |
| 422 | `aceite_ausente` | `aceiteTermos` ou `aceiteConsultaCredito` não é `true` |
| 422 | `extrato_ilegivel` | Arquivo do extrato INSS não pôde ser processado |
| 410 | `simulacao_expirada` | Token de simulação vencido — inicie nova simulação |
| 404 | `simulacao_nao_encontrada` | Token de simulação não existe |
| 500 | `erro_interno` | Erro inesperado no servidor |

---

## Notas de Implementação

### Cálculo de parcela para Novo Contrato

O frontend calcula parcelas em tempo real usando a fórmula Price:

```
PMT = PV × [i × (1 + i)^n] / [(1 + i)^n − 1]
```

Onde `PV` = valor solicitado, `i` = `taxaMensal / 100`, `n` = prazo em meses.

O backend valida o cálculo antes de confirmar a proposta.

### Expiração da simulação

`expiresAt` em `POST /simulacao` indica quando o token expira. O frontend deve verificar esse campo e redirecionar para novo cadastro se expirado.

### Dados bancários

Podem ser enviados tanto em `/simulacao` quanto em `/propostas`. O valor em `/propostas` tem precedência — use isso para atualizar dados bancários no momento da contratação sem exigir um `PUT /perfil` separado.
