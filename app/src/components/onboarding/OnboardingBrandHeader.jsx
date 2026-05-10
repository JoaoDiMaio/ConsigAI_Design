import logo from '../../assets/ConsigIA_logo_only_no_background.svg'
import { colors } from '../../ui/theme'
import { useFontSize } from '../../hooks/useFontSize'

const css = `
  .obh {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 28px;
  }
  .obh-logo {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
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
    margin-top: 14px;
    gap: 12px;
  }
  .obh-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    border-radius: 999px;
    background: ${colors.brandSoft};
    border: 1px solid ${colors.border};
    color: ${colors.brandPrimary};
    font-size: 10.5px;
    font-weight: 900;
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
    background: ${colors.brandPrimary};
    flex: 0 0 auto;
  }
  .obh-pill.obh-pill--green {
    background: ${colors.successSoft};
    border-color: ${colors.successBorder};
    color: ${colors.successDark};
  }
  .obh-pill.obh-pill--green::before {
    background: ${colors.success};
  }
  .obh-bar-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex: 0 0 auto;
  }
  .obh-bar-pct {
    font-size: 10px;
    font-weight: 900;
    color: ${colors.brandPrimary};
    letter-spacing: 0.04em;
    line-height: 1;
  }
  .obh-bar-track {
    width: 100px;
    height: 5px;
    border-radius: 999px;
    background: ${colors.border};
    overflow: hidden;
  }
  .obh-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, ${colors.brandPrimary}, ${colors.brandInteractive});
    transition: width 200ms ease;
  }
  @media (max-width: 560px) {
    .obh-logo { width: 46px; height: 46px; }
    .obh { margin-bottom: 20px; }
    .obh-step { margin-top: 12px; }
    .obh-bar-track { width: 80px; }
  }
`

export default function OnboardingBrandHeader({ showStepBadge, stepLabel, stepProgress, pillVariant }) {
  const { enlarged, toggle } = useFontSize()
  return (
    <>
      <style>{css}</style>
      <div className="obh">
        <button
          type="button"
          onClick={toggle}
          title={enlarged ? 'Reduzir fonte' : 'Aumentar fonte'}
          aria-label={enlarged ? 'Reduzir tamanho da fonte' : 'Aumentar tamanho da fonte'}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            zIndex: 10,
            display: 'inline-flex',
            alignItems: 'flex-end',
            gap: 0,
            minHeight: 36,
            border: `1px solid ${colors.borderStrong}`,
            borderRadius: 10,
            background: colors.brandSurface,
            padding: '7px 12px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 2px 10px rgba(0,0,0,.07)',
            userSelect: 'none',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 900, color: enlarged ? colors.textMuted : colors.brandPrimary, lineHeight: 1 }}>A</span>
          <span style={{ width: 1, height: 16, background: colors.border, margin: '0 5px', flexShrink: 0, alignSelf: 'flex-end' }} />
          <span style={{ display: 'inline-flex', alignItems: 'flex-end', lineHeight: 1 }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: enlarged ? colors.brandPrimary : colors.textMuted, lineHeight: 1 }}>A</span>
            <span style={{ fontSize: 10, fontWeight: 900, color: enlarged ? colors.brandPrimary : colors.textMuted, lineHeight: 1, marginBottom: 1 }}>+</span>
          </span>
        </button>
        <div className="obh-logo">
          <img src={logo} alt="ConsigAI" />
        </div>
        {showStepBadge && (
          <div className="obh-step">
            <div className={`obh-pill${pillVariant === 'green' ? ' obh-pill--green' : ''}`}>{stepLabel}</div>
            {stepProgress != null && (
              <div className="obh-bar-wrap">
                <span className="obh-bar-pct">{stepProgress}%</span>
                <div className="obh-bar-track">
                  <div className="obh-bar-fill" style={{ width: `${stepProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
