import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingBrandHeader from '../components/onboarding/OnboardingBrandHeader'
import { appFontFamily, onboardingAliasVarsCss } from '../ui/theme'

const TOTAL_TIME = 10000
const STEP_THRESHOLDS = [0, 2500, 5000, 7500]

const INSIGHTS = [
  {
    number: '1',
    title: 'Comparamos cenários',
    copy: 'Avaliamos economia, parcela, prazo e crédito disponível.',
  },
  {
    number: '2',
    title: 'Organizamos as melhores opções',
    copy: 'Você verá a recomendação com valores e condições principais.',
  },
  {
    number: '3',
    title: 'Você decide no final',
    copy: 'Nenhuma contratação acontece sem sua confirmação.',
  },
]

const STEPS = [
  'Lendo seus dados com segurança',
  'Comparando contratos disponíveis',
  'Calculando economia e impacto no bolso',
  'Organizando suas melhores opções',
]

function renderInsightIcon(number) {
  if (number === '1') {
    return (
      <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="consigaiLoadingOneGradient" x1="28" y1="18" x2="66" y2="78" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00E7FF" />
            <stop offset="0.45" stopColor="#1DA1EB" />
            <stop offset="1" stopColor="#055ECE" />
          </linearGradient>
        </defs>
        <path
          d="M51 18 C52.8 18 54.2 19.4 54.2 21.2 V75 C54.2 76.8 52.8 78.2 51 78.2 H43.8 C42 78.2 40.6 76.8 40.6 75 V33.8 L33.6 38.2 C32 39.2 30 38.7 29.1 37.1 L25.9 31.8 C25 30.3 25.5 28.3 27.1 27.4 L42.5 18.6 C43.1 18.2 43.9 18 44.7 18 H51Z"
          fill="url(#consigaiLoadingOneGradient)"
        />
      </svg>
    )
  }

  if (number === '2') {
    return (
      <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="consigaiLoadingTwoGradient" x1="26" y1="18" x2="70" y2="78" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00E7FF" />
            <stop offset="0.45" stopColor="#1DA1EB" />
            <stop offset="1" stopColor="#055ECE" />
          </linearGradient>
        </defs>
        <path
          d="M27 75 C27 72.8 27.8 70.9 29.3 69.4 L50.8 48.2 C55.4 43.6 57.4 40.5 57.4 36.7 C57.4 32.2 54.1 29.3 49 29.3 C44.1 29.3 40.7 32.1 39.5 36.6 C39 38.5 37.2 39.7 35.3 39.2 L29.1 37.8 C27.1 37.3 25.9 35.3 26.5 33.3 C29.2 23.7 37.6 18 49.4 18 C63.2 18 72.4 25.4 72.4 36.2 C72.4 43.7 68.9 49.4 61.5 56.3 L48.6 68.3 H69.6 C71.6 68.3 73.2 69.9 73.2 71.9 V75 C73.2 77 71.6 78.6 69.6 78.6 H30.6 C28.6 78.6 27 77 27 75Z"
          fill="url(#consigaiLoadingTwoGradient)"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="consigaiLoadingThreeGradient" x1="25" y1="18" x2="72" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00E7FF" />
          <stop offset="0.45" stopColor="#1DA1EB" />
          <stop offset="1" stopColor="#055ECE" />
        </linearGradient>
      </defs>
      <path
        d="M48.6 79 C36.2 79 27.2 73.2 24.4 63.6 C23.8 61.6 25 59.6 27 59.1 L33.4 57.6 C35.2 57.2 37 58.2 37.7 60 C39.2 64.5 42.8 67.2 48.2 67.2 C54.2 67.2 58.2 64.1 58.2 59.2 C58.2 54 54.4 51.3 47.3 51.3 H42.5 C40.6 51.3 39.1 49.8 39.1 47.9 V42.8 C39.1 40.9 40.6 39.4 42.5 39.4 H47.1 C53.5 39.4 56.9 36.8 56.9 32.3 C56.9 28.1 53.5 25.5 48.4 25.5 C43.5 25.5 40.2 27.9 38.8 32 C38.2 33.8 36.4 34.8 34.6 34.4 L28.4 32.9 C26.4 32.4 25.2 30.4 25.9 28.4 C28.9 19.7 37.2 14.5 48.8 14.5 C62.7 14.5 72 21 72 31.5 C72 38.5 68.3 43.8 62.1 46.2 C69.4 48.7 73.4 54.3 73.4 61.8 C73.4 72.4 63.6 79 48.6 79Z"
        fill="url(#consigaiLoadingThreeGradient)"
      />
    </svg>
  )
}

export default function CarregamentoOfertas() {
  const navigate = useNavigate()
  const frameRef = useRef(0)
  const timeoutRefs = useRef([])
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const startedAt = performance.now()

    const tick = (now) => {
      const elapsed = now - startedAt
      const nextProgress = Math.min(100, Math.round((elapsed / TOTAL_TIME) * 100))
      setProgress(nextProgress)

      let nextStep = 0
      STEP_THRESHOLDS.forEach((threshold, index) => {
        if (elapsed >= threshold) nextStep = index
      })
      setActiveStep(nextStep)

      if (elapsed < TOTAL_TIME) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)

    timeoutRefs.current = [
      setTimeout(() => setShowToast(true), 9200),
      setTimeout(() => setIsLeaving(true), 10000),
      setTimeout(() => navigate('/ofertas', { replace: true }), 10600),
    ]

    return () => {
      cancelAnimationFrame(frameRef.current)
      timeoutRefs.current.forEach(clearTimeout)
    }
  }, [navigate])

  return (
    <>
      <style>{`
        :root {
${onboardingAliasVarsCss}
        }

        .offers-loading-root,
        .offers-loading-root * {
          box-sizing: border-box;
        }

        .offers-loading-root {
          min-height: 100dvh;
          font-family: ${appFontFamily};
          color: var(--blue-dark);
          background:
            radial-gradient(circle at 12% 18%, rgba(29, 161, 235, 0.18), transparent 30%),
            radial-gradient(circle at 88% 20%, rgba(4, 59, 139, 0.14), transparent 34%),
            linear-gradient(180deg, #DDF4FF 0%, #EEF8FF 48%, #FFFFFF 100%);
          overflow: hidden;
          transition: opacity 520ms ease, transform 520ms ease;
        }

        .offers-loading-root.is-leaving {
          opacity: 0;
          transform: scale(.985);
        }

        .loading-page {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: 24px 20px;
          position: relative;
          overflow: hidden;
        }

        .loading-page::before {
          content: "";
          position: absolute;
          width: 640px;
          height: 640px;
          left: -280px;
          top: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(29, 161, 235, 0.16), transparent 66%);
          filter: blur(8px);
          opacity: 0.68;
          pointer-events: none;
        }

        .loading-page::after {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          right: -220px;
          bottom: -120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(4, 59, 139, 0.18), rgba(29, 161, 235, 0.10), transparent 68%);
          opacity: 0.72;
          pointer-events: none;
        }

        .loading-shell {
          width: min(1040px, 100%);
          height: 800px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid var(--line);
          box-shadow: var(--shadow);
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        .loading-shell::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 5px;
          background: linear-gradient(90deg, var(--blue-main), var(--logo-blue), var(--green));
          z-index: 3;
        }

        .blue-panel {
          position: relative;
          padding: 38px;
          color: white;
          background:
            radial-gradient(circle at 78% 14%, rgba(0, 231, 255, 0.18), transparent 32%),
            radial-gradient(circle at 12% 90%, rgba(0, 122, 82, 0.16), transparent 28%),
            linear-gradient(145deg, #06184E 0%, #03246F 58%, #055ECE 100%);
          overflow: hidden;
        }

        .blue-panel::before {
          content: "";
          position: absolute;
          width: 360px;
          height: 360px;
          left: -110px;
          top: -110px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 231, 255, 0.18), transparent 66%);
        }

        .blue-panel::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          right: -210px;
          bottom: -180px;
          border-radius: 50%;
          background:
            conic-gradient(
              from 40deg,
              rgba(0, 231, 255, 0.22),
              rgba(29, 161, 235, 0.08),
              rgba(255, 255, 255, 0.08),
              rgba(0, 231, 255, 0.22)
            );
          opacity: 0.82;
        }

        .blue-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: grid;
          align-content: space-between;
          gap: 32px;
        }

        .secure-badge {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #DDE8F6;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .secure-badge::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 12px rgba(0, 231, 255, .9);
        }

        .blue-title {
          margin-top: 24px;
          max-width: 470px;
          color: white;
          font-size: clamp(36px, 4vw, 56px);
          line-height: 1.08;
          font-weight: 950;
          letter-spacing: -0.075em;
        }

        .blue-title span {
          color: var(--green);
        }

        .blue-copy {
          max-width: 450px;
          margin-top: 16px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 15px;
          line-height: 1.5;
          font-weight: 650;
        }

        .insight-stack {
          display: grid;
          gap: 10px;
          max-width: 440px;
        }

        .insight-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, .10);
          border: 1px solid rgba(255, 255, 255, .16);
          backdrop-filter: blur(10px);
        }

        .insight-icon {
          width: 44px;
          height: 44px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          padding: 0;
        }

        .insight-icon svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .insight-card strong {
          display: block;
          color: white;
          font-size: 13px;
          line-height: 1.15;
          font-weight: 950;
        }

        .insight-card span {
          display: block;
          margin-top: 4px;
          color: rgba(255, 255, 255, .72);
          font-size: 12px;
          line-height: 1.35;
          font-weight: 650;
        }

        .right-panel {
          padding: 42px;
          position: relative;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(circle at 92% 8%, rgba(0, 231, 255, 0.08), transparent 36%),
            linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%);
        }

        .analysis-box {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
        }

        .right-title {
          margin-top: 0;
          color: var(--blue-dark);
          font-size: 34px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .right-title span {
          color: var(--green);
        }

        .right-copy {
          margin-top: 12px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.45;
          font-weight: 650;
        }

        .loading-steps {
          display: grid;
          gap: 10px;
          margin-top: 26px;
        }

        .loading-step {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          align-items: center;
          gap: 11px;
          padding: 13px 14px;
          border-radius: 14px;
          background: #F8FBFF;
          border: 1px solid var(--line);
          color: var(--muted);
          box-shadow: none;
        }

        .step-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #E7EEF8;
          border: 1px solid var(--line);
          position: relative;
        }

        .step-dot::after {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #AFC0D8;
        }

        .loading-step.active {
          background: var(--green-soft);
          border-color: var(--green-line);
          color: var(--green);
        }

        .loading-step.active .step-dot {
          background: rgba(255,255,255,.72);
          border-color: var(--green-line);
          box-shadow: 0 0 0 5px rgba(0, 122, 82, 0.09);
        }

        .loading-step.active .step-dot::after {
          background: var(--green);
        }

        .loading-step strong {
          display: block;
          font-size: 12.8px;
          line-height: 1.2;
          font-weight: 900;
        }

        .progress-wrap {
          margin-top: 24px;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: var(--muted);
          font-size: 11px;
          font-weight: 900;
        }

        .progress-track {
          height: 12px;
          border-radius: 999px;
          background: #E7EEF8;
          overflow: hidden;
          border: 1px solid rgba(221, 232, 246, .85);
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--blue-main), var(--logo-blue), var(--cyan), var(--green));
          animation: breathe 1.8s ease-in-out infinite;
        }

        .loading-trust {
          margin-top: 22px;
          padding: 14px 15px;
          border-radius: 21px;
          background:
            radial-gradient(circle at 92% 8%, rgba(0,231,255,.08), transparent 34%),
            #F8FBFF;
          border: 1px solid var(--line);
          color: var(--muted);
          font-size: 12px;
          line-height: 1.35;
          font-weight: 750;
        }

        .loading-trust strong {
          color: var(--blue-dark);
          font-weight: 950;
        }

        .completion-toast {
          position: fixed;
          left: 50%;
          bottom: 28px;
          transform: translate(-50%, 24px);
          z-index: 20;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 999px;
          background: rgba(255, 255, 255, .94);
          border: 1px solid var(--green-line);
          color: var(--green);
          box-shadow: var(--soft-shadow);
          font-size: 13px;
          font-weight: 950;
          opacity: 0;
          pointer-events: none;
          transition: opacity 360ms ease, transform 360ms ease;
          backdrop-filter: blur(12px);
        }

        .completion-toast.is-visible {
          opacity: 1;
          transform: translate(-50%, 0);
        }

        .completion-toast span {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: var(--green-soft);
          border: 1px solid var(--green-line);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(.96); opacity: .55; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes breathe {
          0%, 100% { filter: saturate(1); opacity: .88; }
          50% { filter: saturate(1.25); opacity: 1; }
        }

        @media (max-width: 920px) {
          .offers-loading-root {
            overflow: auto;
          }

          .loading-shell {
            grid-template-columns: 1fr;
            height: auto;
            max-height: none;
          }

          .right-panel {
            order: 1;
            padding: 30px 28px;
          }

          .blue-panel {
            order: 2;
            min-height: 260px;
            padding: 28px;
          }

          .blue-content {
            gap: 22px;
          }

          .blue-copy {
            margin-top: 12px;
          }
        }

        @media (max-width: 560px) {
          .loading-page {
            padding: 12px;
          }

          .loading-shell {
            border-radius: 22px;
          }

          .blue-panel,
          .right-panel {
            padding: 18px;
          }

          .blue-panel {
            min-height: 200px;
            padding-bottom: 16px;
          }

          .blue-title {
            margin-top: 16px;
            font-size: clamp(29px, 8.2vw, 36px);
          }

          .right-title {
            font-size: clamp(27px, 8vw, 32px);
          }

          .loading-steps {
            margin-top: 20px;
            gap: 10px;
          }

          .loading-step {
            border-radius: 14px;
          }

        }
      `}</style>

      <div className={`offers-loading-root${isLeaving ? ' is-leaving' : ''}`}>
        <main className="loading-page">
          <section className="loading-shell" aria-label="Tela de carregamento ConsigAI">
            <aside className="blue-panel">
              <div className="blue-content">
                <div>
                  <div className="secure-badge">Consignado com IA</div>
                  <h1 className="blue-title">
                    Estamos buscando a melhor forma de <span>Economizar</span>
                  </h1>
                  <p className="blue-copy">
                    A inteligência da ConsigAI lê seu extrato, compara cenários e organiza as melhores opções para você decidir com segurança.
                  </p>
                </div>

                <div className="insight-stack">
                  {INSIGHTS.map((item) => (
                    <div key={item.number} className="insight-card">
                      <span className="insight-icon" aria-hidden="true">{renderInsightIcon(item.number)}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.copy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <section className="right-panel">
              <OnboardingBrandHeader
                showStepBadge
                stepLabel="Análise em andamento"
              />
              <div className="analysis-box">

                <h2 className="right-title">
                  Analisando sua <span>Economia</span>
                </h2>
                <p className="right-copy">
                  Estamos preparando uma comparação simples para você entender o impacto antes de avançar.
                </p>

                <div className="loading-steps">
                  {STEPS.map((label, index) => (
                    <div
                      key={label}
                      className={`loading-step${index <= activeStep ? ' active' : ''}`}
                    >
                      <span className="step-dot" />
                      <strong>{label}</strong>
                    </div>
                  ))}
                </div>

                <div className="progress-wrap">
                  <div className="progress-label">
                    <span>Buscando opções para você</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-track" aria-hidden="true">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="loading-trust">
                  <strong>Seus dados são protegidos.</strong> Esta é uma simulação. Nenhuma contratação é feita sem sua confirmação.
                </div>
              </div>
            </section>
          </section>
        </main>

        <div className={`completion-toast${showToast ? ' is-visible' : ''}`}>
          <span>✓</span>
          Análise concluída. Preparando suas ofertas estimadas...
        </div>
      </div>
    </>
  )
}
