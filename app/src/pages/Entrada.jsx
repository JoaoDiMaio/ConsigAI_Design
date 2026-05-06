import { useNavigate } from 'react-router-dom'
import OnboardingBrandHeader from '../components/onboarding/OnboardingBrandHeader'
import { FontSizeToggleFloating } from '../components/FontSizeToggle'
import { appFontFamily, onboardingAliasVarsCss } from '../ui/theme'

export default function Entrada() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        :root {
${onboardingAliasVarsCss}
        }

        .entry-page * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .entry-page {
          box-sizing: border-box;
          min-height: 100dvh;
          position: relative;
          display: grid;
          place-items: center;
          padding: 24px 20px;
          overflow: hidden;
          font-family: ${appFontFamily};
          color: var(--blue-dark);
          background: transparent;
        }

        .entry-page button,
        .entry-page input {
          font-family: inherit;
        }

        .entry-page button {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .brand-top {
          position: absolute;
          top: 28px;
          left: 36px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          z-index: 2;
        }

        .brand-mark {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, var(--blue-main), var(--logo-blue));
          box-shadow: 0 14px 30px rgba(36, 84, 214, 0.24);
          color: white;
          font-size: 22px;
          font-weight: 950;
        }

        .brand-text strong {
          display: block;
          color: var(--blue-dark);
          font-size: 18px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .brand-text span {
          display: block;
          margin-top: 4px;
          color: var(--muted);
          font-size: 11px;
          font-weight: 800;
        }

        .entry-card {
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
          isolation: isolate;
        }

        .entry-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 5px;
          background: linear-gradient(90deg, var(--blue-main), var(--logo-blue), var(--green));
          z-index: 3;
        }

        .visual-panel {
          position: relative;
          padding: 38px;
          color: white;
          background:
            radial-gradient(circle at 78% 14%, rgba(0, 231, 255, 0.18), transparent 32%),
            radial-gradient(circle at 12% 90%, rgba(0, 122, 82, 0.16), transparent 28%),
            linear-gradient(145deg, #06184E 0%, #03246F 58%, #055ECE 100%);
          overflow: hidden;
        }

        .visual-panel::before {
          content: "";
          position: absolute;
          width: 360px;
          height: 360px;
          left: -110px;
          top: -110px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 231, 255, 0.18), transparent 66%);
        }

        .visual-panel::after {
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

        .visual-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: grid;
          align-content: space-between;
          gap: 32px;
        }

        .visual-kicker {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: var(--line);
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .visual-kicker::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 12px rgba(0, 231, 255, 0.85);
        }

        .visual-title {
          margin-top: 24px;
          max-width: 470px;
          color: white;
          font-size: clamp(36px, 4vw, 56px);
          line-height: 1.08;
          font-weight: 950;
          letter-spacing: -0.075em;
        }

        .visual-title span {
          color: var(--green);
        }

        .visual-copy {
          max-width: 450px;
          margin-top: 16px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 15px;
          line-height: 1.5;
          font-weight: 650;
        }

        .bottom-section {
          display: grid;
          gap: 28px;
        }

        .coverage-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          max-width: 440px;
          width: 100%;
        }

        .coverage-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }

        .coverage-badges {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .coverage-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(8px);
          font-size: 13px;
          font-weight: 900;
          color: white;
          letter-spacing: 0.01em;
          width: 100%;
        }

        .coverage-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex: 0 0 auto;
        }

        .coverage-badge-dot.inss {
          background: var(--cyan);
          box-shadow: 0 0 8px rgba(0,231,255,0.7);
        }

        .coverage-badge-dot.siape {
          background: #7BDFB0;
          box-shadow: 0 0 8px rgba(0,200,130,0.6);
        }

        .coverage-badge-sub {
          margin-left: auto;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.04em;
        }

        .benefit-stack {
          display: grid;
          gap: 10px;
          max-width: 440px;
        }

        .benefit-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(10px);
        }

        .benefit-row > div {
          display: grid;
          align-content: center;
        }

        .benefit-icon {
          width: 44px;
          height: 44px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          padding: 0;
        }

        .benefit-icon svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .benefit-row strong {
          display: block;
          color: white;
          font-size: 12px;
          line-height: 1.15;
          font-weight: 950;
        }

        .benefit-row span {
          display: block;
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 11px;
          line-height: 1.35;
          font-weight: 650;
        }

        .benefit-row.lgpd-row {
          margin-top: 0;
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        .form-panel {
          padding: 42px;
          position: relative;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(circle at 92% 8%, rgba(0, 231, 255, 0.08), transparent 36%),
            linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%);
        }

        .login-box {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
        }

        .login-kicker {
          color: var(--blue-main);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .login-title {
          margin-top: 8px;
          color: var(--blue-dark);
          font-size: 34px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .login-title span {
          color: var(--green);
        }

        .login-copy {
          margin-top: 12px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.45;
          font-weight: 650;
        }

        .quick-access {
          display: grid;
          gap: 12px;
          margin-top: 26px;
        }

        .input-field {
          min-height: 54px;
          width: 100%;
          padding: 0 16px;
          border-radius: 21px;
          border: 1px solid var(--line);
          background: #F8FBFF;
          color: var(--blue-dark);
          font-size: 14px;
          font-weight: 750;
          outline: none;
          transition: 160ms ease;
        }

        .input-field::placeholder {
          color: var(--muted-soft);
        }

        .input-field:focus {
          border-color: var(--logo-blue);
          background: white;
          box-shadow: 0 0 0 4px rgba(29, 161, 235, 0.12);
        }

        .primary-cta {
          width: 100%;
          min-height: 56px;
          border: 0;
          border-radius: 21px;
          background: linear-gradient(145deg, var(--blue-main), var(--blue-dark));
          color: white;
          font-size: 15px;
          font-weight: 950;
          box-shadow: none;
        }

        .secondary-cta {
          width: 100%;
          min-height: 54px;
          border-radius: 21px;
          border: 1px solid var(--line);
          background: transparent;
          color: var(--blue-main);
          font-size: 15px;
          font-weight: 950;
        }

        .primary-cta:focus-visible,
        .secondary-cta:focus-visible,
        .register-note a:focus-visible,
        .forgot-row a:focus-visible {
          outline: 3px solid rgba(29, 161, 235, 0.35);
          outline-offset: 2px;
        }

        .consigai-cta-animated {
          position: relative;
          overflow: hidden;
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, filter .16s ease;
          cursor: pointer;
        }

        .consigai-cta-animated:hover {
          transform: translateY(-1px) !important;
          filter: none;
        }

        .consigai-cta-animated:active {
          transform: translateY(0);
        }

        @keyframes mobileCtaSelect {
          0% { transform: translateY(0) scale(1); }
          45% { transform: translateY(2px) scale(0.982); }
          100% { transform: translateY(0) scale(1); }
        }

        .forgot-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-top: 14px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 750;
        }

        .forgot-row a {
          color: var(--blue-main);
          text-decoration: none;
          font-weight: 900;
        }

        .register-note {
          margin-top: 22px;
          text-align: center;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.4;
          font-weight: 650;
        }

        .register-note a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 14px;
          background: transparent;
          color: var(--blue-main);
          border: 1px solid var(--line-strong);
          font-weight: 900;
          text-decoration: none;
          box-shadow: none;
        }

        @media (max-width: 920px) {
          html,
          body {
            overflow: hidden;
            height: 100dvh;
          }

          .brand-top {
            position: relative;
            top: auto;
            left: auto;
            margin-bottom: 18px;
            align-self: start;
          }

          .entry-page {
            place-items: start center;
          }

          .entry-card {
            grid-template-columns: 1fr;
            height: auto;
            max-height: calc(100dvh - 24px);
          }

          .form-panel {
            order: 1;
            padding: 30px 28px;
          }

          .visual-panel {
            order: 2;
            min-height: 260px;
            padding: 28px;
          }

          .visual-content {
            gap: 22px;
          }

          .visual-copy {
            margin-top: 12px;
          }

          .benefit-stack {
            gap: 8px;
          }

          .consigai-cta-animated,
          .consigai-cta-animated:hover,
          .consigai-cta-animated:active,
          .consigai-cta-animated:hover::after {
            animation: none !important;
            transform: none !important;
            filter: none !important;
          }
        }

        @media (max-width: 560px) {
          .entry-page {
            padding: 12px;
          }

          .entry-card {
            border-radius: 22px;
          }

          .visual-panel,
          .form-panel {
            padding: 18px;
          }

          .visual-panel {
            min-height: 200px;
            padding-bottom: 16px;
          }

          .visual-content {
            gap: 14px;
          }

          .visual-kicker {
            display: none;
          }

          .login-box {
            max-width: none;
          }

          .visual-title {
            margin-top: 16px;
            font-size: clamp(29px, 8.2vw, 36px);
          }

          .login-title {
            font-size: clamp(27px, 8vw, 32px);
          }

          .quick-access {
            margin-top: 20px;
            gap: 10px;
          }

          .input-field,
          .secondary-cta {
            min-height: 50px;
            border-radius: 14px;
            font-size: 16px;
          }

          .primary-cta {
            min-height: 52px;
            border-radius: 15px;
            font-size: 16px;
          }

          .forgot-row {
            flex-wrap: wrap;
            justify-content: flex-start;
            margin-top: 12px;
            font-size: 11px;
            gap: 10px;
          }

          .register-note {
            margin-top: 16px;
            font-size: 12px;
          }

          .register-note a {
            min-height: 38px;
            margin-top: 8px;
            padding: 0 14px;
            border-radius: 12px;
          }

          .benefit-row {
            padding: 8px 10px;
            border-radius: 12px;
          }

          .benefit-icon {
            width: 34px;
            height: 34px;
          }

          .benefit-row strong {
            font-size: 11px;
          }

          .benefit-row span {
            font-size: 10px;
          }

          .lgpd-check {
            width: 34px;
            height: 34px;
            font-size: 18px;
          }

          .consigai-cta-animated {
            animation: none;
            transform: none !important;
          }

          .consigai-cta-animated:hover {
            transform: none !important;
            filter: none;
          }

          .primary-cta,
          .secondary-cta {
            transition: transform .15s ease, box-shadow .2s ease, filter .2s ease, background-color .2s ease;
            will-change: transform;
          }

          .primary-cta:active,
          .secondary-cta:active {
            animation: mobileCtaSelect .24s ease;
            transform: translateY(2px) scale(0.982);
            box-shadow: 0 6px 14px rgba(5, 94, 206, 0.2);
            filter: saturate(0.96);
          }

          .primary-cta:focus-visible,
          .secondary-cta:focus-visible {
            animation: mobileCtaSelect .24s ease;
          }
        }

        @media (max-width: 420px) {
          .visual-panel {
            min-height: 170px;
          }

          .visual-title {
            font-size: 28px;
            letter-spacing: -0.05em;
            line-height: 1;
          }

          .visual-copy {
            display: none;
          }

          .benefit-stack {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .consigai-cta-animated,
          .consigai-cta-animated:hover::after {
            animation: none !important;
          }
        }
      `}</style>

      <FontSizeToggleFloating />
      <main className="entry-page">
        <section className="entry-card" aria-label="Tela de entrada ConsigAI">
          <aside className="visual-panel">
            <div className="visual-content">
              <div>
                <div className="visual-kicker">Consignado com IA</div>
                <h1 className="visual-title">Veja quanto você pode <span>Economizar</span></h1>
                <p className="visual-copy">
                  A ConsigAI compara seus contratos e mostra opções para pagar menos,
                  reduzir parcela ou receber dinheiro com transparência.
                </p>

              </div>

              <div className="bottom-section">
                <div className="coverage-row">
                  <span className="coverage-label">Atendemos</span>
                  <div className="coverage-badges">
                    <span className="coverage-badge">
                      <span className="coverage-badge-dot inss" />
                      Aposentados e pensionistas do INSS
                      <span className="coverage-badge-sub">INSS</span>
                    </span>
                    <span className="coverage-badge">
                      <span className="coverage-badge-dot siape" />
                      Servidores públicos federais
                      <span className="coverage-badge-sub">SIAPE</span>
                    </span>
                  </div>
                </div>

                <div className="benefit-stack">
                <div className="benefit-row">
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="consigaiCheck1" x1="26" y1="60" x2="70" y2="34" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#055ECE" />
                          <stop offset="0.55" stopColor="#1DA1EB" />
                          <stop offset="1" stopColor="#00E7FF" />
                        </linearGradient>
                      </defs>
                      <path d="M28 49.5L42.5 64L70 33" stroke="url(#consigaiCheck1)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <strong>Economia antes da decisão</strong>
                    <span>Veja parcela, prazo, taxa e custo antes de avançar.</span>
                  </div>
                </div>

                <div className="benefit-row">
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="consigaiCheck3" x1="26" y1="60" x2="70" y2="34" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#055ECE" />
                          <stop offset="0.55" stopColor="#1DA1EB" />
                          <stop offset="1" stopColor="#00E7FF" />
                        </linearGradient>
                      </defs>
                      <path d="M28 49.5L42.5 64L70 33" stroke="url(#consigaiCheck3)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <strong>A ConsigAI compara por você</strong>
                    <span>Recomendação baseada em economia, parcela, prazo e custo total.</span>
                  </div>
                </div>

                <div className="benefit-row lgpd-row">
                  <span className="benefit-icon" aria-hidden="true">
                    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="consigaiCheckLgpd" x1="26" y1="60" x2="70" y2="34" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#055ECE" />
                          <stop offset="0.55" stopColor="#1DA1EB" />
                          <stop offset="1" stopColor="#00E7FF" />
                        </linearGradient>
                      </defs>
                      <path d="M28 49.5L42.5 64L70 33" stroke="url(#consigaiCheckLgpd)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <strong>Privacidade em conformidade com a LGPD</strong>
                    <span>Seus dados protegidos com segurança e transparência.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </aside>

          <section className="form-panel">
            <OnboardingBrandHeader />
            <div className="login-box">
              <div className="login-kicker">Bem-vindo à ConsigAI</div>
              <h2 className="login-title">Entre para ver sua <span>Economia</span></h2>
              <p className="login-copy">
                Acesse sua simulação e compare opções para pagar menos ou melhorar sua parcela com segurança.
              </p>

              <form className="quick-access" onSubmit={(e) => e.preventDefault()}>
                <input className="input-field" type="text" placeholder="CPF ou e-mail" aria-label="CPF ou e-mail" />
                <input className="input-field" type="password" placeholder="Senha" aria-label="Senha" />

                <button className="primary-cta consigai-cta-animated" type="button" onClick={() => navigate('/carregamento-ofertas')}>Ver minha economia</button>
                <button className="secondary-cta consigai-cta-animated" type="button" onClick={() => navigate('/cadastro')}>Criar minha conta</button>
              </form>

              <div className="forgot-row">
                <span>Esqueceu sua senha?</span>
                <a href="#" onClick={(e) => e.preventDefault()}>Recuperar acesso</a>
              </div>

              <p className="register-note">
                Ainda não tem conta?
                <br />
                <a className="consigai-cta-animated" href="#" onClick={(e) => e.preventDefault()}>Simular com meu extrato</a>
              </p>
            </div>
          </section>
        </section>
      </main>
    </>
  )
}
