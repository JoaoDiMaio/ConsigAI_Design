import { useMemo, useRef, useState } from 'react';
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

const OFERTA = {
  taxaMensal: 1.88,
  creditoMaximo: 8400,
  valorMinimo: 500,
  prazosDisponiveis: [24, 48, 84],
  ancoras: [
    { id: '8400', valorNum: 8400, valor: 'R$ 8.400', prazo: 84, parcelaNum: 158.4, parcela: 'R$ 158,40' },
    { id: '5000', valorNum: 5000, valor: 'R$ 5.000', prazo: 84, parcelaNum: 94.28, parcela: 'R$ 94,28' },
    { id: '2500', valorNum: 2500, valor: 'R$ 2.500', prazo: 84, parcelaNum: 47.14, parcela: 'R$ 47,14' },
  ],
};

const fmt = (n) => Math.round(n).toLocaleString('pt-BR');
const fmtDec = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const calcPMT = (pv, rate, n) => {
  const i = rate / 100;
  return pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
};

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
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Novo Contrato</span>
            </div>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.2 }}>
            Libere crédito novo com prazo e valor ideais
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,.72)', fontWeight: 500, lineHeight: 1.55 }}>
            Mesma lógica do novo contrato, mas com a oferta da direita trocada pela economia da portabilidade.
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

function AnchorMain({ a, selected, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.blue,
        borderRadius: 20,
        padding: '22px 20px 20px',
        cursor: 'pointer',
        border: selected ? '2px solid rgba(255,255,255,.45)' : `2px solid ${t.blue2}`,
        boxShadow: hov ? '0 14px 32px rgba(35,80,200,.36)' : '0 10px 28px rgba(35,80,200,.28)',
        transform: hov ? 'translateY(-2px)' : 'none',
        transition: 'transform .18s ease, box-shadow .18s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 6,
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.15)', borderRadius: 999, padding: '3px 10px 3px 7px' }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#5de89e' }} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.07em', color: '#fff', textTransform: 'uppercase' }}>Recomendado</span>
      </div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: '-.03em', lineHeight: 1 }}>
        <span style={{ fontSize: 17, fontWeight: 600, marginRight: 2 }}>R$ </span>
        {a.valor.replace('R$ ', '')}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.75)', lineHeight: 1 }}>
        {a.prazo}x de <strong style={{ color: '#fff', fontWeight: 700 }}>{a.parcela}</strong>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(93,232,158,.15)', border: '1px solid rgba(93,232,158,.28)', borderRadius: 999, padding: '4px 10px 4px 7px', marginTop: 4 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#5de89e', flexShrink: 0 }} />
        <span style={{ fontSize: 9, fontWeight: 700, color: '#5de89e' }}>✓ Cabe na sua margem</span>
      </div>
    </div>
  );
}

function AnchorCard({ a, selected, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected || hov ? '#dce6fc' : t.blueLight,
        borderRadius: 18,
        border: `2px solid ${selected || hov ? t.blue : t.blueMid}`,
        padding: '16px 14px',
        cursor: 'pointer',
        boxShadow: selected ? '0 4px 16px rgba(35,80,200,.20)' : hov ? '0 6px 16px rgba(35,80,200,.14)' : 'none',
        transform: hov && !selected ? 'translateY(-2px)' : 'none',
        transition: 'all .18s cubic-bezier(.4,0,.2,1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: t.blue, letterSpacing: '-.02em', lineHeight: 1 }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>R$ </span>{a.valor.replace('R$ ', '')}
      </div>
      <div style={{ fontSize: 10, fontWeight: 500, color: '#4a6fa8', lineHeight: 1.3, textAlign: 'center' }}>
        {a.prazo}x de <strong style={{ fontWeight: 700, color: t.blue }}>{a.parcela}</strong>
      </div>
    </div>
  );
}

function PrazoCard({ prazo, selected, parcela, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected ? t.blueLight : hov ? t.blueLight : t.bg,
        border: `2px solid ${selected ? t.blue : hov ? t.blueMid : t.line}`,
        borderRadius: 14,
        padding: '12px 8px',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: selected ? '0 4px 14px rgba(35,80,200,.16)' : 'none',
        transform: hov && !selected ? 'translateY(-1px)' : 'none',
        transition: 'all .18s cubic-bezier(.4,0,.2,1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: selected ? t.blue : t.text, letterSpacing: '-.02em', lineHeight: 1 }}>{prazo}</div>
      <div style={{ fontSize: 9, fontWeight: 600, color: selected ? '#4a6fa8' : t.muted, lineHeight: 1 }}>parcelas</div>
      <div style={{ fontSize: 9.5, fontWeight: selected ? 700 : 600, color: selected ? t.blue : t.muted, lineHeight: 1.2, marginTop: 3 }}>
        {parcela ? `R$ ${fmtDec(parcela)}/mês` : '—'}
      </div>
    </div>
  );
}

