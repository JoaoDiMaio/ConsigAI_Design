// Mock data — replace DADOS with real API response when backend is ready.
// Shape must match what normalizeApiOffers() in useOffersData expects.

export const OFFER_CARD_CONFIG = [
  {
    id: 'equilibrio',
    kind: 'equilibrio',
    ctaName: 'Melhor Equilibrio',
    pill: 'Melhor Equilibrio',
    route: '/estrategia-combinada',
    state: { strategyType: 'novo contrato + economia' },
    note: 'Boa opcao para quem quer dinheiro na conta, parcela menor e prazo mantido.',
  },
  {
    id: 'folga',
    kind: 'folga',
    ctaName: 'Mais Folga por Mes',
    pill: 'Mais Folga por Mes',
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

// IDs a mostrar sem chamada à API. Limpar quando o endpoint /api/ofertas estiver pronto.
export const FORCED_VISIBLE_OFFER_IDS = OFFER_CARD_CONFIG.map(c => c.id)

export const THIRD_CARD_SUB_OFFERS = {
  contract: { label: 'No contrato', route: '/portabilidade' },
  installment: { label: 'Na parcela', route: '/refinanciamento' },
}

// Mock da resposta da API. Todos os campos vêm do backend — nenhum calculado no front.
// Shape esperado de GET /api/ofertas (ou /api/simulacao):
export const MOCK_DADOS = {
  usuario: { salarioBruto: 2200, parcelaAtual: 550 },
  ofertas: [
    { id: 'equilibrio', creditoReceber: 5033.74, parcelaNova: 496.17, economiaTotal: 2399.11 },
    { id: 'folga', creditoReceber: 7593.9, parcelaNova: 433.19, reducaoMensal: 116.81 },
    { id: 'turbo', creditoReceber: 0, parcelaNova: 401.05, economiaContrato: 2960.4, economiaParcela: 148.95 },
    { id: 'apenas_novo', creditoReceber: 4200, parcelaNova: 522.4, economiaTotal: 1104, qtdParcelas: 48 },
    { id: 'apenas_refin', creditoReceber: 2500, parcelaNova: 463.75, economiaTotal: 1896, qtdParcelas: 48 },
  ],
  impacto: { pocketToday: 1650, pocketAfter: 1766.81, creditToday: 2845.53, creditAfter: 7593.9 },
}
