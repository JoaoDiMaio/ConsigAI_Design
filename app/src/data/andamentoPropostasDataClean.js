export const financialSummary = {
  economyMonthly: 'R$ 28',
  economyTotal: 'R$ 2.399',
  offeredCash: 'R$ 12.600',
  releasedCash: 'R$ 11.500',
  salaryBefore: 'R$ 1.650',
  salaryAfter: 'R$ 2.121',
  salaryGain: 'R$ 471 de salario liquido',
  salaryBeforeWidth: '78%',
  salaryAfterWidth: '100%',
  installmentBefore: 'R$ 650,15',
  installmentAfter: 'R$ 622,15',
  retentionValue: 'R$ 1.100 ajustados',
}

export const statusMap = {
  aceita: { label: 'Aceita', bg: '#F0FFF8', color: '#007A52', border: '#BDECD7' },
  recusada: { label: 'Nao aceita', bg: '#FFF1F1', color: '#B32727', border: '#F2C2C2' },
  andamento: { label: 'Em andamento', bg: '#EEF4FF', color: '#2454D6', border: '#C7D9FF' },
  concluida: { label: 'Concluida', bg: '#F0FFF8', color: '#007A52', border: '#BDECD7' },
  retida: { label: 'Retida', bg: '#FFF7E8', color: '#9A6500', border: '#F4D19B' },
}

export const summaryCardDefs = [
  { title: 'Propostas aceitas',      status: 'aceita'    },
  { title: 'Propostas nao aceitas',  status: 'recusada'  },
  { title: 'Operacoes em andamento', status: 'andamento' },
  { title: 'Contratos concluidos',   status: 'concluida' },
]

export const proposals = [
  {
    id: 'PR-23981',
    product: 'Portabilidade',
    openedAt: '10/04/2026',
    updatedAt: '05/05/2026',
    status: 'retida',
    initialOffer: { cashOut: 'R$ 4.200,00', installment: 'R$ 538,40', term: '84x' },
    fulfilledOffer: { cashOut: 'R$ 3.100,00', installment: 'R$ 487,90', term: '84x' },
    note: 'Contrato retido pelo banco de origem. Oferta concretizada ajustada apos contraproposta.',
    progress: [
      { label: 'Proposta enviada', done: true },
      { label: 'Analise da margem', done: true },
      { label: 'Retencao aplicada', done: true },
      { label: 'Aceite final do cliente', done: false },
      { label: 'Pagamento', done: false },
    ],
  },
  {
    id: 'PR-23974',
    product: 'Novo contrato',
    openedAt: '06/04/2026',
    updatedAt: '28/04/2026',
    status: 'concluida',
    initialOffer: { cashOut: 'R$ 8.400,00', installment: 'R$ 622,15', term: '96x' },
    fulfilledOffer: { cashOut: 'R$ 8.400,00', installment: 'R$ 622,15', term: '96x' },
    note: 'Oferta mantida sem alteracoes. Contrato assinado e valor creditado.',
    progress: [
      { label: 'Proposta enviada', done: true },
      { label: 'Aprovacao de credito', done: true },
      { label: 'Assinatura', done: true },
      { label: 'Pagamento', done: true },
    ],
  },
  {
    id: 'PR-23962',
    product: 'Refinanciamento',
    openedAt: '02/04/2026',
    updatedAt: '06/05/2026',
    status: 'andamento',
    initialOffer: { cashOut: 'R$ 2.950,00', installment: 'R$ 413,20', term: '72x' },
    fulfilledOffer: { cashOut: 'R$ 2.950,00', installment: 'R$ 413,20', term: '72x' },
    note: 'Aguardando assinatura eletronica para concluir a liberacao do valor.',
    progress: [
      { label: 'Proposta enviada', done: true },
      { label: 'Aprovacao de credito', done: true },
      { label: 'Assinatura', done: false },
      { label: 'Pagamento', done: false },
    ],
  },
]
