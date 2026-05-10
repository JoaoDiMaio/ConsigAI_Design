// Mock data - replace with real API response when backend is ready.
// Shape must match what normalizeApiOffers() in useOffersData expects.

const parseEnvFlag = (value, fallback = false) => {
  if (value == null || value === '') return fallback
  const normalized = String(value).trim().toLowerCase()
  return ['1', 'true', 'yes', 'on'].includes(normalized)
}

export const USE_MOCK_OFFERS = parseEnvFlag(import.meta.env?.VITE_USE_MOCK_OFFERS, true)

export const TURBO_LABEL_INSTALLMENT = 'Na parcela'
export const TURBO_LABEL_CONTRACT = 'No contrato'

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
    subtitle: 'Foco em pagar menos',
    route: '/portabilidade',
    note: 'Boa opção para quem quer economizar sem contratar novo crédito.',
    subOffers: {
      contract: {
        label: 'No contrato',
        ctaName: 'Turbo Economia - No contrato',
        benefitLabel: 'Economia no contrato',
        benefitValue: 2960.4,
        detailsMode: 'eco',
      },
      installment: {
        label: 'Na parcela',
        ctaName: 'Turbo Economia - Na parcela',
        benefitLabel: 'Alivio mensal',
        benefitValue: 148.95,
        detailsMode: 'parc',
      },
    },
  },
  {
    id: 'apenas_novo',
    kind: 'simples',
    ctaName: 'Novo Contrato',
    pill: 'Novo Contrato',
    route: '/novo-contrato',
    note: 'Oferta focada em liberar valor com menor complexidade.',
  },
  {
    id: 'apenas_refin',
    kind: 'simples',
    ctaName: 'Refinanciamento',
    pill: 'Refinanciamento',
    route: '/refinanciamento',
    note: 'Oferta direta para ajustar parcela e manter o fluxo mensal mais leve.',
  },
]

export const MAX_API_CARDS = 3

// IDs exibidos quando o mock de ofertas estiver ativo.
export const DEFAULT_MOCK_OFFER_IDS = ['apenas_novo', 'equilibrio', 'folga']

export const THIRD_CARD_SUB_OFFERS = {
  contract: { label: 'No contrato', route: '/portabilidade' },
  installment: { label: 'Na parcela', route: '/refinanciamento' },
}

// Mock da resposta da API. Todos os campos vêm do backend - nenhum calculado no front.
// Shape esperado de GET /api/ofertas (ou /api/simulacao):
export const MOCK_DADOS = {
  usuario: { salarioBruto: 2200, parcelaAtual: 550 },
  ofertas: [
    { id: 'equilibrio', creditoReceber: 5033.74, parcelaNova: 496.17, economiaTotal: 2399.11 },
    { id: 'folga', creditoReceber: 7593.9, parcelaNova: 433.19, reducaoMensal: 116.81 },
    { id: 'turbo', creditoReceber: 0, parcelaNova: 401.05, economiaContrato: 2960.4, economiaParcela: 148.95 },
    { id: 'apenas_novo', creditoReceber: 4200, parcelaNova: 79.2, economiaTotal: 1104, qtdParcelas: 84 },
    { id: 'apenas_refin', creditoReceber: 12930, parcelaNova: 1191, economiaTotal: 1896, qtdParcelas: 84 },
  ],
  impacto: { pocketToday: 1650, pocketAfter: 1766.81, creditToday: 2845.53, creditAfter: 7593.9 },
}
