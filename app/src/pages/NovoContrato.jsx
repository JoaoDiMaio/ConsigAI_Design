import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle } from '../ui/theme'
import { OFERTA } from '../data/novoContratoData'
import { fmt, fmtDec } from '../lib/formatters'
import { loadProfileData } from '../lib/profileStorage'
import { getSelectableCardStyle } from '../ui/cardSelection'

const calcPMT = (pv, rate, n) => {
  const i = rate / 100
  return pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
}

function Receipt({ offer }) {
  const total = offer.parcela * offer.prazo
  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <div style={{ marginTop: 10, borderRadius: 16, border: '1px solid #DDE8F6', background: '#f7f9fe', padding: 10, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 300, borderRadius: 10, padding: '14px 12px 12px', border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12, background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3' }}>
        <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#444' }}>SIMULAÇÃO DE NOVO CONTRATO - CONSIGAI</div>
        <div style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: '#808080' }}>{today}</div>
        <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
        <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800 }}>VOCÊ PODE RECEBER HOJE</div>
        <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323' }}>R$ {fmt(offer.valor)}</div>
        <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
        <div style={{ display: 'grid', gap: 6, fontSize: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Prazo</span><strong>{offer.prazo} meses</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Parcela</span><strong>R$ {fmtDec(offer.parcela)}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Taxa</span><strong>{OFERTA.taxaMensal.toFixed(2).replace('.', ',')}% a.m.</strong></div>
        </div>
        <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700 }}>Total a pagar</span>
          <strong>R$ {fmtDec(total)}</strong>
        </div>
      </div>
    </div>
  )
}

