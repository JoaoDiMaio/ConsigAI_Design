import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function pickSummaryValue(summary, labels, fallback) {
  if (!Array.isArray(summary)) return fallback
  const lowered = labels.map((l) => l.toLowerCase())
  const found = summary.find((item) => {
    const label = String(item?.label ?? '').toLowerCase()
    return lowered.some((target) => label.includes(target))
  })
  return found?.value ?? fallback
}

export default function Contratacao() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const screenRef = useRef(null)

  const [largeFont, setLargeFont] = useState(false)
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const summary = state?.summary ?? []
  const sourcePath = state?.sourcePath ?? '/ofertas'

  const offerData = useMemo(() => {
    const type = state?.offerTitle ?? 'Portabilidade de consignado'
    const heroValue = pickSummaryValue(summary, ['parcela nova', 'parcela', 'nova parcela'], state?.primaryValue ?? 'R$ 496')
    const savingValue = pickSummaryValue(summary, ['beneficio', 'economia'], 'R$ 2.399')
    const currentInstallment = pickSummaryValue(summary, ['parcela atual'], 'R$ 550')
    const term = pickSummaryValue(summary, ['prazo'], '42 meses')
    const rate = pickSummaryValue(summary, ['taxa'], '1,88% a.m.')

    return {
      type,
      heroValue,
      heroSub: heroValue.includes('/mês') || heroValue.includes('/mes') ? 'alívio mensal' : 'valor principal',
      savingValue,
      currentInstallment,
      term,
      rate,
    }
  }, [state, summary])

  useEffect(() => {
    if (submitted) {
      screenRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [submitted])

  const canSubmit = check1 && check2

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .contratacao-page {
          --scale: 1;
          --font: 'Plus Jakarta Sans', system-ui, sans-serif;
          --navy: #001851;
          --blue: #2350c8;
          --blue-light: #e8eeff;
          --blue-mid: #c2d0f8;
          --text: #0f2057;
          --muted: #7a8db8;
          --line: #e4eaf8;
          --green: #0a6640;
          --green-bg: #e8f5ee;
          --green-accent: #16a364;
          --whatsapp: #25d366;
          --bg-panel: #f4f7fd;
          --shadow-card: 0 8px 28px rgba(0,24,81,.09);
          --r-card: 20px;

          background: var(--bg-panel);
          font-family: var(--font);
          color: var(--text);
          min-height: 100vh;
        }

        .contratacao-page.large-font { --scale: 1.13; }
        .contratacao-page * { box-sizing: border-box; margin: 0; padding: 0; }

        .phone {
          width: 100%;
          max-width: none;
          background: transparent;
          border-radius: 0;
          border: 0;
          box-shadow: none;
          overflow: visible;
        }

        .screen {
          min-height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-behavior: smooth;
          background: var(--bg-panel);
        }

        .screen::-webkit-scrollbar { display: none; }

        .header { background: var(--navy); padding: 18px 20px 0; }
        .fontbar { display: flex; justify-content: flex-end; margin-bottom: 16px; }

        .font-toggle {
          display: flex;
          gap: 2px;
          padding: 3px;
          border-radius: 999px;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
        }

        .font-toggle button {
          border: 0;
          background: transparent;
          color: rgba(255,255,255,.55);
          font: 500 calc(10px * var(--scale))/1 var(--font);
          padding: 6px 10px;
          border-radius: 999px;
          cursor: pointer;
          transition: .15s ease;
        }

        .font-toggle button.active {
          background: rgba(255,255,255,.14);
          color: #fff;
        }

        .header-user {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 10px;
          margin-bottom: 20px;
        }

        .hello { font-size: calc(11px * var(--scale)); color: rgba(255,255,255,.5); margin-bottom: 4px; }
        .name { font-size: calc(18px * var(--scale)); font-weight: 600; color: #fff; line-height: 1.1; }

        .benefit-chip {
          flex-shrink: 0;
          text-align: right;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          padding: 8px 12px;
        }

        .benefit-chip small {
          display: block;
          font-size: calc(9.5px * var(--scale));
          color: rgba(255,255,255,.45);
          margin-bottom: 3px;
        }

        .benefit-chip strong { font-size: calc(15px * var(--scale)); font-weight: 600; color: #fff; }

        .panel { background: var(--bg-panel); border-radius: 26px 26px 0 0; padding: 22px 18px 28px; }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--blue-light);
          border-radius: 999px;
          padding: 3px 10px 3px 7px;
          margin-bottom: 8px;
          white-space: nowrap;
        }

        .tag-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--blue); }
        .tag span { font-size: calc(10px * var(--scale)); font-weight: 700; letter-spacing: .07em; color: var(--blue); }

        .section-title { font-size: calc(20px * var(--scale)); font-weight: 700; color: var(--text); line-height: 1.15; margin-bottom: 4px; }
        .section-sub { font-size: calc(12px * var(--scale)); color: var(--muted); font-weight: 500; margin-bottom: 20px; line-height: 1.4; }

        .offer-summary { background: var(--navy); border-radius: var(--r-card); padding: 16px; margin-bottom: 14px; }
        .offer-label { font-size: calc(10px * var(--scale)); font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: rgba(255,255,255,.4); margin-bottom: 12px; }
        .offer-hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
        .offer-hero-type { font-size: calc(11px * var(--scale)); color: rgba(255,255,255,.5); font-weight: 600; margin-bottom: 4px; }
        .offer-hero-value { font-size: calc(32px * var(--scale)); font-weight: 700; color: #fff; line-height: 1; letter-spacing: -.03em; white-space: nowrap; }
        .offer-hero-sub { font-size: calc(11px * var(--scale)); color: rgba(255,255,255,.45); font-weight: 500; margin-top: 4px; }

        .offer-badge {
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 12px;
          padding: 10px 12px;
          text-align: center;
          flex-shrink: 0;
        }

        .offer-badge-label { font-size: calc(9px * var(--scale)); color: rgba(255,255,255,.4); font-weight: 600; margin-bottom: 4px; }
        .offer-badge-value { font-size: calc(17px * var(--scale)); font-weight: 700; color: #fff; white-space: nowrap; letter-spacing: -.01em; }

        .offer-grid { display: grid; grid-template-columns: 1fr 1px 1fr 1px 1fr; align-items: center; }
        .offer-sep { width: 1px; background: rgba(255,255,255,.1); height: 30px; align-self: center; }
        .offer-item { text-align: center; padding: 0 4px; }
        .offer-item-label { font-size: calc(9.5px * var(--scale)); color: rgba(255,255,255,.4); font-weight: 500; margin-bottom: 3px; line-height: 1.2; }
        .offer-item-value { font-size: calc(13px * var(--scale)); font-weight: 700; color: #fff; line-height: 1; white-space: nowrap; }

        .checklist-card,
        .terms-card,
        .success-info-card {
          background: #fff;
          border-radius: var(--r-card);
          border: 1px solid #e6ecf8;
          box-shadow: var(--shadow-card);
        }

        .checklist-card { padding: 16px; margin-bottom: 14px; }
        .terms-card { padding: 14px 16px; margin-bottom: 14px; }
        .success-info-card { padding: 14px; margin-bottom: 14px; text-align: left; }

        .checklist-label,
        .terms-label,
        .success-info-label {
          font-size: calc(10px * var(--scale));
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 10px;
        }

        .check-item { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--line); }
        .check-item:last-child { border-bottom: 0; padding-bottom: 0; }

        .check-icon { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .check-icon.ok { background: var(--green-bg); }
        .check-icon.pending { background: #f0f4ff; }

        .check-text { flex: 1; }
        .check-title { font-size: calc(12px * var(--scale)); font-weight: 600; color: var(--text); margin-bottom: 1px; line-height: 1.2; }
        .check-sub { font-size: calc(10px * var(--scale)); color: var(--muted); font-weight: 500; }

        .check-status { font-size: calc(10px * var(--scale)); font-weight: 700; border-radius: 999px; padding: 3px 8px; flex-shrink: 0; }
        .check-status.ok { background: var(--green-bg); color: var(--green); }
        .check-status.pending { background: var(--blue-light); color: var(--blue); }

        .terms-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
        .terms-row:last-child { margin-bottom: 0; }

        .checkbox {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 1.5px solid var(--blue-mid);
          background: #fafbfe;
          flex-shrink: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all .15s ease;
          margin-top: 1px;
        }

        .checkbox.checked { background: var(--blue); border-color: var(--blue); }

        .terms-text {
          font-size: calc(11px * var(--scale));
          color: var(--muted);
          font-weight: 500;
          line-height: 1.45;
          cursor: pointer;
        }

        .terms-text a { color: var(--blue); text-decoration: none; font-weight: 600; }

        .whatsapp-card {
          background: #f0fdf5;
          border: 1px solid #b8e8cb;
          border-radius: var(--r-card);
          padding: 16px;
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .wa-top { display: flex; align-items: center; gap: 10px; }

        .wa-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: var(--whatsapp);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(37,211,102,.3);
        }

        .wa-title { font-size: calc(13.5px * var(--scale)); font-weight: 700; color: var(--green); margin-bottom: 2px; }
        .wa-sub { font-size: calc(11px * var(--scale)); color: #3d7a55; font-weight: 500; line-height: 1.35; }

        .wa-steps { display: flex; flex-direction: column; gap: 6px; }
        .wa-step { display: flex; align-items: flex-start; gap: 8px; }

        .wa-step-num {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #c8eeda;
          color: var(--green);
          font-size: calc(9px * var(--scale));
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wa-step-text { font-size: calc(11px * var(--scale)); color: #3d7a55; font-weight: 500; line-height: 1.4; padding-top: 1px; }
        .wa-step-text strong { color: var(--green); font-weight: 700; }

        .wa-phone {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #b8e8cb;
          border-radius: 12px;
          padding: 10px 12px;
        }

        .wa-phone-num { font-size: calc(14px * var(--scale)); font-weight: 700; color: var(--green); flex: 1; letter-spacing: .02em; }
        .wa-phone-tag { font-size: calc(9.5px * var(--scale)); font-weight: 700; background: var(--green-bg); color: var(--green); border-radius: 999px; padding: 3px 8px; }

        .btn { width: 100%; border: 0; border-radius: 14px; font-family: var(--font); cursor: pointer; transition: .15s ease; }
        .btn:active { transform: scale(.98); }

        .btn-primary {
          background: linear-gradient(160deg, #2f59d0 0%, #1d43b0 100%);
          color: #fff;
          padding: 15px 14px;
          font-size: calc(15px * var(--scale));
          font-weight: 600;
          line-height: 1.2;
          box-shadow: 0 8px 20px rgba(30,60,180,.25);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary:hover { filter: brightness(1.06); }
        .btn-primary:disabled { opacity: .45; cursor: not-allowed; transform: none; filter: none; }

        .btn-secondary {
          background: transparent;
          color: var(--muted);
          border: 1.5px solid var(--line);
          padding: 13px;
          font-size: calc(13px * var(--scale));
          font-weight: 500;
        }

        .success-overlay { display: none; text-align: center; padding: 10px 0 20px; }
        .success-overlay.visible { display: block; }

        .confetti-wrap { position: relative; width: 80px; height: 80px; margin: 0 auto 16px; }
        .success-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2350c8 0%, #0a6640 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: popIn .45s cubic-bezier(.34,1.56,.64,1) forwards;
        }

        @keyframes popIn {
          from { transform: scale(.4); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-title { font-size: calc(22px * var(--scale)); font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .success-sub { font-size: calc(12.5px * var(--scale)); color: var(--muted); font-weight: 500; line-height: 1.5; max-width: 250px; margin: 0 auto 22px; }

        .success-wa {
          background: var(--whatsapp);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 14px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 8px 20px rgba(37,211,102,.3);
        }

        .success-wa-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .success-wa-title { font-size: calc(13px * var(--scale)); font-weight: 700; color: #fff; margin-bottom: 3px; }
        .success-wa-sub { font-size: calc(11px * var(--scale)); color: rgba(255,255,255,.8); font-weight: 500; line-height: 1.3; }

        .info-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid var(--line); font-size: calc(12px * var(--scale)); }
        .info-row:last-child { border-bottom: 0; padding-bottom: 0; }
        .info-row-label { color: var(--muted); font-weight: 500; }
        .info-row-value { color: var(--text); font-weight: 600; white-space: nowrap; }

        .spacer { height: 12px; }
      `}</style>

      <div className={`contratacao-page ${largeFont ? 'large-font' : ''}`}>
        <div className="phone">
          <div className="screen" ref={screenRef}>
            <section className="header">
              <div className="fontbar">
                <div className="font-toggle">
                  <button type="button" className={!largeFont ? 'active' : ''} onClick={() => setLargeFont(false)}>
                    Normal
                  </button>
                  <button type="button" className={largeFont ? 'active' : ''} onClick={() => setLargeFont(true)}>
                    A+
                  </button>
                </div>
              </div>

              <div className="header-user">
                <div>
                  <div className="hello">Olá, bem-vindo de volta</div>
                  <div className="name">Carlos Eduardo</div>
                </div>
                <div className="benefit-chip">
                  <small>Benefício mensal</small>
                  <strong>R$ 2.200</strong>
                </div>
              </div>

              <div className="panel">
                <div id="viewReview" style={{ display: submitted ? 'none' : 'block' }}>
                  <div className="tag"><div className="tag-dot" /><span>CONFIRMAÇÃO</span></div>
                  <div className="section-title">Revise sua contratação</div>
                  <div className="section-sub">Confirme os detalhes antes de finalizar</div>

                  <div className="offer-summary">
                    <div className="offer-label">Oferta selecionada</div>
                    <div className="offer-hero">
                      <div>
                        <div className="offer-hero-type">{offerData.type}</div>
                        <div className="offer-hero-value">{offerData.heroValue}</div>
                        <div className="offer-hero-sub">{offerData.heroSub}</div>
                      </div>
                      <div className="offer-badge">
                        <div className="offer-badge-label">Você economiza</div>
                        <div className="offer-badge-value">{offerData.savingValue}</div>
                      </div>
                    </div>
                    <div className="offer-grid">
                      <div className="offer-item">
                        <div className="offer-item-label">Parcela atual</div>
                        <div className="offer-item-value">{offerData.currentInstallment}</div>
                      </div>
                      <div className="offer-sep" />
                      <div className="offer-item">
                        <div className="offer-item-label">Prazo</div>
                        <div className="offer-item-value">{offerData.term}</div>
                      </div>
                      <div className="offer-sep" />
                      <div className="offer-item">
                        <div className="offer-item-label">Taxa</div>
                        <div className="offer-item-value">{offerData.rate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="checklist-card">
                    <div className="checklist-label">Documentos e dados</div>
                    <div className="check-item">
                      <div className="check-icon ok">?</div>
                      <div className="check-text">
                        <div className="check-title">Dados pessoais</div>
                        <div className="check-sub">CPF, data de nascimento, telefone</div>
                      </div>
                      <div className="check-status ok">Confirmado</div>
                    </div>
                    <div className="check-item">
                      <div className="check-icon ok">?</div>
                      <div className="check-text">
                        <div className="check-title">Extrato do INSS</div>
                        <div className="check-sub">extrato_junho_2025.pdf</div>
                      </div>
                      <div className="check-status ok">Enviado</div>
                    </div>
                    <div className="check-item">
                      <div className="check-icon pending">?</div>
                      <div className="check-text">
                        <div className="check-title">Dados bancários</div>
                        <div className="check-sub">Informar após a contratação</div>
                      </div>
                      <div className="check-status pending">Pendente</div>
                    </div>
                  </div>

                  <div className="whatsapp-card">
                    <div className="wa-top">
                      <div className="wa-icon">??</div>
                      <div>
                        <div className="wa-title">Finalizamos pelo WhatsApp</div>
                        <div className="wa-sub">Um consultor entrará em contato para concluir sua contratação</div>
                      </div>
                    </div>
                    <div className="wa-steps">
                      <div className="wa-step"><div className="wa-step-num">1</div><div className="wa-step-text">Você confirma aqui e <strong>enviamos sua solicitação</strong></div></div>
                      <div className="wa-step"><div className="wa-step-num">2</div><div className="wa-step-text">Nosso consultor <strong>entra em contato em até 2h</strong> pelo WhatsApp</div></div>
                      <div className="wa-step"><div className="wa-step-num">3</div><div className="wa-step-text"><strong>Assinatura digital</strong> no próprio WhatsApp</div></div>
                    </div>
                    <div className="wa-phone">
                      <div className="wa-phone-num">(11) 99999-0000</div>
                      <div className="wa-phone-tag">Seu número</div>
                    </div>
                  </div>

                  <div className="terms-card">
                    <div className="terms-label">Aceite necessário</div>
                    <div className="terms-row" onClick={() => setCheck1((v) => !v)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setCheck1((v) => !v)}>
                      <div className={`checkbox ${check1 ? 'checked' : ''}`}>{check1 ? '?' : ''}</div>
                      <div className="terms-text">Li e aceito os <a href="#" onClick={(e) => e.preventDefault()}>Termos de Contratação</a> e a <a href="#" onClick={(e) => e.preventDefault()}>Política de Privacidade</a></div>
                    </div>
                    <div className="terms-row" onClick={() => setCheck2((v) => !v)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setCheck2((v) => !v)}>
                      <div className={`checkbox ${check2 ? 'checked' : ''}`}>{check2 ? '?' : ''}</div>
                      <div className="terms-text">Autorizo a <a href="#" onClick={(e) => e.preventDefault()}>consulta ao meu histórico de crédito</a> para análise da proposta</div>
                    </div>
                  </div>

                  <button className="btn btn-primary" type="button" disabled={!canSubmit} onClick={() => setSubmitted(true)}>
                    Confirmar contratação
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={() => navigate(sourcePath)}>Cancelar</button>
                </div>

                <div id="viewSuccess" className={`success-overlay ${submitted ? 'visible' : ''}`}>
                  <div className="confetti-wrap">
                    <div className="success-circle">?</div>
                  </div>
                  <div className="success-title">Solicitação enviada!</div>
                  <div className="success-sub">Tudo certo. Em breve um consultor entrará em contato pelo seu WhatsApp.</div>

                  <div className="success-wa">
                    <div className="success-wa-icon">??</div>
                    <div>
                      <div className="success-wa-title">Aguarde o contato no WhatsApp</div>
                      <div className="success-wa-sub">(11) 99999-0000 — em até 2 horas úteis</div>
                    </div>
                  </div>

                  <div className="success-info-card">
                    <div className="success-info-label">Resumo da solicitação</div>
                    <div className="info-row"><span className="info-row-label">Tipo</span><span className="info-row-value">{offerData.type}</span></div>
                    <div className="info-row"><span className="info-row-label">Valor principal</span><span className="info-row-value">{offerData.heroValue}</span></div>
                    <div className="info-row"><span className="info-row-label">Economia</span><span className="info-row-value">{offerData.savingValue}</span></div>
                    <div className="info-row"><span className="info-row-label">Protocolo</span><span className="info-row-value">#2026-04892</span></div>
                  </div>

                  <button className="btn btn-primary" type="button" onClick={() => navigate('/ofertas')}>Voltar ao início ?</button>
                </div>

                <div className="spacer" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
