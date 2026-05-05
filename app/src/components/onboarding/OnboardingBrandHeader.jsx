import logo from '../../assets/ConsigIA_logo_only_no_background.svg'

const css = `
  .obh {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 28px;
  }
  .obh-logo {
    width: 62px;
    height: 62px;
    display: grid;
    place-items: center;
  }
  .obh-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .obh-step {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 16px;
  }
  .obh-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 11px;
    border-radius: 999px;
    background: rgba(0,231,255,0.10);
    border: 1px solid rgba(0,231,255,0.28);
    color: #055ECE;
    font-size: 11px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    white-space: nowrap;
    font-family: inherit;
  }
  .obh-pill::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00E7FF;
    box-shadow: 0 0 8px rgba(0,231,255,0.7);
    flex: 0 0 auto;
  }
  .obh-bar-track {
    width: 72px;
    height: 5px;
    border-radius: 999px;
    background: #DDE8F6;
    overflow: hidden;
  }
  .obh-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #055ECE, #00E7FF);
  }
  @media (max-width: 560px) {
    .obh-logo { width: 52px; height: 52px; }
    .obh { margin-bottom: 20px; }
    .obh-step { margin-top: 12px; }
  }
`

export default function OnboardingBrandHeader({ showStepBadge, stepLabel, stepProgress }) {
  return (
    <>
      <style>{css}</style>
      <div className="obh">
        <div className="obh-logo">
          <img src={logo} alt="ConsigAI" />
        </div>
        {showStepBadge && (
          <div className="obh-step">
            <div className="obh-pill">{stepLabel}</div>
            {stepProgress != null && (
              <div className="obh-bar-track">
                <div className="obh-bar-fill" style={{ width: `${stepProgress}%` }} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
