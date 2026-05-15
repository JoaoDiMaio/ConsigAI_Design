// Mock data - replace with real API response when backend is ready.
// Shape must match what normalizeApiOffers() in useOffersData expects.
//
// Taxonomia comercial ConsigAI:
// O cliente ve apenas o beneficio final. A complexidade operacional fica no motor.
// Produtos visiveis:
// 1. Dinheiro Novo        -> novo contrato usando margem livre.
// 2. Dinheiro Agora       -> refinanciamento padrao do contrato atual.
// 3. Turbo Economia       -> reduzir custo total ou reduzir parcela, sem foco em dinheiro novo.
// 4. Melhor Equilibrio    -> receber dinheiro e reduzir custo total.
// 5. Mais Folga por Mes   -> receber dinheiro e reduzir parcela mensal.
//
// Estrategias combinadas possiveis por tras dos cards:
// - margem livre + portabilidade;
// - refinanciamento + portabilidade;
// - portabilidade + refinanciamento;
// - unificacao/reorganizacao de contratos;
// - margem livre + reducao de parcela em outro contrato.
//
// Regras de classificacao recomendadas para o backend:
// - Dinheiro Novo: margemLivre > 0 && valorLiberado > 0 && origemOperacao === 'novo_contrato'
// - Dinheiro Agora: valorLiberado > 0 && origemOperacao === 'refinanciamento'
// - Turbo Economia: valorLiberado === 0 && (economiaTotal > 0 || reducaoMensal > 0)
// - Melhor Equilibrio: valorLiberado > 0 && economiaTotal > 0
// - Mais Folga por Mes: valorLiberado > 0 && reducaoMensal > 0
// Se uma oferta tiver valorLiberado > 0, economiaTotal > 0 e reducaoMensal > 0,
// ela deve receber prioridade visual como Melhor Equilibrio com selo de oferta mais completa.

const parseEnvFlag = (value, fallback = false) => {
  if (value == null || value === '') return fallback
  const normalized = String(value).trim().toLowerCase()
  return ['1', 'true', 'yes', 'on'].includes(normalized)
}

export const USE_MOCK_OFFERS = parseEnvFlag(import.meta.env?.VITE_USE_MOCK_OFFERS, true)

export const TURBO_LABEL_INSTALLMENT = 'Parcela menor'
export const TURBO_LABEL_CONTRACT = 'Menor custo total'

export const OFFER_CARD_CONFIG = [
  {
    id: 'equilibrio',
    kind: 'equilibrio',
    ctaName: 'Melhor equilíbrio',
    pill: 'Melhor equilíbrio',
    route: '/estrategia-combinada',
    state: { strategyType: 'novo contrato + economia' },
    note: 'Boa opcao para quem quer dinheiro na conta, parcela menor e prazo mantido.',
  },
  {
    id: 'folga',
    kind: 'folga',
    ctaName: 'Mais folga por mês',
    pill: 'Mais folga por mês',
    route: '/estrategia-combinada',
    state: { strategyType: 'refin + economia' },
    note: 'Boa opcao para quem quer aliviar o orcamento mensal sem receber um valor alto.',
  },
  {
    id: 'turbo',
    kind: 'turbo',
    ctaName: 'Turbo Economia',
    pill: 'Turbo Economia',
    subtitle: 'Foco em melhorar o contrato',
    route: '/portabilidade',
    note: 'Boa opção para quem quer melhorar um contrato existente sem contratar novo dinheiro.',
    subOffers: {
      contract: {
        label: 'Menor custo total',
        ctaName: 'Turbo Economia - Menor custo total',
        benefitLabel: 'Economia no contrato',
        benefitValue: 2960.4,
        detailsMode: 'eco',
      },
      installment: {
        label: 'Parcela menor',
        ctaName: 'Turbo Economia - Parcela menor',
        benefitLabel: 'Alívio mensal',
        benefitValue: 148.95,
        detailsMode: 'parc',
      },
    },
  },
  {
    id: 'apenas_novo',
    kind: 'simples',
    ctaName: 'Dinheiro Novo',
    pill: 'Dinheiro Novo',
    route: '/novo-contrato',
    state: {
      strategyType: 'novo contrato',
      offerLogic: 'margem_livre + valor_liberado',
    },
    note: 'Use sua margem disponível para receber dinheiro novo, com parcela, prazo, taxa e custo total claros antes de contratar.',
  },
  {
    id: 'apenas_refin',
    kind: 'simples',
    ctaName: 'Dinheiro Agora',
    pill: 'Dinheiro Agora',
    route: '/refinanciamento',
    state: {
      strategyType: 'refinanciamento padrao',
      offerLogic: 'contrato_atual + valor_liberado',
    },
    note: 'Use um contrato existente para liberar dinheiro, sempre comparando nova parcela, novo prazo e custo total.',
  },
]

export const MAX_API_CARDS = 3

// IDs exibidos quando o mock de ofertas estiver ativo.
// Mantemos os 3 cards mais estrategicos na home de ofertas.
export const DEFAULT_MOCK_OFFER_IDS = ['equilibrio', 'folga', 'turbo']

export const THIRD_CARD_SUB_OFFERS = {
  contract: { label: 'Menor custo total', route: '/portabilidade' },
  installment: { label: 'Parcela menor', route: '/portabilidade' },
}

// Mock da resposta da API. Todos os campos vêm do backend - nenhum calculado no front.
// Shape esperado de GET /api/ofertas (ou /api/simulacao):
export const MOCK_DADOS = {
  usuario: { salarioBruto: 2200, parcelaAtual: 550 },
  ofertas: [
    {
      id: 'equilibrio',
      creditoReceber: 5033.74,
      parcelaNova: 496.17,
      economiaTotal: 2399.11,
      reducaoMensal: 53.83,
      origemOperacao: 'estrategia_combinada',
      estrategiaInterna: 'margem/refin/portabilidade + reducao_custo_total',
    },
    {
      id: 'folga',
      creditoReceber: 7593.9,
      parcelaNova: 433.19,
      reducaoMensal: 116.81,
      economiaTotal: 0,
      origemOperacao: 'estrategia_combinada',
      estrategiaInterna: 'margem/refin/portabilidade + reducao_parcela',
    },
    {
      id: 'turbo',
      creditoReceber: 0,
      parcelaNova: 433,
      economiaContrato: 2960.4,
      economiaParcela: 148.95,
      origemOperacao: 'portabilidade',
      estrategiaInterna: 'menor_custo_total_ou_parcela_menor',
    },
    {
      id: 'apenas_novo',
      creditoReceber: 4200,
      parcelaNova: 79.2,
      economiaTotal: 0,
      qtdParcelas: 84,
      origemOperacao: 'novo_contrato',
      estrategiaInterna: 'margem_livre',
    },
    {
      id: 'apenas_refin',
      creditoReceber: 12930,
      parcelaNova: 1191,
      economiaTotal: 0,
      qtdParcelas: 84,
      origemOperacao: 'refinanciamento',
      estrategiaInterna: 'contrato_atual',
    },
  ],
  impacto: { pocketToday: 1650, pocketAfter: 1766.81, creditToday: 2845.53, creditAfter: 7593.9 },
}
