export const statusMap = {
  aceita:    { label: 'Aceita',           bg: '#e8f5ee', color: '#0a6640', border: '#b8e0ca' },
  recusada:  { label: 'Nao aceita',       bg: '#fff1f1', color: '#b32727', border: '#f1c2c2' },
  andamento: { label: 'Em andamento',     bg: '#e8eeff', color: '#2350c8', border: '#c9d7ff' },
  concluida: { label: 'Concluida',        bg: '#edf8f3', color: '#16a364', border: '#b8e0ca' },
  retida:    { label: 'Retida',           bg: '#fff6e7', color: '#9a6500', border: '#f2d8a9' },
}

export const summaryCards = [
  { title: 'Propostas aceitas',        value: 3, status: 'aceita'    },
  { title: 'Propostas nao aceitas',    value: 1, status: 'recusada'  },
  { title: 'Operacoes em andamento',   value: 2, status: 'andamento' },
  { title: 'Contratos concluídos',     value: 4, status: 'concluida' },
]

export const proposals = [
  {
    id: 'PR-23981',
    product: 'Portabilidade',
    openedAt: '10/04/2026',
    status: 'retida',
    initialOffer:   { cashOut: 'R$ 4.200,00', installment: 'R$ 538,40', term: '84x' },
    fulfilledOffer: { cashOut: 'R$ 3.100,00', installment: 'R$ 487,90', term: '84x' },
    note: 'Contrato retido pelo banco de origem. Oferta concretizada ajustada apos contraproposta.',
    progress: [
      { label: 'Proposta enviada',        done: true  },
      { label: 'Analise da margem',       done: true  },
      { label: 'Retencao aplicada',       done: true  },
      { label: 'Aceite final do cliente', done: false },
      { label: 'Pagamento',              done: false },
    ],
  },
  {
    id: 'PR-23974',
    product: 'Novo contrato',
    openedAt: '06/04/2026',
    status: 'concluida',
    initialOffer:   { cashOut: 'R$ 8.400,00', installment: 'R$ 622,15', term: '96x' },
    fulfilledOffer: { cashOut: 'R$ 8.400,00', installment: 'R$ 622,15', term: '96x' },
    note: 'Oferta mantida sem alteracoes. Contrato assinado e valor creditado.',
    progress: [
      { label: 'Proposta enviada',    done: true },
      { label: 'Aprovacao de credito', done: true },
      { label: 'Assinatura',          done: true },
      { label: 'Pagamento',           done: true },
    ],
  },
  {
    id: 'PR-23962',
    product: 'Refinanciamento',
    openedAt: '02/04/2026',
    status: 'andamento',
    initialOffer:   { cashOut: 'R$ 2.950,00', installment: 'R$ 413,20', term: '72x' },
    fulfilledOffer: { cashOut: 'R$ 2.950,00', installment: 'R$ 413,20', term: '72x' },
    note: 'Aguardando assinatura eletrônica para concluir a liberacao do valor.',
    progress: [
      { label: 'Proposta enviada',    done: true  },
      { label: 'Aprovacao de credito', done: true  },
      { label: 'Assinatura',          done: false },
      { label: 'Pagamento',           done: false },
    ],
  },
]
