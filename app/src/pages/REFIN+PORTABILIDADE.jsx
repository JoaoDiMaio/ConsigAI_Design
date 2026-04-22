import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const t = {
  navy:        '#001851',
  blue:        '#2350c8',
  blue2:       '#1844b8',
  blueLight:   '#e8eeff',
  blueMid:     '#c2d0f8',
  text:        '#0f2057',
  muted:       '#7a8db8',
  line:        '#e4eaf8',
  green:       '#0a6640',
  greenSoft:   '#3d6b52',
  greenBg:     '#e8f5ee',
  greenAccent: '#16a364',
  gold:        '#7a5200',
  goldBg:      '#fffbf0',
  goldLine:    '#edddb0',
  goldBtn:     '#a87000',
  bg:          '#f4f7fd',
  shadow:      '0 8px 28px rgba(0,24,81,.09)',
};

const SCENARIOS = [
  {
    key: 'margem',
    eyebrow: 'Cenário 1',
    title: 'Máxima margem livre',
    desc: 'Libere mais espaço na margem para contratar um novo empréstimo maior depois',
    cash: 'R$ 9.730',
    installment: 'R$ 893/mês',
    margem: 'R$ 120',
    contracts: ['Facta', 'C6 Consig'],
    receiptRows: [
      ['0123472010087', 'Facta', 'R$ 5.550'],
      ['0057628452', 'C6 Consig', 'R$ 4.180'],
    ],
    receiptCredito: 'R$ 1.892',
    colors: {
      bg: t.greenBg, border: '#b8e0ca', activeBorder: t.greenAccent,
      activeShadow: '0 10px 30px rgba(10,102,64,.18)',
      iconBg: 'rgba(10,102,64,.12)', eyebrow: t.greenAccent,
      kipBg: 'rgba(10,102,64,.08)', kpiLabel: t.greenSoft, kpiValue: t.green,
      pillBg: 'rgba(10,102,64,.10)', pillColor: t.green, pillDot: t.greenAccent,
      radioActive: t.greenAccent,
    },
  },
  {
    key: 'dinheiro',
    eyebrow: 'Cenário 2',
    title: 'Máximo dinheiro',
    desc: 'Receba o maior valor possível refinanciando todos os contratos elegíveis',
    cash: 'R$ 12.930',
    installment: 'R$ 1.191/mês',
    margem: 'R$ 56',
    contracts: ['Banco PAN', 'Facta', 'C6 Consig'],
    receiptRows: [
      ['0056347710', 'Banco PAN', 'R$ 3.200'],
      ['0123472010087', 'Facta', 'R$ 5.550'],
      ['0057628452', 'C6 Consig', 'R$ 4.180'],
    ],
    receiptCredito: 'R$ 882',
    colors: {
      bg: t.blueLight, border: t.blueMid, activeBorder: t.blue,
      activeShadow: '0 10px 30px rgba(35,80,200,.20)',
      iconBg: 'rgba(35,80,200,.12)', eyebrow: t.blue,
      kipBg: 'rgba(35,80,200,.08)', kpiLabel: '#4a6fa8', kpiValue: t.blue,
      pillBg: 'rgba(35,80,200,.10)', pillColor: t.blue, pillDot: t.blue,
      radioActive: t.blue,
    },
  },
  {
    key: 'parcela',
    eyebrow: 'Cenário 3',
    title: 'Menor parcela total',
    desc: 'Reduza ao máximo o comprometimento mensal da sua renda com parcelas',
    cash: 'R$ 5.550',
    installment: 'R$ 381/mês',
    margem: 'R$ 389',
    contracts: ['Facta'],
    receiptRows: [['0123472010087', 'Facta', 'R$ 5.550']],
    receiptCredito: 'R$ 6.139',
    colors: {
      bg: t.goldBg, border: t.goldLine, activeBorder: t.gold,
      activeShadow: '0 10px 30px rgba(122,82,0,.18)',
      iconBg: 'rgba(122,82,0,.12)', eyebrow: t.goldBtn,
      kipBg: 'rgba(122,82,0,.08)', kpiLabel: t.goldBtn, kpiValue: t.gold,
      pillBg: 'rgba(122,82,0,.10)', pillColor: t.gold, pillDot: t.gold,
      radioActive: t.gold,
    },
  },
];