function ReceiptEco({ data }) {
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
      <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>{data.receiveNow}</div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8.5, fontWeight: 700, letterSpacing: '.08em', color: '#888', textTransform: 'uppercase' }}>NOVO CONTRATO + PORTABILIDADE</div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Etapa</th>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Resumo</th>
            <th style={{ fontSize: 8, textAlign: 'right', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Impacto</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['1', 'Novo contrato', data.receiveNow],
            ['2', 'Portabilidade', data.economy],
            ['3', 'Margem futura', data.freeMargin],
            ['4', 'Crédito depois', data.futureCredit],
          ].map(([step, summary, value]) => (
            <tr key={step}>
              <td style={{ fontSize: 8, padding: '4px 0', paddingRight: 10, whiteSpace: 'nowrap' }}>{step}</td>
              <td style={{ padding: '4px 0' }}>{summary}</td>
              <td style={{ padding: '4px 0', textAlign: 'right' }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>Economia total estimada</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>{data.economy}</span>
      </div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Parcela do novo contrato</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>{data.installment}</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px dashed #cfcfcf', margin: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Crédito disponível depois</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>até {data.futureCredit}</span>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: '8px 10px', background: '#f0f0ee', borderRadius: 6, border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 8, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>Protocolo</div>
        <div style={{ fontSize: 8.5, color: '#444', fontWeight: 700, fontFamily: 'ui-monospace, monospace', letterSpacing: '.05em' }}>CSG-2026-22061</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 9.5, color: '#7a7a7a', letterSpacing: '.08em' }}>ConsigAI.com.br</div>
    </div>
  );
}

