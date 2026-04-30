import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { MiniCard } from '../components/MiniCard'
import { appPageStyle } from '../ui/theme'
import { t } from '../lib/pageTheme'
import { stateData } from '../data/portabilidadeData'
import { parseMoney, fmtDec } from '../lib/formatters'

//  Desktop Header 

//  Choice button 

function ChoiceBtn({ active, onClick, bars, title, sub }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '14px 12px 12px', borderRadius: 16,
        background: active ? t.blue : '#eaeff8',
        border: active ? `1.5px solid ${t.blue2}` : '1.5px solid transparent',
        boxShadow: active ? '0 8px 24px rgba(35,80,200,.28)' : 'none',
        transform: active ? 'translateY(-1px)' : 'none',
        cursor: 'pointer', transition: 'all .22s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        textAlign: 'center', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 14, justifyContent: 'center' }}>
        {bars.map((h, i) => (
          <span key={i} style={{ width: 9, borderRadius: 3, background: active ? '#fff' : t.blue, opacity: active ? 1 : .35, height: h, transition: '.22s ease', display: 'block' }} />
        ))}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: active ? '#fff' : t.text, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 10, fontWeight: 500, color: active ? 'rgba(255,255,255,.68)' : t.muted, lineHeight: 1.2 }}>{sub}</div>
    </button>
  )
}

//  Receipt 