const SCENARIO_ICONS = [
  <svg key="m" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#16a364" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key="d" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#2350c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key="p" width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="#a87000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" stroke="#a87000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
];

function DesktopHeader() {
  const [hovBack, setHovBack] = useState(false);

  return (
    <div style={{ background: t.navy, padding: '28px 40px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>ConsigAI</div>

        <div style={{ flex: 1, maxWidth: 540 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <button
              onMouseEnter={() => setHovBack(true)}
              onMouseLeave={() => setHovBack(false)}
              style={{
                border: 0,
                background: hovBack ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,.08)',
                borderRadius: 8,
                padding: '4px 10px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,.72)',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                transition: 'background .15s ease',
              }}
            >
              ← Ofertas
            </button>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, background: t.blueLight, padding: '4px 12px 4px 8px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Refinanciamento</span>
            </div>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.2 }}>
            Receba dinheiro agora nos seus contratos
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,.72)', fontWeight: 500, lineHeight: 1.55 }}>
            Mesma tela de refin, mas com a oferta da direita trocada pela economia da portabilidade.
          </p>
        </div>

        <div style={{ flexShrink: 0, borderRadius: 14, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', padding: '12px 18px', textAlign: 'right' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em', color: 'rgba(255,255,255,.55)', fontWeight: 600, marginBottom: 4 }}>Cliente</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Carlos Eduardo</div>
        </div>
      </div>
    </div>
  );
}

