import { createElement as h } from 'react'
import { colors } from '../ui/theme'

export const SCENARIOS = [
  {
    key: 'dinheiro',
    eyebrow: 'Cenário 1',
    title: 'Máximo dinheiro',
    desc: 'Receba o maior valor possível refinanciando todos os contratos elegíveis',
    cash: 'R$ 12.930',
    installment: 'R$ 1.191/mês',
    margem: 'R$ 56',
    contracts: ['Banco PAN', 'Facta', 'C6 Consig'],
    receiptRows: [
      ['0056347710',    'Banco PAN', 'R$ 3.200'],
      ['0123472010087', 'Facta',     'R$ 5.550'],
      ['0057628452',    'C6 Consig', 'R$ 4.180'],
    ],
    receiptCredito: 'R$ 882',
    colors: {
      bg: colors.blueSubtle, border: colors.blueTint, activeBorder: colors.blueBrand,
      activeShadow: '0 10px 30px rgba(35,80,200,.20)',
      iconBg: 'rgba(35,80,200,.12)', eyebrow: colors.blueBrand,
      kipBg: 'rgba(35,80,200,.08)', kpiLabel: '#4a6fa8', kpiValue: colors.blueBrand,
      pillBg: 'rgba(35,80,200,.10)', pillColor: colors.blueBrand, pillDot: colors.blueBrand,
      radioActive: colors.blueBrand,
    },
  },
  {
    key: 'margem',
    eyebrow: 'Cenário 2',
    title: 'Equilíbrio Inteligente',
    desc: 'Um meio-termo entre receber mais dinheiro e preservar sua renda: refinancia apenas parte dos contratos para liberar um bom valor sem levar tudo para o prazo máximo.',
    cash: 'R$ 9.730',
    installment: 'R$ 893/mês',
    margem: 'R$ 120',
    contracts: ['Facta', 'C6 Consig'],
    receiptRows: [
      ['0123472010087', 'Facta',     'R$ 5.550'],
      ['0057628452',    'C6 Consig', 'R$ 4.180'],
    ],
    receiptCredito: 'R$ 1.892',
    colors: {
      bg: colors.greenBg, border: colors.greenMid, activeBorder: colors.greenAccent,
      activeShadow: '0 10px 30px rgba(10,102,64,.18)',
      iconBg: 'rgba(10,102,64,.12)', eyebrow: colors.greenAccent,
      kipBg: 'rgba(10,102,64,.08)', kpiLabel: colors.greenDark, kpiValue: colors.greenDark,
      pillBg: 'rgba(10,102,64,.10)', pillColor: colors.greenDark, pillDot: colors.greenAccent,
      radioActive: colors.greenAccent,
    },
  },
  {
    key: 'parcela',
    eyebrow: 'Cenário 3',
    title: 'Mais Folga no Mês',
    desc: 'Pegue o máximo possível sem comprometer sua renda mensal, priorizando uma parcela que cabe melhor no seu orçamento.',
    cash: 'R$ 5.550',
    installment: 'R$ 381/mês',
    margem: 'R$ 389',
    contracts: ['Facta'],
    receiptRows: [
      ['0123472010087', 'Facta', 'R$ 5.550'],
    ],
    receiptCredito: 'R$ 6.139',
    colors: {
      bg: colors.goldBg, border: colors.goldBorder, activeBorder: colors.goldText,
      activeShadow: '0 10px 30px rgba(122,82,0,.18)',
      iconBg: 'rgba(122,82,0,.12)', eyebrow: colors.goldBtn,
      kipBg: 'rgba(122,82,0,.08)', kpiLabel: colors.goldBtn, kpiValue: colors.goldText,
      pillBg: 'rgba(122,82,0,.10)', pillColor: colors.goldText, pillDot: colors.goldText,
      radioActive: colors.goldText,
    },
  },
]

export const SCENARIO_ICONS = [
  h('svg', { key: 'd', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
    h('path', { d: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', stroke: colors.blueBrand, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
  ),
  h('svg', { key: 'm', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
    h('path', { d: 'M22 12h-4l-3 9L9 3l-3 9H2', stroke: colors.greenAccent, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
  ),
  h('svg', { key: 'p', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
    h('polyline', { points: '23 6 13.5 15.5 8.5 10.5 1 18', stroke: colors.goldBtn, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
    h('polyline', { points: '17 6 23 6 23 12', stroke: colors.goldBtn, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
  ),
]