function ReceiptEco() {
  return (
    <div style={{
      width: 300, flexShrink: 0, borderRadius: 10, padding: '14px 12px 12px',
      border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3',
    }}>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, letterSpacing: '.02em', color: '#444' }}>RECIBO DE ECONOMIA CONSIGAI</div>
      <div style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: '#808080' }}>19 de abril de 2025</div>

      <div style={{ fontSize: 10.5, marginTop: 12, fontWeight: 700, color: '#565656' }}>CARLOS EDUARDO MARTINS</div>
      <div style={{ fontSize: 10, marginTop: 6, lineHeight: 1.35, color: '#5f5f5f' }}>
        CPF: 177.665.442-8<br />
        Benefício: Aposentadoria por Tempo de Contribuição<br />
        Nascimento: 30/07/1957<br />
        Valor do Benefício: R$ 2.200
      </div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>PARABENS! VOCE ECONOMIZOU</div>
      <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>R$ 2.399</div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8.5, fontWeight: 700, letterSpacing: '.08em', color: '#888', textTransform: 'uppercase' }}>SEM AUMENTAR O PRAZO</div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Cód.</th>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>De   Para</th>
            <th style={{ fontSize: 8, textAlign: 'right', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Economia</th>
          </tr>
        </thead>
        <tbody>
          {[['0056347710','FACTA   Banrisul','R$ 779,14'],['0123472010087','Bradesco   Banrisul','R$ 550,93'],['0056346924','FACTA   Banrisul','R$ 365,63'],['0057628452','FACTA   Banrisul','R$ 167,50'],['622921912','Itaú Consig.   Banrisul','R$ 0,30']].map(([cod, de, eco]) => (
            <tr key={cod}>
              <td style={{ fontSize: 8, padding: '4px 0', paddingRight: 10, whiteSpace: 'nowrap' }}>{cod}</td>
              <td style={{ padding: '4px 0' }}>{de}</td>
              <td style={{ padding: '4px 0', textAlign: 'right' }}>{eco}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>Economia Total</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>R$ 1.863,50</span>
      </div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Crédito disponível após a liberação da margem</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>até R$ 5.033</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px dashed #cfcfcf', margin: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Margem livre após portabilidade</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>até R$ 320</span>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: '8px 10px', background: '#f0f0ee', borderRadius: 6, border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 8, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>Protocolo</div>
        <div style={{ fontSize: 8.5, color: '#444', fontWeight: 700, fontFamily: 'ui-monospace, monospace', letterSpacing: '.05em' }}>CSG-2025-04871</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 9.5, color: '#7a7a7a', letterSpacing: '.08em' }}>ConsigAI.com.br</div>
    </div>
  )
}

function ReceiptParc() {
  return (
    <div style={{
      width: 300, flexShrink: 0, borderRadius: 10, padding: '14px 12px 12px',
      border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3',
    }}>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, letterSpacing: '.02em', color: '#444' }}>RECIBO DE ECONOMIA CONSIGAI</div>
      <div style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: '#808080' }}>19 de abril de 2025</div>

      <div style={{ fontSize: 10.5, marginTop: 12, fontWeight: 700, color: '#565656' }}>CARLOS EDUARDO MARTINS</div>
      <div style={{ fontSize: 10, marginTop: 6, lineHeight: 1.35, color: '#5f5f5f' }}>
        CPF: 177.665.442-8<br />
        Benefício: Aposentadoria por Tempo de Contribuição<br />
        Nascimento: 30/07/1957<br />
        Valor do Benefício: R$ 2.200
      </div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>PARABENS! VOCE ECONOMIZOU</div>
      <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>
        R$ 117<span style={{ fontSize: '55%', fontWeight: 700, verticalAlign: 'middle' }}> /mês</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8.5, fontWeight: 700, letterSpacing: '.08em', color: '#888', textTransform: 'uppercase' }}>ALÍVIO MENSAL</div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Cód.</th>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>De   Para</th>
            <th style={{ fontSize: 8, textAlign: 'right', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Alívio/mês</th>
          </tr>
        </thead>
        <tbody>
          {[['0123472010087','Bradesco   Banrisul','R$ 25,86'],['0056347710','FACTA   Banrisul','R$ 24,85'],['0056346924','FACTA   Banrisul','R$ 12,13'],['0057628452','FACTA   Banrisul','R$ 7,95']].map(([cod, de, alivio]) => (
            <tr key={cod}>
              <td style={{ fontSize: 8, padding: '4px 0', paddingRight: 10, whiteSpace: 'nowrap' }}>{cod}</td>
              <td style={{ padding: '4px 0' }}>{de}</td>
              <td style={{ padding: '4px 0', textAlign: 'right' }}>{alivio}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>Alívio por mês</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>R$ 70,79/mês</span>
      </div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Margem livre após portabilidade</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>até R$ 480</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px dashed #cfcfcf', margin: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Crédito disponível após a liberação da margem</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>até R$ 7.593</span>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: '8px 10px', background: '#f0f0ee', borderRadius: 6, border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 8, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>Protocolo</div>
        <div style={{ fontSize: 8.5, color: '#444', fontWeight: 700, fontFamily: 'ui-monospace, monospace', letterSpacing: '.05em' }}>CSG-2025-04871</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 9.5, color: '#7a7a7a', letterSpacing: '.08em' }}>ConsigAI.com.br</div>
    </div>
  )
}

//  Main

export default function Portabilidade() {
  const navigate    = useNavigate()
  const isDesktop   = useMediaQuery('(min-width: 768px)')
  const clientName  = 'Carlos Eduardo'
  const [mode, setMode]           = useState('eco')
  const [detailsOpen, setDetails] = useState(false)
  const [hovCta, setHovCta]       = useState(false)
  const [hovDetails, setHovDetails] = useState(false)
  const [hovDown, setHovDown]     = useState(false)
  const [backHover, setBackHover] = useState(false)

  const d = stateData[mode]

  const isEco = mode === 'eco'
  const stateColors = isEco
    ? { bg: t.greenBg, eyebrow: t.green, headline: t.greenSoft, big: t.green, subhead: t.greenSoft }
    : { bg: '#ebf0ff', eyebrow: t.blue, headline: '#2a4a8a', big: t.blue, subhead: '#2a4a8a' }
  const salarioBase = 2200
  const parcelaAntes = 550

  const parcelaDepois = parseMoney(d.newInstallment)
  const liquidoAntes = salarioBase - parcelaAntes
  const liquidoDepois = salarioBase - parcelaDepois

  const handleGoContratacao = () => {
    const benefit = `${d.headlineValue}${d.headlineSuffix ? ` ${d.headlineSuffix}` : ''}`
    navigate('/dados-bancarios', {
      state: {
        sourcePath: '/portabilidade',
        nextPath: '/contratacao',
        offerState: {
          sourcePath: '/portabilidade',
          offerTitle: 'Portabilidade',
          offerSubtitle: 'Resumo da oferta selecionada antes da contratacao',
          primaryValue: benefit,
          ctaLabel: 'Confirmar Portabilidade',
          summary: [
            { label: 'Estrategia', value: mode === 'eco' ? 'Economizar agora' : 'Parcela menor' },
            { label: 'Parcela nova', value: d.newInstallment },
            { label: 'Beneficio', value: benefit },
            { label: 'Margem livre', value: `ate ${d.margin}` },
            { label: 'Credito futuro', value: `ate ${d.credit}` },
          ],
        },
      },
    })
  }

  const content = (
    <div style={{ maxWidth: isDesktop ? 760 : undefined }}>
      {/* Tag */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '4px 12px 4px 8px', marginBottom: 20 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Portabilidade</span>
      </div>

      {/* Choices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
        <ChoiceBtn
          active={isEco}
          onClick={() => setMode('eco')}
          bars={[14, 11, 8, 6, 4]}
          title={'Quero\nEconomizar'}
          sub={'Diminuir Minha\nDívida'}
        />
        <ChoiceBtn
          active={!isEco}
          onClick={() => setMode('parc')}
          bars={[8, 8, 8, 8, 8]}
          title={'Parcela\nMenor'}
          sub={'Mais Alívio\nNo Mês'}
        />
      </div>

      {/* Offer card */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e6ecf8', boxShadow: t.shadow, padding: 16, marginBottom: 22 }}>

        {/* Compare */}
        <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 14, padding: '14px 16px', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr' }}>
            <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.03em', color: t.muted, textTransform: 'uppercase', lineHeight: 1.25 }}>Parcela<br />Atual</div>
            <div />
            <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.03em', color: t.muted, textTransform: 'uppercase', lineHeight: 1.25, textAlign: 'right' }}>Parcela<br />Nova</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr', alignItems: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em', color: t.danger, textDecoration: 'line-through', textDecorationColor: 'rgba(217,75,75,.55)' }}>R$&nbsp;550</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9eaccf', fontSize: 20, fontWeight: 600, lineHeight: 1 }}> </div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em', color: t.greenAccent, textAlign: 'right' }}>{d.newInstallment}</div>
          </div>
        </div>

        {/* State shell */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ borderRadius: 16, padding: '12px 16px', background: stateColors.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textAlign: 'center', minHeight: 132 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', opacity: .7, color: stateColors.eyebrow, lineHeight: 1 }}>{d.eyebrow}</div>
            <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1, color: stateColors.headline }}>{d.headlinePrefix}</div>
            <div style={{ lineHeight: 1 }}>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', color: stateColors.big }}>{d.headlineValue}</span>
              {d.headlineSuffix && <span style={{ fontSize: 13, fontWeight: 600, verticalAlign: 'middle', marginLeft: 4, color: stateColors.big }}>{d.headlineSuffix}</span>}
            </div>
            <div style={{ fontSize: 8.5, fontWeight: 500, opacity: .75, color: stateColors.subhead, lineHeight: 1 }}>{d.subhead}</div>
          </div>
        </div>

        {/* Info row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <div style={{ borderRadius: 14, padding: '8px 10px 7px', background: '#f0f4ff', border: `1px solid ${t.blueMid}`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontSize: 8.5, fontWeight: 600, color: '#5572b8', opacity: .72, whiteSpace: 'nowrap', lineHeight: 1 }}>Margem livre de</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.blue, lineHeight: 1, whiteSpace: 'nowrap' }}>até {d.margin}</div>
            <div style={{ fontSize: 6.7, fontWeight: 500, color: '#5572b8', opacity: .68, lineHeight: 1 }}>após portabilidade</div>
          </div>
          <div style={{ borderRadius: 14, padding: '8px 10px 7px', background: t.navy, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontSize: 8.5, fontWeight: 600, color: 'rgba(255,255,255,.60)', whiteSpace: 'nowrap', lineHeight: 1 }}>Crédito disponível de</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1, whiteSpace: 'nowrap' }}>até {d.credit}</div>
            <div style={{ fontSize: 6.7, fontWeight: 500, color: 'rgba(255,255,255,.55)', lineHeight: 1 }}>após a Liberação da Margem</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleGoContratacao}
          onMouseEnter={() => setHovCta(true)}
          onMouseLeave={() => setHovCta(false)}
          style={{
            width: '100%', border: 0, borderRadius: 14, padding: '15px 14px', marginBottom: 8,
            background: hovCta ? t.blue2 : t.blue, color: '#fff', fontSize: 15, fontWeight: 600,
            lineHeight: 1.2, boxShadow: '0 8px 20px rgba(35,80,200,.25)', cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease',
          }}
        >{d.cta}</button>

        {/* Toggle details */}
        <button
          type="button"
          onClick={() => setDetails(v => !v)}
          onMouseEnter={() => setHovDetails(true)}
          onMouseLeave={() => setHovDetails(false)}
          style={{
            width: '100%', border: `1.5px solid ${t.blueMid}`, borderRadius: 14, padding: 13,
            color: t.blue, fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease',
            background: hovDetails ? '#f0f5ff' : 'transparent',
          }}
          aria-expanded={detailsOpen}
        >
          <span>Ver detalhes da oferta</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: 'transform .25s cubic-bezier(.4,0,.2,1)', transform: detailsOpen ? 'rotate(180deg)' : 'none', display: 'block' }}>
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Details */}
        {detailsOpen && (
          <div style={{ marginTop: 10, animation: 'fadeIn .22s ease forwards' }}>
            <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 16, padding: 10, display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              {isEco ? <ReceiptEco /> : <ReceiptParc />}
            </div>
            <button
              type="button"
              onMouseEnter={() => setHovDown(true)}
              onMouseLeave={() => setHovDown(false)}
              style={{
                width: '100%', border: `1.5px solid #d2ddfb`, borderRadius: 14, padding: 13,
                background: hovDown ? '#e6efff' : '#edf3ff', color: t.blue, fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                transition: 'background .15s ease',
              }}
              onClick={() => window.print()}
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 11h10M8 3v8M5 8l3 3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Fazer download da oferta</span>
            </button>
          </div>
        )}

        <p style={{ fontSize: 8, color: t.muted, textAlign: 'right', marginTop: 10, opacity: .68, fontStyle: 'italic', lineHeight: 1.4 }}>
          Valores estimados. Sujeitos à análise e aprovação de crédito.
        </p>
      </div>

      {/* Other options */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingTop: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, flex: 1 }}>Outras opções para comparar</div>
          <div style={{ fontSize: 10, color: t.muted, fontWeight: 500 }}>2 disponíveis</div>
        </div>
        <MiniCard variant="refin" name="Refinanciamento" desc="Receba dinheiro agora sem aumentar sua parcela atual" value="9.547" detail="estimado para receber" onNav={() => navigate('/refinanciamento')} />
        <MiniCard variant="novo"  name="Novo Empréstimo"  desc="Mais dinheiro disponível com pequeno ajuste na parcela" value="2.845" detail="estimado disponível" onNav={() => navigate('/novo-contrato')} />
      </div>
    </div>
  )

  const summarySidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${t.line}`, boxShadow: t.shadow, padding: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: t.muted, marginBottom: 10 }}>
          Resumo da oferta
        </div>
        {[
          ['Estratégia', mode === 'eco' ? 'Economia inteligente' : 'Parcela menor'],
          ['Parcela nova', d.newInstallment],
          ['Benefício', `${d.headlineValue}${d.headlineSuffix ? ` ${d.headlineSuffix}` : ''}`],
          ['Margem livre', `até ${d.margin}`],
          ['Crédito futuro', `até ${d.credit}`],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '7px 0', borderBottom: `1px solid ${t.line}` }}>
            <span style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>{label}</span>
            <strong style={{ fontSize: 11.5, color: t.text, fontWeight: 700, textAlign: 'right' }}>{value}</strong>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${t.line}`, boxShadow: t.shadow, padding: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: t.muted, marginBottom: 10 }}>
          Salário líquido
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ borderRadius: 12, border: `1px solid ${t.line}`, background: '#f7f9ff', padding: 10 }}>
            <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '.06em', color: t.muted, fontWeight: 700, marginBottom: 5 }}>Antes</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.text, lineHeight: 1.1 }}>{fmtDec(liquidoAntes)}</div>
            <div style={{ fontSize: 10, color: t.muted, marginTop: 5, lineHeight: 1.35 }}>Com parcela de {fmtDec(parcelaAntes)}</div>
          </div>
          <div style={{ borderRadius: 12, border: '1px solid #b8e0ca', background: '#eefaf3', padding: 10 }}>
            <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '.06em', color: t.green, fontWeight: 700, marginBottom: 5 }}>Depois</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.green, lineHeight: 1.1 }}>{fmtDec(liquidoDepois)}</div>
            <div style={{ fontSize: 10, color: t.greenSoft, marginTop: 5, lineHeight: 1.35 }}>Com parcela de {fmtDec(parcelaDepois)}</div>
          </div>
        </div>
      </div>
    </div>
  )

  const bottomBack = (
    <div style={{ marginTop: isDesktop ? 24 : 18 }}>
      <button
        onClick={() => navigate('/ofertas')}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        style={{
          width: '100%',
          border: `1.5px solid ${t.blueMid}`,
          borderRadius: 14,
          padding: isDesktop ? '14px 16px' : '13px 14px',
          background: backHover ? '#f0f5ff' : '#fff',
          color: t.blue,
          fontSize: isDesktop ? 14 : 13.5,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          transition: 'background .15s ease',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Voltar para ofertas
        </span>
      </button>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <>
            <DesktopPageHeader
              clientName={clientName}
              chipLabel="Portabilidade"
              title="Reduza juros e recupere espaco no orcamento"
              subtitle="Transfira seus contratos para taxa menor e escolha entre economizar mais ou aliviar a parcela."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 56px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 24, alignItems: 'start' }}>
                <div>
                  {content}
                  {bottomBack}
                </div>
                <div style={{ position: 'sticky', top: 24 }}>
                  {summarySidebar}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <MobilePageHeader
              clientName={clientName}
              chipLabel="Portabilidade"
              title="Reduza juros e recupere espaco no orcamento"
              subtitle="Transfira seus contratos para taxa menor e escolha entre economizar mais ou aliviar a parcela."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: 0, padding: '20px 18px calc(24px + env(safe-area-inset-bottom))' }}>
              {content}
              {bottomBack}
            </div>
          </>
        )}
      </div>
    </>
  )
}