function ScenarioCard({ scenario, icon, active, onClick }) {
  const c = scenario.colors;
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: '100%',
        textAlign: 'left',
        border: `2px solid ${active ? c.activeBorder : c.border}`,
        borderRadius: 20,
        background: c.bg,
        cursor: 'pointer',
        padding: 0,
        overflow: 'hidden',
        boxShadow: active ? c.activeShadow : 'none',
        transition: 'border-color .2s ease, box-shadow .2s ease',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        outline: 'none',
      }}
    >
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: c.eyebrow, marginBottom: 1 }}>{scenario.eyebrow}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, lineHeight: 1.2, marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scenario.title}</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: t.muted, lineHeight: 1.35 }}>{scenario.desc}</div>
          </div>
          <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: active ? `6px solid ${c.radioActive}` : `2px solid ${t.line}`, background: '#fff', transition: 'all .18s ease' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10 }}>
          {[
            ['Você recebe', scenario.cash],
            ['Nova parcela', scenario.installment],
            ['Margem livre', scenario.margem],
            ['Contratos', scenario.contracts.length + (scenario.contracts.length === 1 ? ' contrato' : ' contratos')],
          ].map(([label, value]) => (
            <div key={label} style={{ borderRadius: 12, padding: '7px 4px', textAlign: 'center', background: c.kipBg, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <div style={{ fontSize: 8.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', lineHeight: 1.2, color: c.kpiLabel }}>{label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, letterSpacing: '-.01em', color: c.kpiValue, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 10, borderTop: '1px solid rgba(0,0,0,.06)' }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: t.muted, marginBottom: 6 }}>Contratos incluídos</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {scenario.contracts.map((bank) => (
              <span key={bank} style={{ borderRadius: 999, padding: '3px 9px', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, background: c.pillBg, color: c.pillColor }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.pillDot, flexShrink: 0, display: 'inline-block' }} />
                {bank}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

function ReceiptEco({ scenario }) {
  return (
    <div style={{ width: 300, flexShrink: 0, borderRadius: 10, padding: '14px 12px 12px', border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3' }}>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, letterSpacing: '.02em', color: '#444' }}>RECIBO DE ESTRATÉGIA CONSIGAI</div>
      <div style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: '#808080' }}>22 de abril de 2026</div>

      <div style={{ fontSize: 10.5, marginTop: 12, fontWeight: 700, color: '#565656' }}>CARLOS EDUARDO MARTINS</div>
      <div style={{ fontSize: 10, marginTop: 6, lineHeight: 1.35, color: '#5f5f5f' }}>
        CPF: 177.665.442-8<br />
        Benefício: Aposentadoria por Tempo de Contribuição<br />
        Nascimento: 30/07/1957<br />
        Valor do Benefício: R$ 2.200
      </div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>VOCÊ RECEBE E AINDA ECONOMIZA</div>
      <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>{scenario.cash}</div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8.5, fontWeight: 700, letterSpacing: '.08em', color: '#888', textTransform: 'uppercase' }}>REFINANCIAMENTO + PORTABILIDADE</div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Cód.</th>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Banco</th>
            <th style={{ fontSize: 8, textAlign: 'right', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Troco</th>
          </tr>
        </thead>
        <tbody>
          {scenario.receiptRows.map(([cod, bank, troco]) => (
            <tr key={cod}>
              <td style={{ fontSize: 8, padding: '4px 0', paddingRight: 10, whiteSpace: 'nowrap' }}>{cod}</td>
              <td style={{ padding: '4px 0' }}>{bank}</td>
              <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 700, color: '#3b3b3b' }}>{troco}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>Economia total estimada</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>R$ 2.399</span>
      </div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Nova parcela total</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>{scenario.installment}</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px dashed #cfcfcf', margin: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Crédito disponível depois</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>até R$ 5.033</span>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: '8px 10px', background: '#f0f0ee', borderRadius: 6, border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 8, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>Protocolo</div>
        <div style={{ fontSize: 8.5, color: '#444', fontWeight: 700, fontFamily: 'ui-monospace, monospace', letterSpacing: '.05em' }}>CSG-2026-22052</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 9.5, color: '#7a7a7a', letterSpacing: '.08em' }}>ConsigAI.com.br</div>
    </div>
  );
}

function MiniCard({ variant, name, desc, value }) {
  const isEco = variant === 'eco';
  const colors = isEco
    ? { bg: t.greenBg, border: '#b8e0ca', iconBg: '#c0e8d4', iconStroke: t.green, nameCl: t.green, descCl: t.greenSoft, divider: '#b8e0ca', valueCl: t.green, btnBg: t.green, detailCl: t.greenSoft }
    : { bg: '#eef4ff', border: '#c0d2f5', iconBg: '#c0d4f8', iconStroke: '#1840a8', nameCl: '#0c3278', descCl: '#4a6fa8', divider: '#c0d2f5', valueCl: '#0c3278', btnBg: '#1840a8', detailCl: '#4a6fa8' };
  const [hov, setHov] = useState(false);

  return (
    <div style={{ borderRadius: 20, border: `1px solid ${colors.border}`, background: colors.bg, overflow: 'hidden', marginBottom: 8 }}>
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: colors.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isEco ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke={colors.iconStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke={colors.iconStroke} strokeWidth="1.5" strokeLinecap="round"/></svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.nameCl, lineHeight: 1.2, marginBottom: 3 }}>{name}</div>
            <div style={{ fontSize: 10.5, fontWeight: 500, color: colors.descCl, lineHeight: 1.35 }}>{desc}</div>
          </div>
        </div>
      </div>
      <div style={{ height: 1, background: colors.divider, margin: '0 14px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, whiteSpace: 'nowrap', color: colors.valueCl }}>
            <span style={{ fontSize: 11, fontWeight: 600 }}>R$</span>
            <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em' }}>{value}</span>
          </div>
          <div style={{ fontSize: 9.5, fontWeight: 500, color: colors.detailCl, marginTop: 2 }}>estimado</div>
        </div>
        <button
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            border: 0,
            borderRadius: 12,
            color: '#fff',
            background: colors.btnBg,
            padding: '11px 16px',
            fontWeight: 600,
            fontSize: 11.5,
            lineHeight: 1.2,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            boxShadow: '0 4px 10px rgba(0,24,81,.10)',
            transform: hov ? 'translateY(-1px) scale(1.02)' : 'none',
            transition: 'transform .18s ease, box-shadow .18s ease, filter .18s ease',
            filter: hov ? 'brightness(1.03)' : 'none',
          }}
        >
          Ver oferta
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function TelaEstrategiaCombinada() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [hovCta, setHovCta] = useState(false);
  const [hovDetails, setHovDetails] = useState(false);
  const [hovDown, setHovDown] = useState(false);

  const scenario = SCENARIOS[activeIdx];

  const handleGoContratacao = () => {
    navigate('/contratacao', {
      state: {
        sourcePath: '/refin-portabilidade',
        offerTitle: 'Refinanciamento + Portabilidade',
        offerSubtitle: 'Resumo da oferta selecionada antes da contratacao',
        primaryValue: `${scenario.cash} + R$ 2.399`,
        ctaLabel: 'Confirmar Estrategia',
        summary: [
          { label: 'Voce recebe', value: scenario.cash },
          { label: 'Economia', value: 'R$ 2.399' },
          { label: 'Nova parcela', value: scenario.installment },
          { label: 'Margem livre', value: scenario.margem },
          { label: 'Contratos', value: String(scenario.contracts.length) },
        ],
      },
    });
  };

  const scenarioList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '4px 12px 4px 8px', marginBottom: 4, alignSelf: 'flex-start' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Refinanciamento por Contrato</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: t.muted, marginBottom: 4 }}>Escolha o melhor cenário para você</div>

      {SCENARIOS.map((s, i) => (
        <ScenarioCard key={s.key} scenario={s} icon={SCENARIO_ICONS[i]} active={activeIdx === i} onClick={() => { setActiveIdx(i); setDetailsOpen(false); }} />
      ))}
    </div>
  );

  const offerCard = (
    <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${t.line}`, boxShadow: t.shadow, padding: 16 }}>
      <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 14, padding: '14px 16px', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr' }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.03em', color: t.muted, textTransform: 'uppercase', lineHeight: 1.25 }}>Você recebe<br />agora</div>
          <div />
          <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.03em', color: t.muted, textTransform: 'uppercase', lineHeight: 1.25, textAlign: 'right' }}>Economia<br />depois</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em', color: t.blue }}>{scenario.cash}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9eaccf', fontSize: 20, fontWeight: 600, lineHeight: 1 }}>+</div>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em', color: t.greenAccent, textAlign: 'right' }}>R$ 2.399</div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ borderRadius: 16, padding: '12px 16px', background: t.greenBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textAlign: 'center', minHeight: 132 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', opacity: .7, color: t.green, lineHeight: 1 }}>Sem aumentar o prazo</div>
          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1, color: t.greenSoft }}>Economize até</div>
          <div style={{ lineHeight: 1 }}>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', color: t.green }}>R$ 2.399</span>
          </div>
          <div style={{ fontSize: 8.5, fontWeight: 500, opacity: .75, color: t.greenSoft, lineHeight: 1 }}>complementando o refinanciamento com a portabilidade</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div style={{ borderRadius: 14, padding: '8px 10px 7px', background: '#f0f4ff', border: `1px solid ${t.blueMid}`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ fontSize: 8.5, fontWeight: 600, color: '#5572b8', opacity: .72, whiteSpace: 'nowrap', lineHeight: 1 }}>Margem livre de</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.blue, lineHeight: 1, whiteSpace: 'nowrap' }}>até R$ 320</div>
          <div style={{ fontSize: 6.7, fontWeight: 500, color: '#5572b8', opacity: .68, lineHeight: 1 }}>após portabilidade</div>
        </div>
        <div style={{ borderRadius: 14, padding: '8px 10px 7px', background: t.navy, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ fontSize: 8.5, fontWeight: 600, color: 'rgba(255,255,255,.60)', whiteSpace: 'nowrap', lineHeight: 1 }}>Crédito disponível de</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1, whiteSpace: 'nowrap' }}>até R$ 5.033</div>
          <div style={{ fontSize: 6.7, fontWeight: 500, color: 'rgba(255,255,255,.55)', lineHeight: 1 }}>depois da estratégia</div>
        </div>
      </div>

      <button
        onClick={handleGoContratacao}
        onMouseEnter={() => setHovCta(true)}
        onMouseLeave={() => setHovCta(false)}
        style={{ width: '100%', border: 0, borderRadius: 14, padding: '15px 14px', marginBottom: 8, background: hovCta ? t.blue2 : t.blue, color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.2, boxShadow: '0 8px 20px rgba(35,80,200,.25)', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease' }}
      >Quero {scenario.cash} + Economia</button>

      <button
        onClick={() => setDetailsOpen((v) => !v)}
        onMouseEnter={() => setHovDetails(true)}
        onMouseLeave={() => setHovDetails(false)}
        style={{ width: '100%', border: `1.5px solid ${t.blueMid}`, borderRadius: 14, padding: 13, background: hovDetails ? '#f0f5ff' : 'transparent', color: t.blue, fontSize: 13.5, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease' }}
        aria-expanded={detailsOpen}
      >
        <span>Ver detalhes da oferta</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: 'transform .25s cubic-bezier(.4,0,.2,1)', transform: detailsOpen ? 'rotate(180deg)' : 'none', display: 'block' }}>
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {detailsOpen && (
        <div style={{ marginTop: 12, animation: 'fadeIn .22s ease forwards' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.10em', textTransform: 'uppercase', color: t.muted, marginBottom: 4 }}>Detalhes da oferta</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Extrato da simulação</div>
            </div>
            <div style={{ borderRadius: 999, background: t.blueLight, border: `1px solid ${t.blueMid}`, padding: '5px 12px', fontSize: 10, fontWeight: 700, color: t.blue, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {scenario.contracts.length} {scenario.contracts.length === 1 ? 'contrato' : 'contratos'}
            </div>
          </div>
          <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 16, padding: 10, display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <ReceiptEco scenario={scenario} />
          </div>
          <button
            onMouseEnter={() => setHovDown(true)}
            onMouseLeave={() => setHovDown(false)}
            style={{ width: '100%', border: `1.5px solid #d2ddfb`, borderRadius: 14, padding: 13, background: hovDown ? '#e6efff' : '#edf3ff', color: t.blue, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease' }}
          >
            <span aria-hidden="true">⬇</span>
            <span>Fazer download da simulação</span>
          </button>
        </div>
      )}

      <p style={{ fontSize: 8, color: t.muted, textAlign: 'right', marginTop: 10, opacity: .68, fontStyle: 'italic', lineHeight: 1.4 }}>
        Valores estimados. Sujeitos à análise e aprovação de crédito.
      </p>
    </div>
  );

  const otherOptions = (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text, flex: 1 }}>Outras opções para você</div>
        <div style={{ fontSize: 10, color: t.muted, fontWeight: 500 }}>2 disponíveis</div>
      </div>
      <MiniCard variant="eco" name="Economia Inteligente" desc="Faça a portabilidade dos seus contratos e economize" value="2.399" />
      <MiniCard variant="novo" name="Novo Empréstimo" desc="Mais dinheiro disponível com pequeno ajuste na parcela" value="2.845" />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
        button:focus-visible { outline: 3px solid rgba(35,80,200,.4); outline-offset: 2px; }
        .refin-mix-layout { display: grid; grid-template-columns: 1fr 380px; gap: 28px; align-items: start; }
        .refin-mix-right { position: sticky; top: 24px; }
        .refin-mix-bottom { grid-column: 1; }
        @media (max-width: 980px) {
          .refin-mix-layout { grid-template-columns: 1fr; }
          .refin-mix-right { position: static; }
          .refin-mix-bottom { grid-column: auto; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: t.text }}>
        <DesktopHeader />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 40px 56px' }}>
          <div className="refin-mix-layout">
            <div>
              {scenarioList}
            </div>
            <div className="refin-mix-right">
              {offerCard}
            </div>
            <div className="refin-mix-bottom">
              {otherOptions}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