export default function NovoContrato() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  const [selected, setSelected] = useState(0)
  const [ctaHover, setCtaHover] = useState(false)
  const [secondHover, setSecondHover] = useState(false)
  const [customBtnHover, setCustomBtnHover] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [customRaw, setCustomRaw] = useState('')
  const [selectedPrazo, setSelectedPrazo] = useState(OFERTA.prazosDisponiveis[OFERTA.prazosDisponiveis.length - 1])
  const [showReceipt, setShowReceipt] = useState(false)

  const selectedAnchor = OFERTA.ancoras[selected]
  const customValue = parseFloat(customRaw)
  const customValid = customValue >= OFERTA.valorMinimo && customValue <= OFERTA.creditoMaximo
  const offer = customOpen && customValid
    ? { valor: customValue, prazo: selectedPrazo, parcela: calcPMT(customValue, OFERTA.taxaMensal, selectedPrazo) }
    : selectedAnchor
  const salarioAntes = 2200
  const salarioDepois = salarioAntes - offer.parcela

  const downloadReceiptPdf = () => {
    const total = offer.parcela * offer.prazo
    const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

    const receiptHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Recibo de Simulação - ConsigAI</title>
        <style>
          @page { size: auto; margin: 0; }
          * { box-sizing: border-box; }
          html, body { width: 100%; height: 100%; }
          body { margin: 0; font-family: Arial, sans-serif; color: #4f4f4f; background: #fff; }
          .wrap { width: 100%; min-height: 100%; display: flex; justify-content: center; align-items: flex-start; padding: 24px 24px 48px; }
          .ticket { width: min(760px, 100%); border-radius: 14px; padding: 34px 30px 30px; border: 1px solid #ececec; font-size: 28px; background: linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3; }
          .title { text-align: center; font-size: 28px; font-weight: 800; color: #444; }
          .date { font-size: 20px; margin-top: 8px; text-align: center; color: #808080; }
          .sep { border-top: 2px dashed #cfcfcf; margin: 20px 0; }
          .label { text-align: center; font-size: 22px; font-weight: 800; }
          .value { text-align: center; margin-top: 6px; font-size: 56px; font-weight: 900; color: #232323; }
          .grid { display: grid; gap: 12px; font-size: 22px; }
          .row { display: flex; justify-content: space-between; }
          .total { display: flex; justify-content: space-between; }
          .total span { font-size: 22px; font-weight: 700; }
          .total strong { font-size: 30px; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="ticket">
            <div class="title">SIMULAÇÃO DE NOVO CONTRATO - CONSIGAI</div>
            <div class="date">${today}</div>
            <div class="sep"></div>
            <div class="label">VOCÊ PODE RECEBER HOJE</div>
            <div class="value">R$ ${fmt(offer.valor)}</div>
            <div class="sep"></div>
            <div class="grid">
              <div class="row"><span>Prazo</span><strong>${offer.prazo} meses</strong></div>
              <div class="row"><span>Parcela</span><strong>R$ ${fmtDec(offer.parcela)}</strong></div>
              <div class="row"><span>Taxa</span><strong>${OFERTA.taxaMensal.toFixed(2).replace('.', ',')}% a.m.</strong></div>
            </div>
            <div class="sep"></div>
            <div class="total">
              <span>Total a pagar</span>
              <strong>R$ ${fmtDec(total)}</strong>
            </div>
          </div>
        </div>
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
      </html>
    `

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) return
    printWindow.document.open()
    printWindow.document.write(receiptHtml)
    printWindow.document.close()
  }

  const goContratacao = () => {
    navigate('/dados-bancarios', {
      state: {
        sourcePath: '/novo-contrato',
        nextPath: '/contratacao',
        offerState: {
          sourcePath: '/novo-contrato',
          offerTitle: 'Novo Contrato',
          offerSubtitle: 'Resumo da oferta selecionada antes da contratação',
          primaryValue: `R$ ${fmt(offer.valor)}`,
          ctaLabel: 'Confirmar Novo Contrato',
          summary: [
            { label: 'Você recebe', value: `R$ ${fmt(offer.valor)}` },
            { label: 'Prazo', value: `${offer.prazo}x` },
            { label: 'Parcela', value: `R$ ${fmtDec(offer.parcela)}/mês` },
            { label: 'Taxa', value: `${OFERTA.taxaMensal.toFixed(2).replace('.', ',')}% a.m.` },
          ],
        },
      },
    })
  }

  const AnchorBtn = ({ idx }) => {
    const a = OFERTA.ancoras[idx]
    const active = selected === idx
    const [hovered, setHovered] = useState(false)
    const selectionStyle = getSelectableCardStyle({ selected: active, hovered })
    return (
      <button
        onClick={() => {
          setCustomOpen(false)
          setCustomRaw('')
          setSelected(idx)
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          minHeight: idx === 0 ? 124 : 84,
          borderRadius: idx === 0 ? 30 : 22,
          border: '1px solid',
          background:
            idx === 0
              ? 'radial-gradient(circle at 92% 8%, rgba(0, 231, 255, 0.13), transparent 34%), linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%)'
              : 'radial-gradient(circle at 92% 8%, rgba(29, 161, 235, 0.10), transparent 34%), linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%)',
          padding: idx === 0 ? '18px 16px' : '14px 16px',
          cursor: 'pointer',
          ...selectionStyle,
        }}
      >
        {idx === 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 999, background: 'rgba(0, 231, 255, 0.13)', border: '1px solid rgba(0, 231, 255, 0.34)', color: '#03246F', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.07em' }}>
            Sugestão ConsigAI
          </div>
        )}
        <div style={{ marginTop: idx === 0 ? 10 : 0, color: '#055ECE', fontSize: idx === 0 ? 42 : 26, fontWeight: 950, letterSpacing: idx === 0 ? '-.07em' : '-.04em', lineHeight: 1 }}>
          R$ {fmt(a.valor)}
        </div>
        <div style={{ marginTop: 7, color: '#64748B', fontSize: idx === 0 ? 13 : 12, fontWeight: 750 }}>
          {a.prazo}x de <strong style={{ color: '#055ECE' }}>R$ {fmtDec(a.parcela)}</strong>
        </div>
        {idx === 0 && (
          <div style={{ width: 'fit-content', margin: '10px auto 0', padding: '8px 12px', borderRadius: 999, background: '#E9F8F1', border: '1px solid #BDECD7', color: '#007A52', fontSize: 12, fontWeight: 900 }}>
            Parcela dentro da sua margem
          </div>
        )}
      </button>
    )
  }

  const content = (
    <div>
      <section style={{ marginBottom: 18, padding: isDesktop ? '24px 28px' : '22px 20px', borderRadius: 30, border: '1px solid #DDE8F6', background: 'radial-gradient(circle at 92% 8%, rgba(0, 231, 255, 0.15), transparent 34%), radial-gradient(circle at 10% 100%, rgba(0, 122, 82, 0.07), transparent 34%), linear-gradient(180deg, rgba(255,255,255,.98) 0%, #FFFFFF 100%)', boxShadow: '0 18px 48px rgba(3, 36, 111, 0.08)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 5, background: 'linear-gradient(90deg, #055ECE, #1DA1EB, #00E7FF, #007A52)' }} />
        <div style={{ color: '#055ECE', fontSize: 12, fontWeight: 950, letterSpacing: '.13em', textTransform: 'uppercase' }}>Novo contrato</div>
        <h1 style={{ marginTop: 10, color: '#03246F', fontSize: isDesktop ? 44 : 34, lineHeight: .98, fontWeight: 950, letterSpacing: '-.07em' }}>Escolha quanto quer <span style={{ color: '#007A52' }}>receber</span></h1>
        <p style={{ marginTop: 12, color: '#64748B', fontSize: 15, lineHeight: 1.45, fontWeight: 650 }}>Escolha um valor, veja a parcela e confirme apenas se fizer sentido para você. Nenhuma contratação é feita sem sua confirmação.</p>
      </section>

      <section style={{ marginBottom: 12, padding: isDesktop ? '20px 18px' : '16px 14px', borderRadius: 26, border: '1px solid #DDE8F6', background: '#FFFFFF', boxShadow: '0 18px 46px rgba(3, 36, 111, 0.08)' }}>
        <div style={{ marginBottom: 12 }}><AnchorBtn idx={0} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <AnchorBtn idx={1} />
          <AnchorBtn idx={2} />
        </div>

        <button
          onClick={() => setCustomOpen(v => !v)}
          onMouseEnter={() => setCustomBtnHover(true)}
          onMouseLeave={() => setCustomBtnHover(false)}
          style={{
            width: '100%',
            minHeight: 58,
            marginTop: 6,
            marginBottom: customOpen ? 10 : 14,
            borderRadius: 22,
            border: '1px solid',
            background: 'radial-gradient(circle at 92% 8%, rgba(0, 231, 255, 0.12), transparent 34%), linear-gradient(180deg, #F4FBFF 0%, #FFFFFF 100%)',
            color: '#055ECE',
            fontWeight: 950,
            fontSize: 15,
            cursor: 'pointer',
            ...getSelectableCardStyle({ selected: customOpen, hovered: customBtnHover }),
          }}
        >
          + Personalizar valor e prazo
        </button>
        {customOpen && (
          <div style={{ marginBottom: 14, background: '#fff', border: '1.5px solid #BFD4F6', borderRadius: 20, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 8 }}>Qual valor você quer?</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FBFF', border: '1px solid #DDE8F6', borderRadius: 12, padding: '10px 12px' }}>
              <span style={{ color: '#64748B', fontWeight: 800 }}>R$</span>
              <input
                type="number"
                value={customRaw}
                onChange={(e) => setCustomRaw(e.target.value)}
                placeholder="0"
                style={{ border: 0, outline: 'none', background: 'transparent', width: '100%', fontSize: 22, fontWeight: 900, color: '#03246F' }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: customValid || !customRaw ? '#64748B' : '#b42318' }}>
              {!customRaw && `Digite um valor entre R$ ${fmt(OFERTA.valorMinimo)} e R$ ${fmt(OFERTA.creditoMaximo)}`}
              {customRaw && !customValid && `Valor deve ficar entre R$ ${fmt(OFERTA.valorMinimo)} e R$ ${fmt(OFERTA.creditoMaximo)}`}
              {customRaw && customValid && `${selectedPrazo}x de R$ ${fmtDec(calcPMT(customValue, OFERTA.taxaMensal, selectedPrazo))}/mês`}
            </div>
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {OFERTA.prazosDisponiveis.map((prazo) => {
                const activePrazo = selectedPrazo === prazo
                return (
                  <button
                    key={prazo}
                    onClick={() => setSelectedPrazo(prazo)}
                    style={{ borderRadius: 12, border: `1px solid ${activePrazo ? '#055ECE' : '#DDE8F6'}`, background: activePrazo ? '#EAF2FF' : '#fff', color: activePrazo ? '#055ECE' : '#64748B', padding: '10px 6px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    {prazo}x
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <div style={{ margin: '4px 0 14px', borderTop: '1px solid #DDE8F6' }} />

        <button
          className="consigai-cta-animated"
          onClick={goContratacao}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{ width: '100%', minHeight: 52, border: 0, borderRadius: 18, background: ctaHover ? 'linear-gradient(145deg, #0A66E8, #03246F)' : 'linear-gradient(145deg, #055ECE, #03246F)', color: '#fff', fontSize: 16, fontWeight: 950, boxShadow: ctaHover ? '0 12px 24px rgba(35,80,200,.12)' : '0 8px 20px rgba(30,60,180,.3)', cursor: 'pointer' }}
        >
          Continuar com esta oferta
        </button>

        <button
          className="consigai-cta-animated"
          onClick={() => setShowReceipt(v => !v)}
          onMouseEnter={() => setSecondHover(true)}
          onMouseLeave={() => setSecondHover(false)}
          style={{ width: '100%', minHeight: 48, marginTop: 10, borderRadius: 17, border: '1px solid #BFD4F6', background: secondHover ? '#F4F8FF' : '#fff', color: '#055ECE', fontSize: 15, fontWeight: 900, cursor: 'pointer', boxShadow: secondHover ? '0 12px 24px rgba(35,80,200,.12)' : '0 8px 20px rgba(30,60,180,.12)' }}
        >
          Gerar recibo da simulação
        </button>
        {showReceipt && <Receipt offer={offer} />}
        {showReceipt && (
          <button
            className="consigai-cta-animated"
            onClick={downloadReceiptPdf}
            style={{
              width: '100%',
              minHeight: 46,
              marginTop: 8,
              borderRadius: 14,
              border: 0,
              background: 'linear-gradient(145deg, #055ECE, #03246F)',
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(30,60,180,.3)',
            }}
          >
            Baixar recibo da simulação
          </button>
        )}
        <p style={{ marginTop: 8, color: '#64748B', textAlign: 'center', fontSize: 11, fontWeight: 650 }}>Valores estimados. Sujeitos à análise e aprovação de crédito.</p>
        <button
          className="consigai-cta-animated"
          onClick={() => navigate('/ofertas')}
          style={{
            width: '100%',
            minHeight: 46,
            marginTop: 10,
            borderRadius: 14,
            border: '1px solid #BFD4F6',
            background: '#fff',
            color: '#055ECE',
            fontSize: 14,
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(30,60,180,.12)',
          }}
        >
          Voltar para ofertas
        </button>
      </section>
    </div>
  )

  const sidebar = (
    <aside style={{ display: 'grid', gap: 16 }}>
      <div style={{ padding: 22, borderRadius: 26, background: 'rgba(255,255,255,.98)', border: '1px solid #DDE8F6', boxShadow: '0 18px 46px rgba(3, 36, 111, 0.08)' }}>
        <h3 style={{ color: '#03246F', fontSize: 15, fontWeight: 950, textTransform: 'uppercase' }}>Resumo da oferta</h3>
        <p style={{ marginTop: 5, color: '#64748B', fontSize: 12 }}>Confira as principais condições simuladas.</p>
        <div style={{ marginTop: 12 }}>
          {[
            ['Produto', 'Novo contrato'],
            ['Você recebe', `R$ ${fmt(offer.valor)}`],
            ['Prazo', `${offer.prazo} meses`],
            ['Parcela', `R$ ${fmtDec(offer.parcela)}/mês`],
            ['Taxa', `${OFERTA.taxaMensal.toFixed(2).replace('.', ',')}% a.m.`],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: '1px solid #DDE8F6', fontSize: 13, fontWeight: 800, color: '#64748B' }}>
              <span>{label}</span>
              <strong style={{ color: '#03246F' }}>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 22, borderRadius: 26, background: 'rgba(255,255,255,.98)', border: '1px solid #DDE8F6', boxShadow: '0 18px 46px rgba(3, 36, 111, 0.08)' }}>
        <h3 style={{ color: '#03246F', fontSize: 15, fontWeight: 950, textTransform: 'uppercase' }}>Impacto no bolso</h3>
        <p style={{ marginTop: 5, color: '#64748B', fontSize: 12 }}>Veja quanto sobra depois da nova parcela.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <div style={{ padding: 14, borderRadius: 18, background: '#F8FBFF', border: '1px solid #DDE8F6' }}>
            <small style={{ color: '#64748B', fontSize: 11, fontWeight: 850 }}>Antes</small>
            <strong style={{ display: 'block', marginTop: 7, color: '#03246F', fontSize: 22, fontWeight: 950, whiteSpace: 'nowrap' }}>R$ {fmt(Math.round(salarioAntes))}</strong>
            <span style={{ display: 'block', marginTop: 6, color: '#64748B', fontSize: 10.5 }}>sem esta nova parcela</span>
          </div>
          <div style={{ padding: 14, borderRadius: 18, background: '#E9F8F1', border: '1px solid #BDECD7' }}>
            <small style={{ color: '#64748B', fontSize: 11, fontWeight: 850 }}>Depois</small>
            <strong style={{ display: 'block', marginTop: 7, color: '#007A52', fontSize: 22, fontWeight: 950, whiteSpace: 'nowrap' }}>R$ {fmt(Math.round(salarioDepois))}</strong>
            <span style={{ display: 'block', marginTop: 6, color: '#64748B', fontSize: 10.5 }}>com a parcela estimada</span>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: '13px 14px', borderRadius: 18, background: '#F4F8FF', border: '1px solid #DDE8F6' }}>
          <span style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 850 }}>Nova parcela</span>
          <strong style={{ display: 'block', marginTop: 6, color: '#055ECE', fontSize: 20, fontWeight: 950 }}>R$ {fmtDec(offer.parcela)}/mês</strong>
        </div>
      </div>

      <div style={{ padding: 22, borderRadius: 26, background: '#FFFFFF', border: '1px solid #DDE8F6', boxShadow: '0 18px 46px rgba(3, 36, 111, 0.08)' }}>
        <h3 style={{ color: '#03246F', fontSize: 15, fontWeight: 950, textTransform: 'uppercase' }}>Você está no controle</h3>
        <p style={{ marginTop: 5, color: '#64748B', fontSize: 12 }}>Antes de avançar, a ConsigAI mostra as condições principais para você decidir com calma e clareza.</p>
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          {[
            ['Sem compromisso', 'Esta etapa é apenas uma simulação.'],
            ['Sem contratação automática', 'Nada é enviado sem sua confirmação.'],
            ['Transparência total', 'Você verá taxa, prazo, parcela e custo total.'],
          ].map(([title, text]) => (
            <div key={title} style={{ display: 'flex', gap: 10, padding: '11px 12px', borderRadius: 16, background: '#F4F8FF', border: '1px solid #DDE8F6' }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#E9F8F1', color: '#007A52', border: '1px solid #BDECD7', fontSize: 12, fontWeight: 950 }}>✓</span>
              <div>
                <strong style={{ display: 'block', color: '#03246F', fontSize: 12, fontWeight: 950 }}>{title}</strong>
                <small style={{ display: 'block', marginTop: 3, color: '#64748B', fontSize: 11 }}>{text}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )

  return (
    <>
      <style>{`
        *{box-sizing:border-box}
        .consigai-cta-animated{
          position: relative;
          overflow: hidden;
          transform: translateY(0);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background-position .35s ease, filter .18s ease;
          animation: consigaiDetailsFloat 3.8s ease-in-out infinite;
          background-size: 220% 100%;
          background-position: 0% 0%;
        }
        .consigai-cta-animated:hover{
          background-position: 100% 0%;
          animation-play-state: paused;
          transform: translateY(-2px) scale(1.01) !important;
          filter: saturate(1.05);
        }
        .consigai-cta-animated:active{
          transform: translateY(0) scale(.985);
        }
        .consigai-cta-animated::after{
          content:'';
          position:absolute;
          inset:0;
          background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,.55) 45%, transparent 60%);
          transform: translateX(-120%) skewX(-18deg);
          opacity:0;
          pointer-events:none;
        }
        .consigai-cta-animated:hover::after{
          opacity:1;
          animation: consigaiDetailsShine .9s ease forwards;
        }
        @keyframes consigaiDetailsFloat {
          0%,100%{ transform: translateY(0); }
          50%{ transform: translateY(-1px); }
        }
        @keyframes consigaiDetailsShine {
          0% { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(120%) skewX(-18deg); }
        }
      `}</style>
      <div style={appPageStyle}>
        {isDesktop ? (
          <>
            <DesktopPageHeader
              clientName={clientName}
              chipLabel="Novo Contrato"
              title="Libere crédito novo com equilíbrio para o seu mês"
              subtitle="Simule valor e prazo com clareza para contratar sem apertar o orçamento."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configurações', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <main style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 24px 56px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 30, alignItems: 'start' }}>
                {content}
                <div style={{ position: 'sticky', top: 24 }}>{sidebar}</div>
              </div>
            </main>
          </>
        ) : (
          <>
            <MobilePageHeader
              clientName={clientName}
              chipLabel="Novo Contrato"
              title="Libere crédito novo com equilíbrio para o seu mês"
              subtitle="Simule valor e prazo com clareza para contratar sem apertar o orçamento."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configurações', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <main style={{ padding: '20px 16px 28px' }}>
              {content}
              <div style={{ marginTop: 16 }}>{sidebar}</div>
            </main>
          </>
        )}
      </div>
    </>
  )
}