function MiniCard({ variant, name, desc, value }) {
  const isEco = variant === 'eco';
  const colors = isEco
    ? { bg: t.greenBg, border: '#b8e0ca', iconBg: '#c0e8d4', iconStroke: t.green, nameCl: t.green, descCl: t.greenSoft, divider: '#b8e0ca', valueCl: t.green, btnBg: t.green, detailCl: t.greenSoft }
    : { bg: t.goldBg, border: t.goldLine, iconBg: '#fde9a0', iconStroke: '#b07800', nameCl: t.gold, descCl: '#9b7020', divider: t.goldLine, valueCl: t.gold, btnBg: t.goldBtn, detailCl: '#9b7020' };
  const [hov, setHov] = useState(false);

  return (
    <div style={{ borderRadius: 20, border: `1px solid ${colors.border}`, background: colors.bg, overflow: 'hidden', marginBottom: 8 }}>
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: colors.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isEco ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke={colors.iconStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke={colors.iconStroke} strokeWidth="1.5"/><path d="M10 6.5V10.5L12.5 13" stroke={colors.iconStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
  const inputRef = useRef(null);
  const [selectedId, setSelectedId] = useState(OFERTA.ancoras[0].id);
  const [customOpen, setCustomOpen] = useState(false);
  const [customRaw, setCustomRaw] = useState('');
  const [selectedPrazo, setSelectedPrazo] = useState(84);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [hovCta, setHovCta] = useState(false);
  const [hovDetails, setHovDetails] = useState(false);
  const [hovDown, setHovDown] = useState(false);

  const customValue = Number(customRaw);
  const hasCustomValue = customRaw !== '' && !Number.isNaN(customValue);
  const customValid = hasCustomValue && customValue >= OFERTA.valorMinimo && customValue <= OFERTA.creditoMaximo;

  const selectedOffer = useMemo(() => {
    if (customOpen && customValid) {
      const parcelaNum = calcPMT(customValue, OFERTA.taxaMensal, selectedPrazo);
      return {
        id: 'custom',
        valorNum: customValue,
        valor: `R$ ${fmt(customValue)}`,
        prazo: selectedPrazo,
        parcelaNum,
        parcela: `R$ ${fmtDec(parcelaNum)}`,
      };
    }

    return OFERTA.ancoras.find((item) => item.id === selectedId) || OFERTA.ancoras[0];
  }, [customOpen, customValid, customValue, selectedPrazo, selectedId]);

  const portData = useMemo(() => ({
    economy: 'R$ 2.399',
    freeMargin: 'R$ 320',
    futureCredit: 'R$ 5.033',
    cta: `Quero ${selectedOffer.valor} + Economia`,
    receiveNow: selectedOffer.valor,
    installment: `${selectedOffer.prazo}x de ${selectedOffer.parcela}`,
  }), [selectedOffer]);

  const handleGoContratacao = () => {
    navigate('/contratacao', {
      state: {
        sourcePath: '/novo-economia',
        offerTitle: 'Novo Contrato + Economia',
        offerSubtitle: 'Resumo da oferta selecionada antes da contratacao',
        primaryValue: `${portData.receiveNow} + ${portData.economy}`,
        ctaLabel: 'Confirmar Estrategia',
        summary: [
          { label: 'Voce recebe', value: portData.receiveNow },
          { label: 'Economia', value: portData.economy },
          { label: 'Parcela', value: portData.installment },
          { label: 'Margem livre', value: `ate ${portData.freeMargin}` },
          { label: 'Credito futuro', value: `ate ${portData.futureCredit}` },
        ],
      },
    });
  };

  const customFeedback = (() => {
    if (!customOpen) return null;
    if (!customRaw) return { type: 'idle', text: `Digite um valor entre R$ ${fmt(OFERTA.valorMinimo)} e R$ ${fmt(OFERTA.creditoMaximo)}` };
    if (Number.isNaN(customValue)) return { type: 'warn', text: 'Digite apenas números.' };
    if (customValue > OFERTA.creditoMaximo) return { type: 'warn', text: `Máximo disponível é R$ ${fmt(OFERTA.creditoMaximo)}` };
    if (customValue < OFERTA.valorMinimo) return { type: 'warn', text: `Valor mínimo é R$ ${fmt(OFERTA.valorMinimo)}` };
    const parcela = calcPMT(customValue, OFERTA.taxaMensal, selectedPrazo);
    return { type: 'ok', text: `✓ ${selectedPrazo}x de R$ ${fmtDec(parcela)}/mês` };
  })();

  const feedbackColors = customFeedback ? ({
    ok:   { bg: t.greenBg, border: '#b8e0ca', color: t.green, dot: t.greenAccent },
    warn: { bg: '#fff5f5', border: '#ffc5c5', color: '#a02020', dot: '#d94b4b' },
    idle: { bg: t.blueLight, border: t.blueMid, color: '#4a6fa8', dot: t.blue },
  }[customFeedback.type]) : null;

  const handleSelectAnchor = (id) => {
    setSelectedId(id);
    setCustomOpen(false);
    setCustomRaw('');
    setSelectedPrazo(84);
    setDetailsOpen(false);
  };

  const handleCustomToggle = () => {
    if (customOpen) {
      handleSelectAnchor(OFERTA.ancoras[0].id);
      return;
    }
    setCustomOpen(true);
    setSelectedId('custom');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const novoList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '4px 12px 4px 8px', marginBottom: 4, alignSelf: 'flex-start' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Novo Contrato</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: t.muted, marginBottom: 4 }}>Escolha o melhor valor para você</div>

      <AnchorMain a={OFERTA.ancoras[0]} selected={!customOpen && selectedOffer.id === OFERTA.ancoras[0].id} onClick={() => handleSelectAnchor(OFERTA.ancoras[0].id)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {OFERTA.ancoras.slice(1).map((a) => (
          <AnchorCard key={a.id} a={a} selected={!customOpen && selectedOffer.id === a.id} onClick={() => handleSelectAnchor(a.id)} />
        ))}
      </div>

      <div
        onClick={handleCustomToggle}
        style={{
          background: customOpen ? '#dce6fc' : t.blueLight,
          borderRadius: 18,
          border: customOpen ? `2px solid ${t.blue}` : `2px dashed ${t.blueMid}`,
          padding: '16px 14px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all .18s cubic-bezier(.4,0,.2,1)',
          marginTop: 2,
        }}
      >
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: t.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: customOpen ? 'rotate(45deg)' : 'none', transition: 'transform .25s ease' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.blue, lineHeight: 1.2, marginBottom: 3 }}>Quero outro valor</div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#4a6fa8', lineHeight: 1.3 }}>Digite e escolha o prazo ideal</div>
        </div>
      </div>

      {customOpen && (
        <div style={{ background: '#fff', border: `1.5px solid ${t.blueMid}`, borderRadius: 20, padding: 16, marginTop: 2, animation: 'fadeIn .2s ease forwards' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: t.muted, marginBottom: 10 }}>Qual valor você quer?</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: t.bg, border: `1.5px solid ${t.line}`, borderRadius: 12, padding: '10px 14px', marginBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: t.muted, flexShrink: 0 }}>R$</span>
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={customRaw}
              onChange={(e) => { setCustomRaw(e.target.value); setDetailsOpen(false); }}
              style={{
                flex: 1,
                border: 0,
                background: 'transparent',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: t.text,
                outline: 'none',
                letterSpacing: '-.02em',
                minWidth: 0,
              }}
            />
          </div>

          {customFeedback && (
            <div style={{ borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 10, fontWeight: 500, lineHeight: 1.4, marginBottom: 12, background: feedbackColors.bg, border: `1px solid ${feedbackColors.border}`, color: feedbackColors.color }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 3, background: feedbackColors.dot }} />
              <span>{customFeedback.text}</span>
            </div>
          )}

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: t.muted, marginBottom: 8 }}>Escolha o prazo</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {OFERTA.prazosDisponiveis.map((prazo) => {
              const parcela = customValid ? calcPMT(customValue, OFERTA.taxaMensal, prazo) : null;
              return (
                <PrazoCard
                  key={prazo}
                  prazo={prazo}
                  selected={selectedPrazo === prazo}
                  parcela={parcela}
                  onClick={() => { setSelectedPrazo(prazo); setDetailsOpen(false); }}
                />
              );
            })}
          </div>
        </div>
      )}
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
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em', color: t.blue }}>{portData.receiveNow}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9eaccf', fontSize: 20, fontWeight: 600, lineHeight: 1 }}>+</div>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em', color: t.greenAccent, textAlign: 'right' }}>{portData.economy}</div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ borderRadius: 16, padding: '12px 16px', background: t.greenBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textAlign: 'center', minHeight: 132 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', opacity: .7, color: t.green, lineHeight: 1 }}>Sem aumentar o prazo</div>
          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1, color: t.greenSoft }}>Economize até</div>
          <div style={{ lineHeight: 1 }}>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', color: t.green }}>{portData.economy}</span>
          </div>
          <div style={{ fontSize: 8.5, fontWeight: 500, opacity: .75, color: t.greenSoft, lineHeight: 1 }}>complementando o novo contrato com a portabilidade</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div style={{ borderRadius: 14, padding: '8px 10px 7px', background: '#f0f4ff', border: `1px solid ${t.blueMid}`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ fontSize: 8.5, fontWeight: 600, color: '#5572b8', opacity: .72, whiteSpace: 'nowrap', lineHeight: 1 }}>Margem livre de</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.blue, lineHeight: 1, whiteSpace: 'nowrap' }}>até {portData.freeMargin}</div>
          <div style={{ fontSize: 6.7, fontWeight: 500, color: '#5572b8', opacity: .68, lineHeight: 1 }}>após portabilidade</div>
        </div>
        <div style={{ borderRadius: 14, padding: '8px 10px 7px', background: t.navy, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ fontSize: 8.5, fontWeight: 600, color: 'rgba(255,255,255,.60)', whiteSpace: 'nowrap', lineHeight: 1 }}>Crédito disponível de</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1, whiteSpace: 'nowrap' }}>até {portData.futureCredit}</div>
          <div style={{ fontSize: 6.7, fontWeight: 500, color: 'rgba(255,255,255,.55)', lineHeight: 1 }}>depois da estratégia</div>
        </div>
      </div>

      <button
        onClick={handleGoContratacao}
        onMouseEnter={() => setHovCta(true)}
        onMouseLeave={() => setHovCta(false)}
        style={{ width: '100%', border: 0, borderRadius: 14, padding: '15px 14px', marginBottom: 8, background: hovCta ? t.blue2 : t.blue, color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.2, boxShadow: '0 8px 20px rgba(35,80,200,.25)', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease' }}
      >{portData.cta}</button>

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
              {selectedOffer.prazo}x
            </div>
          </div>
          <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 16, padding: 10, display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <ReceiptEco data={portData} />
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
      <MiniCard variant="refin" name="Refinanciamento" desc="Receba dinheiro agora sem aumentar sua parcela atual" value="9.547" />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
        button:focus-visible { outline: 3px solid rgba(35,80,200,.4); outline-offset: 2px; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        .novo-mix-layout { display: grid; grid-template-columns: 1fr 380px; gap: 28px; align-items: start; }
        .novo-mix-right { position: sticky; top: 24px; }
        .novo-mix-bottom { grid-column: 1; }
        @media (max-width: 980px) {
          .novo-mix-layout { grid-template-columns: 1fr; }
          .novo-mix-right { position: static; }
          .novo-mix-bottom { grid-column: auto; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: t.text }}>
        <DesktopHeader />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 40px 56px' }}>
          <div className="novo-mix-layout">
            <div>
              {novoList}
            </div>
            <div className="novo-mix-right">
              {offerCard}
            </div>
            <div className="novo-mix-bottom">
              {otherOptions}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
