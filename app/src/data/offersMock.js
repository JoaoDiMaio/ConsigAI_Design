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
    route: '/portabilidade',
    note: 'Boa opcao para quem quer diminuir o impacto mensal no orcamento sem pegar dinheiro novo.',
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
// Para desabilitar: setar como array vazio [].
export const FORCED_VISIBLE_OFFER_IDS = ['equilibrio', 'turbo', 'apenas_refin']

export const THIRD_CARD_SUB_OFFERS = {
  contract: { label: 'No contrato', route: '/portabilidade' },
  installment: { label: 'Na parcela', route: '/refinanciamento' },
}

// Mock de resposta da API futura.
// Estrutura de `usuario` e `impacto` virão do endpoint /api/ofertas ou /api/simulacao.
export const MOCK_DADOS = {
  usuario: { salarioBruto: 2200, parcelaAtual: 550 },
  ofertas: [
    { id: 'equilibrio', creditoReceber: 5033.74, parcelaNova: 496.17, economiaTotal: 2399.11 },
    { id: 'folga', creditoReceber: 7593.9, parcelaNova: 433.19, reducaoMensal: 116.81 },
    { id: 'turbo', creditoReceber: 0, parcelaNova: 401.05, economiaContrato: 2960.4, economiaParcela: 148.95 },
    { id: 'apenas_novo', creditoReceber: 4200, parcelaNova: 522.4, economiaTotal: 1104 },
    { id: 'apenas_refin', creditoReceber: 2500, parcelaNova: 463.75, economiaTotal: 1896 },
  ],
  impacto: { pocketToday: 1650, pocketAfter: 1766.81, creditToday: 2845.53, creditAfter: 7593.9 },
}
