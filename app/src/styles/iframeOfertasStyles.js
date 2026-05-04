// CSS strings injetados no documento do iframe /Ofertas_ConsigAI.html.
// Separados aqui para poder editar sem abrir o componente principal.
// Quando o HTML do iframe for migrado para JSX nativo, mover para .css normais.
import { gradient } from '../ui/theme'

export const RESPONSIVE_STYLES_CSS = `
  .consigai-offer-lines--no-min-height { min-height: 0 !important; }
  .brand-name {
    display: inline-block;
    white-space: nowrap;
    gap: 0;
  }
  .gain-title span.brand-name,
  .economy-card span.brand-name,
  .salary-label span.brand-name {
    display: inline-block !important;
    white-space: nowrap !important;
    margin-top: 0 !important;
  }
  .gain-title span.brand-consig,
  .gain-title span.brand-ai,
  .economy-card span.brand-consig,
  .economy-card span.brand-ai,
  .salary-label span.brand-consig,
  .salary-label span.brand-ai {
    display: inline !important;
    white-space: nowrap !important;
  }
  .brand-ai { color: #1DA1EB !important; }

  .topbar .logo {
    gap: 0 !important;
    font-size: 0 !important;
    line-height: 0 !important;
    cursor: pointer !important;
  }
  .topbar .logo img {
    height: 34px;
    width: auto;
    display: block;
  }
  .consigai-hero-note {
    margin: 10px 0 0;
    font-size: 13px;
    font-weight: 500;
    color: #7a8db8;
    line-height: 1.4;
  }
  .offer-val-num,
  .hc-col-val,
  .hc-saving-value,
  .ba-row-val,
  .ba-total-val,
  .ba-credit-val,
  .sb-extra-val,
  .sb-main .highlight,
  #ctaSaving,
  #heroNova,
  #heroEco,
  #hcNova,
  #hcEco,
  #baNova,
  #baSobra,
  #baCredito,
  #baPill,
  #sbHi,
  #sbExtra {
    white-space: nowrap !important;
    word-break: keep-all !important;
    font-variant-numeric: tabular-nums;
  }

  .sticky-cta {
    display: grid !important;
    grid-template-columns: minmax(300px, 420px) 1px 172px minmax(240px, auto) !important;
    align-items: center !important;
    justify-content: center !important;
    column-gap: 36px !important;
    row-gap: 10px !important;
    width: 100% !important;
  }
  @media (min-width: 761px) {
    .sticky-cta {
      height: 76px !important;
      min-height: 76px !important;
    }
  }
  .sticky-cta .cta-info {
    width: 420px !important;
    max-width: 420px !important;
    min-width: 0 !important;
  }
  .sticky-cta .cta-offer-name,
  .sticky-cta .cta-offer-sub {
    display: block !important;
    max-width: 100% !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  .sticky-cta .cta-offer-name {
    line-height: 16px !important;
  }
  .sticky-cta .cta-offer-sub {
    line-height: 15px !important;
  }
  .sticky-cta .cta-sep {
    justify-self: center !important;
  }
  .sticky-cta > div:nth-child(3) {
    width: 172px !important;
    min-width: 172px !important;
    text-align: left !important;
  }
  .sticky-cta .cta-saving,
  .sticky-cta #ctaSaving {
    display: block !important;
    width: 172px !important;
    min-width: 172px !important;
    text-align: left !important;
    font-variant-numeric: tabular-nums !important;
    line-height: 25px !important;
  }
  .sticky-cta .cta-saving-label {
    width: 172px !important;
    white-space: nowrap !important;
    line-height: 13px !important;
  }
  .sticky-cta .btn-cta {
    min-width: 240px !important;
    min-height: 44px !important;
    justify-content: center !important;
  }
  .sticky-cta .vc,
  .sticky-cta .popped,
  .sticky-cta #ctaSaving {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  .hero-title { font-size: clamp(24px, 3.2vw, 32px) !important; }
  .section-title { font-size: clamp(16px, 2.1vw, 18px) !important; }
  .offer-val-num { font-size: clamp(19px, 2.4vw, 26px) !important; }
  .ba-total-val { font-size: clamp(26px, 3.5vw, 32px) !important; }
  .sb-main { font-size: clamp(18px, 2.7vw, 20px) !important; }
  .sb-extra-val { font-size: clamp(18px, 3vw, 22px) !important; }
  .ba-section.consigai-pocket-redesign .ba-cols {
    display: none !important;
  }
  .impact-section {
    --blue-title: #0E2F7E;
    --blue-action: #2454D6;
    --cyan-brand: #18B7E8;
    --teal-brand: #00A99D;
    --aqua-brand: #6DF5D4;
    --green-strong: #0a7c52;
    --green-medium: #0a7c52;
    --green-soft: #EAF8F0;
    --green-border: #A8DEC3;
    --red-negative: #C00000;
    --gray-text: #667399;
    --gray-border: #DCE5FF;
    --gray-bg: #F7FAFF;
    --white: #FFFFFF;
  }
  .impact-header {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 2px;
    align-items: center;
    margin-bottom: 12px;
  }
  .impact-header .ba-title {
    grid-column: 1;
    grid-row: 1;
    font-weight: 950 !important;
  }
  .impact-header .ba-title .impact-title-eco {
    color: #0a7c52 !important;
    font-weight: 950 !important;
  }
  .impact-header .ba-title .impact-title-ai {
    color: #18B7E8 !important;
    font-weight: 950 !important;
  }
  .impact-header .ba-sub {
    grid-column: 1; grid-row: 2;
    color: var(--gray-text) !important;
    font-size: 13px;
  }
  .consigai-pocket-visual.impact-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
    gap: 10px;
    position: relative;
  }
  .impact-card {
    position: relative;
    overflow: hidden;
    border-radius: 28px;
    padding: 18px;
    border: 1px solid var(--gray-border);
    background: #ffffff;
    box-shadow: 0 18px 42px rgba(3, 36, 111, 0.07);
  }
  .impact-card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 4px;
    background: linear-gradient(90deg, var(--blue-action) 0%, var(--cyan-brand) 55%, var(--teal-brand) 100%);
  }
  .impact-card-before {
    background:
      radial-gradient(circle at 92% 8%, rgba(5, 94, 206, 0.07), transparent 34%),
      linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%);
  }
  .impact-card-before::before {
    background: linear-gradient(90deg, #f8b4ac, #c00000);
  }
  .impact-card-after {
    background:
      radial-gradient(circle at 92% 8%, rgba(0, 231, 255, 0.13), transparent 34%),
      radial-gradient(circle at 12% 100%, rgba(0, 122, 82, 0.10), transparent 34%),
      linear-gradient(180deg, #F0FFF8 0%, #FFFFFF 100%);
    border-color: var(--green-border);
  }
  .impact-card-after::before {
    background: linear-gradient(90deg, var(--cyan-brand), var(--green-strong));
  }
  .impact-card-gain {
    border-color: rgba(0, 231, 255, 0.42);
    background:
      radial-gradient(circle at 92% 8%, rgba(0, 231, 255, 0.16), transparent 34%),
      linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%);
  }
  .impact-card-gain::before {
    background: linear-gradient(90deg, var(--blue-action), var(--cyan-brand));
  }
  .impact-divider-arrow {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    align-self: center;
    justify-self: center;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: linear-gradient(145deg, var(--blue-action), var(--cyan-brand));
    color: #fff;
    font-size: 18px;
    font-weight: 950;
    line-height: 1;
    box-shadow: 0 14px 28px rgba(5, 94, 206, 0.20);
    z-index: 3;
    pointer-events: none;
  }
  .impact-divider-arrow-left { left: calc(33.333% + 5px); }
  .impact-divider-arrow-right { left: calc(66.666% + 5px); }
  .salary-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 11px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: .08em;
    text-transform: uppercase;
    background: #F4F8FF;
    border: 1px solid var(--gray-border);
    color: var(--blue-title);
  }
  .impact-card-after .salary-label {
    background: var(--green-soft);
    border-color: var(--green-border);
    color: var(--green-strong);
  }
  .salary-main {
    margin-top: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(221, 232, 246, 0.95);
  }
  .salary-main small {
    display: block;
    color: var(--gray-text);
    font-size: 11px;
    font-weight: 700;
  }
  .salary-main strong {
    display: block;
    margin-top: 6px;
    color: var(--blue-title);
    font-size: 22px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -.05em;
    white-space: nowrap;
  }
  .impact-card-after .salary-main strong {
    color: var(--green-strong);
  }
  .salary-main span {
    display: block;
    margin-top: 4px;
    color: var(--gray-text);
    font-size: 11px;
    font-weight: 700;
  }
  .salary-details {
    display: grid;
    gap: 8px;
    margin-top: 10px;
  }
  .salary-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.80);
    border: 1px solid var(--gray-border);
    align-items: center;
  }
  .salary-row span {
    color: var(--blue-title);
    font-size: 11px;
    font-weight: 700;
  }
  .salary-row strong {
    color: var(--blue-title);
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -.04em;
    white-space: nowrap;
  }
  .salary-row small {
    grid-column: 1 / -1;
    color: var(--gray-text);
    font-size: 11px;
    line-height: 1.25;
    font-weight: 700;
    margin-top: -4px;
  }
  .salary-row.negative {
    background: rgba(255, 246, 245, 0.72);
    border-color: rgba(248, 180, 172, 0.65);
  }
  .salary-row.negative strong {
    color: var(--red-negative);
  }
  .salary-row.positive {
    background: rgba(233, 248, 241, 0.58);
    border-color: var(--green-border);
  }
  .salary-row.positive strong {
    color: var(--green-strong);
  }
  .gain-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--gray-border);
  }
  .gain-title small {
    color: var(--blue-action);
    font-size: 10px;
    font-weight: 900;
    letter-spacing: .10em;
    text-transform: uppercase;
  }
  .gain-title strong {
    display: block;
    margin-top: 4px;
    color: var(--blue-title);
    font-size: 17px;
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -.03em;
  }
  .gain-title span {
    display: block;
    margin-top: 4px;
    color: var(--gray-text);
    font-size: 11px;
    line-height: 1.35;
    font-weight: 700;
  }
  .gain-title span.brand-name {
    display: inline-block !important;
    font-size: inherit !important;
    line-height: inherit !important;
  }
  .flow-arrow {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: linear-gradient(145deg, var(--blue-action), var(--cyan-brand));
    color: white;
    font-size: 20px;
    font-weight: 950;
    box-shadow: 0 14px 32px rgba(5, 94, 206, 0.24);
    flex: 0 0 auto;
  }
  .gain-metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 10px;
  }
  .gain-metric {
    min-height: 0;
    padding: 8px 10px 6px;
    border-radius: 13px;
    background:
      radial-gradient(circle at 92% 8%, rgba(0, 122, 82, 0.10), transparent 34%),
      linear-gradient(180deg, #F3FFF9 0%, #FFFFFF 100%);
    border: 1px solid var(--green-border);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .gain-metric.blue {
    background:
      radial-gradient(circle at 92% 8%, rgba(5, 94, 206, 0.10), transparent 34%),
      linear-gradient(180deg, #F4F8FF 0%, #FFFFFF 100%);
    border-color: var(--gray-border);
  }
  .gain-metric small {
    display: block;
    color: var(--gray-text);
    font-size: 11px;
    line-height: 1.25;
    font-weight: 700;
  }
  .gain-metric strong {
    display: block;
    margin-top: 4px;
    color: var(--green-strong);
    font-size: 22px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -.05em;
    white-space: nowrap;
  }
  .gain-metric.blue strong {
    color: var(--blue-action);
  }
  .gain-metric span {
    display: block;
    margin-top: 4px;
    color: var(--gray-text);
    font-size: 11px;
    line-height: 1.25;
    font-weight: 700;
  }
  .economy-card {
    margin-top: 12px;
    padding: 12px;
    border-radius: 13px;
    background:
      radial-gradient(circle at 92% 8%, rgba(0, 122, 82, 0.13), transparent 34%),
      linear-gradient(180deg, #EFFFF6 0%, #FFFFFF 100%);
    border: 1px solid var(--green-border);
  }
  .economy-card small {
    color: var(--blue-title);
    font-size: 11px;
    font-weight: 700;
  }
  .economy-card strong {
    display: block;
    margin-top: 4px;
    color: var(--green-strong);
    font-size: 22px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -.05em;
    white-space: nowrap;
  }
  .economy-card span {
    display: block;
    margin-top: 3px;
    color: var(--gray-text);
    font-size: 11px;
    line-height: 1.35;
    font-weight: 700;
  }
  .economy-card span.brand-name {
    display: inline-block !important;
    font-size: inherit !important;
    line-height: inherit !important;
  }
  .salary-factor {
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    padding: 9px 10px;
    border-radius: 13px;
    background:
      radial-gradient(circle at 92% 8%, rgba(0, 231, 255, 0.13), transparent 34%),
      linear-gradient(180deg, #EFFFFF 0%, #FFFFFF 100%);
    border: 1px solid rgba(0, 231, 255, 0.38);
  }
  .salary-factor span {
    color: var(--blue-title);
    font-size: 11px;
    font-weight: 850;
  }
  .salary-factor strong {
    color: var(--blue-action);
    font-size: 20px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -.05em;
    white-space: nowrap;
  }
  .consigai-pocket-label { font-size: 11px; font-weight: 600; color: var(--blue-title); margin-bottom: 2px; }
  .consigai-pocket-val {
    font-size: clamp(16px, 2.1vw, 24px); font-weight: 900;
    letter-spacing: -.03em; color: var(--blue-title); line-height: 1.05;
  }
  .value-negative { color: var(--red-negative); }
  .value-positive { color: var(--green-medium); }
  .consigai-pocket-note { margin-top: 2px; color: var(--gray-text); font-size: 10px; line-height: 1.2; }
  .consigai-pocket-gain-title { font-size: 12px; font-weight: 800; color: var(--blue-title); margin-bottom: 2px; }
  .consigai-pocket-gain-value {
    font-size: clamp(20px, 2.8vw, 34px); line-height: 1;
    letter-spacing: -.04em; color: var(--green-strong); font-weight: 900;
  }
  .consigai-pocket-gain-copy { font-size: 12px; color: var(--blue-title); font-weight: 700; }
  .gain-list { display: grid; gap: 8px; }
  .gain-item {
    display: grid; grid-template-columns: 28px minmax(0, 1fr) auto;
    align-items: center; gap: 10px;
    border: 1px solid #cfeedd; border-radius: 10px;
    padding: 8px 10px; background: #fff;
  }
  .consigai-pocket-gain-icon {
    width: 28px; height: 28px; border-radius: 999px;
    background: var(--green-soft); color: var(--green-medium);
    display: inline-flex; align-items: center; justify-content: center;
  }
  .consigai-pocket-gain-icon svg {
    width: 16px; height: 16px; stroke: currentColor; fill: none;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  }
  .consigai-pocket-gain-label {
    font-size: 10px; font-weight: 700; color: var(--blue-title);
    text-transform: uppercase; letter-spacing: .04em;
  }
  .consigai-pocket-gain-num {
    font-size: 16px; line-height: 1; color: var(--green-medium);
    font-weight: 900; letter-spacing: -.03em; white-space: nowrap;
  }
  .consigai-trust-replacement {
    margin-top: 12px; border: 1px solid #d7e1fb; border-radius: 14px;
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
    padding: 16px 18px; gap: 14px; background: #ffffff;
  }
  .consigai-trust-item {
    display: grid; grid-template-columns: 46px minmax(0, 1fr);
    align-items: center; gap: 10px; min-height: 58px;
    border-right: 1px solid #dfe7f5; padding-right: 10px;
  }
  .consigai-trust-item:last-child { border-right: 0; padding-right: 0; }
  .consigai-trust-icon {
    width: 42px; height: 42px; border-radius: 50%;
    background: #f1fcf6; border: 1px solid #c9f0d9;
    color: #0a7c52; display: inline-flex; align-items: center; justify-content: center;
  }
  .consigai-trust-icon svg {
    width: 21px; height: 21px; stroke: currentColor; fill: none;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  }
  .consigai-trust-title { font-size: 14px; font-weight: 900; color: #061a55; margin-bottom: 2px; line-height: 1.15; }
  .consigai-trust-copy { font-size: 12px; line-height: 1.3; color: #57709f; font-weight: 600; }

  .ba-section.consigai-pocket-redesign {
    position: relative !important;
    overflow: hidden !important;
    padding: 26px 28px !important;
    border-radius: 28px !important;
    background: rgba(255, 255, 255, 0.98) !important;
    border: 1px solid var(--gray-border) !important;
    box-shadow: 0 24px 64px rgba(3, 36, 111, 0.10) !important;
  }
  .ba-section.consigai-pocket-redesign::before {
    content: '' !important;
    position: absolute !important;
    inset: 0 0 auto 0 !important;
    height: 5px !important;
    background: linear-gradient(90deg, var(--blue-action), var(--cyan-brand), var(--aqua-brand), var(--green-strong)) !important;
  }
  .consigai-pocket-visual.impact-grid {
    display: block !important;
  }
  .projection-flow {
    display: grid !important;
    grid-template-columns: minmax(132px, 1.08fr) 36px minmax(112px, 0.9fr) minmax(132px, 0.95fr) 36px minmax(132px, 1.08fr) !important;
    align-items: stretch !important;
    gap: 12px !important;
  }
  .projection-state {
    min-height: 164px;
    padding: 18px 20px;
    border-radius: 28px;
    display: grid;
    grid-template-rows: 30px 54px 1fr;
    align-content: stretch;
    align-items: start;
    text-align: center;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(29, 161, 235, 0.34);
    background:
      radial-gradient(circle at 90% 8%, rgba(0, 231, 255, 0.14), transparent 36%),
      linear-gradient(180deg, #F4FBFF 0%, #FFFFFF 100%);
    box-shadow: 0 18px 44px rgba(3, 36, 111, 0.08);
  }
  .projection-state::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 4px;
    background: linear-gradient(90deg, var(--cyan-brand), var(--aqua-brand));
  }
  .projection-state-after {
    min-height: 164px;
    padding: 18px 20px;
    border-color: rgba(0, 122, 82, 0.30);
    background:
      radial-gradient(circle at 90% 8%, rgba(0, 231, 255, 0.14), transparent 36%),
      radial-gradient(circle at 10% 100%, rgba(0, 122, 82, 0.09), transparent 34%),
      linear-gradient(180deg, #F0FFF8 0%, #FFFFFF 100%);
  }
  .projection-state-after::before {
    background: linear-gradient(90deg, var(--aqua-brand), var(--green-strong));
  }
  .projection-state h3,
  .projection-metric h4 {
    min-height: 30px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    color: var(--gray-text);
    font-size: 11px;
    line-height: 1.15;
    font-weight: 850;
    letter-spacing: .06em;
    text-transform: uppercase;
  }
  .projection-state-value,
  .projection-number {
    align-self: start;
    margin-top: 0;
  }
  .projection-state-value strong {
    display: block;
    color: var(--blue-action);
    font-size: 26px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -.03em;
    white-space: nowrap;
  }
  .projection-state-after .projection-state-value strong {
    color: var(--green-strong);
  }
  .projection-state-value span,
  .projection-number span {
    display: block;
    margin-top: 7px;
    color: var(--gray-text);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
  }
  .projection-state p,
  .projection-metric p {
    margin-top: 0;
    color: var(--gray-text);
    font-size: 11.5px;
    line-height: 1.4;
    font-weight: 500;
  }
  .projection-symbol {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: #fff;
    font-size: 18px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0;
    justify-self: center;
    align-self: center;
    z-index: 2;
    background: var(--blue);
    box-shadow: 0 2px 16px rgba(0,0,0,.18);
  }
  .projection-symbol-arrow {
    background: var(--blue);
    padding-left: 1px;
  }
  .projection-symbol-equal {
    background: var(--blue);
    padding-bottom: 1px;
  }
  .projection-metric {
    min-width: 0;
    display: grid;
    grid-template-rows: 30px 54px 1fr;
    align-content: stretch;
    align-items: start;
    padding: 19px 0 17px;
    text-align: center;
  }
  .projection-number strong {
    display: block;
    font-size: 26px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -.03em;
    white-space: nowrap;
  }
  .projection-gain .projection-number strong,
  .projection-gain .projection-number span {
    color: var(--blue-action);
  }
  .projection-economy .projection-number strong,
  .projection-economy .projection-number span {
    color: var(--green-strong);
  }
  .projection-metric p strong {
    color: var(--blue-action);
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0;
    white-space: nowrap;
  }
  .projection-transparency {
    margin-top: 14px;
    padding: 14px 16px;
    border-radius: 18px;
    background: #F4F8FF;
    border: 1px solid var(--gray-border);
    color: var(--gray-text);
    font-size: 11.5px;
    line-height: 1.45;
    font-weight: 500;
  }
  .projection-transparency strong {
    color: var(--blue-title);
  }

  @media (min-width: 1024px) {
    .main { padding: 18px 18px 64px !important; }
    .hero { padding: 18px 24px !important; margin-bottom: 14px !important; gap: 18px !important; }
    .hero-eyebrow { margin-bottom: 6px !important; }
    .hero-title { margin-bottom: 6px !important; font-size: clamp(22px, 2.8vw, 30px) !important; }
    .consigai-hero-note { margin-top: 6px !important; font-size: 12px !important; }
    .hero-compare { width: min(332px, 100%) !important; }
    .offers-grid { gap: 10px !important; margin-bottom: 14px !important; }
    .offer-card { padding: 14px !important; }
    .offer-desc { margin-top: 2px !important; }
    .ba-section { padding: 14px 16px !important; margin-bottom: 8px !important; border-radius: 16px !important; }
    .ba-header { margin-bottom: 8px !important; }
    .ba-title { font-size: 15px !important; margin-bottom: 1px !important; }
    .ba-sub { font-size: 12px !important; }
    .consigai-pocket-visual.impact-grid { gap: 10px !important; }
    .impact-card { padding: 12px !important; }
    .salary-main { margin-top: 10px !important; padding-bottom: 8px !important; }
    .salary-main strong { font-size: 20px !important; }
    .salary-details { margin-top: 8px !important; gap: 5px !important; }
    .salary-row { padding: 8px 9px !important; border-radius: 12px !important; gap: 7px !important; }
    .salary-row span { font-size: 10px !important; }
    .salary-row strong { font-size: 14px !important; }
    .gain-title { padding-bottom: 8px !important; gap: 8px !important; }
    .gain-title strong { font-size: 15px !important; }
    .gain-title span { font-size: 10px !important; }
    .flow-arrow { width: 36px !important; height: 36px !important; font-size: 18px !important; }
    .gain-metrics { margin-top: 8px !important; gap: 5px !important; }
    .gain-metric { min-height: 0 !important; padding: 8px 9px 5px !important; }
    .gain-metric strong { font-size: 20px !important; }
    .economy-card { margin-top: 7px !important; padding: 9px !important; border-radius: 12px !important; }
    .economy-card strong { font-size: 20px !important; }
    .salary-factor { margin-top: 5px !important; padding: 8px 9px !important; border-radius: 12px !important; }
    .salary-factor strong { font-size: 18px !important; }
    .consigai-pocket-gain-value { font-size: clamp(18px, 2.2vw, 28px) !important; }
    .consigai-pocket-gain-num { font-size: 14px !important; }
    .consigai-trust-replacement { margin-top: 8px !important; }
    .ba-col { padding: 14px 14px !important; }
    .ba-col-tag { margin-bottom: 10px !important; }
    .ba-row { padding: 5px 0 !important; font-size: 12px !important; }
    .ba-total-label { margin-bottom: 2px !important; }
    .ba-total-val { margin-bottom: 6px !important; font-size: clamp(22px, 2.4vw, 28px) !important; }
    .ba-credit { padding: 7px 9px !important; border-radius: 8px !important; }
    .ba-credit-val { font-size: 14px !important; }
    .ba-credit-note { font-size: 9px !important; }
    .ba-center-pill { padding: 5px 12px !important; font-size: 11px !important; }
    .savings-banner { padding: 14px 18px !important; }
    .sticky-cta { padding: 10px 18px !important; column-gap: 64px !important; }
    .btn-cta { padding: 12px 22px !important; }
  }

  @media (max-width: 1080px) {
    .main { padding: 24px 16px 64px !important; }
    .hero { padding: 18px 18px !important; gap: 16px !important; }
    .hero-compare { justify-self: end !important; width: min(332px, 100%) !important; }
    .hc-row { gap: 12px !important; }
    .hc-col-val { font-size: 20px !important; }
    .offers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .offers-grid > .offer-card:nth-child(3) {
      grid-column: 1 / -1 !important; justify-self: center !important;
      width: min(520px, 100%) !important;
    }
    .ba-section { padding: 20px 16px !important; }
    .consigai-pocket-visual.impact-grid { grid-template-columns: minmax(0, 1fr) !important; }
    .projection-flow {
      grid-template-columns: minmax(0, 1fr) !important;
      gap: 14px !important;
    }
    .projection-symbol-arrow,
    .projection-symbol-equal {
      transform: rotate(90deg);
    }
    .projection-state-after {
      min-height: 164px !important;
      padding: 18px 20px !important;
    }
    .consigai-trust-replacement {
      margin-top: 10px !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .consigai-trust-item:nth-child(2) { border-right: 0 !important; }
  }

  @media (max-width: 760px) {
    .topbar {
      padding: 10px 12px !important; height: auto !important;
      min-height: 64px !important; gap: 10px !important; flex-wrap: wrap !important;
    }
    .topbar .logo img {
      height: 52px !important;
    }
    .topbar-center { order: 3; width: 100%; }
    .topbar-title { font-size: 14px !important; }
    .topbar-sub { font-size: 11px !important; }
    .main { padding: 16px 12px 64px !important; }
    .hero { grid-template-columns: minmax(0, 1fr) !important; }
    .hero-compare { justify-self: stretch !important; width: 100% !important; }
    .hc-row { grid-template-columns: 1fr !important; }
    .hc-col-val { font-size: 19px !important; }
    .hc-arrow { transform: rotate(90deg) !important; }
    .hc-saving {
      grid-template-columns: 1fr !important;
      justify-items: start !important;
      gap: 4px !important;
    }
    .hc-saving-value {
      width: auto !important;
      text-align: left !important;
      justify-self: start !important;
    }
    .offers-grid {
      display: flex !important;
      gap: 10px !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      scroll-snap-type: x mandatory !important;
      scroll-padding-left: 12px !important;
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior-x: contain !important;
      padding: 2px 0 10px !important;
      margin: 0 -12px 10px !important;
      padding-left: 12px !important;
      padding-right: 12px !important;
      scrollbar-width: none !important;
    }
    .offers-grid::-webkit-scrollbar { display: none !important; }
    .offers-grid > .offer-card:nth-child(3) {
      grid-column: auto !important; justify-self: stretch !important; width: auto !important;
    }
    .offer-card {
      flex: 0 0 min(84vw, 340px) !important;
      width: min(84vw, 340px) !important;
      scroll-snap-align: start !important;
      padding: 14px !important;
    }
    .offer-values { gap: 12px !important; }
    .consigai-pocket-visual.impact-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 0 !important; }
    .ba-section.consigai-pocket-redesign {
      padding: 16px !important;
      border-radius: 22px !important;
    }

    /* Projeção mobile: grid 2×2 com areas nomeadas */
    .projection-flow {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      grid-template-rows: auto auto !important;
      grid-template-areas:
        "today after"
        "gain  economy" !important;
      gap: 8px !important;
    }
    .projection-state-today  { grid-area: today !important; }
    .projection-state-after  { grid-area: after !important; }
    .projection-gain         { grid-area: gain !important; }
    .projection-economy      { grid-area: economy !important; }
    .projection-symbol       { display: none !important; }

    .projection-state,
    .projection-state-after {
      min-height: 0 !important;
      padding: 14px 14px !important;
      border-radius: 18px !important;
    }
    .projection-metric {
      padding: 14px 14px !important;
      border-radius: 18px !important;
      background: var(--gray-bg) !important;
      border: 1px solid var(--gray-border) !important;
      text-align: left !important;
    }
    .projection-state h3,
    .projection-metric h4 {
      font-size: 10px !important;
      min-height: 0 !important;
    }
    .projection-state-value strong,
    .projection-number strong {
      font-size: 22px !important;
      letter-spacing: -.04em !important;
    }
    .projection-state-value span,
    .projection-number span {
      font-size: 9.5px !important;
      margin-top: 4px !important;
    }
    .projection-state-value {
      margin-top: 8px !important;
    }
    .projection-number {
      margin-top: 8px !important;
    }
    .projection-state p,
    .projection-metric p {
      font-size: 10px !important;
      margin-top: 6px !important;
    }
    .projection-transparency {
      border-radius: 15px !important;
      font-size: 11px !important;
      margin-top: 10px !important;
    }
    .impact-card-before, .impact-card-after, .impact-card-gain, .impact-divider-arrow { grid-column: 1 !important; }
    .impact-divider-arrow { display: none !important; }
    .salary-main strong { font-size: 22px !important; }
    .salary-row { grid-template-columns: minmax(0, 1fr) auto !important; }
    .salary-row strong { font-size: 13px !important; }
    .gain-title {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    .gain-title span { font-size: 10px !important; }
    .gain-metrics { grid-template-columns: minmax(0, 1fr) !important; }
    .gain-metric { min-height: 0 !important; padding: 8px 9px 5px !important; }
    .economy-card strong { font-size: 20px !important; }
    .salary-factor {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    .salary-factor strong { font-size: 18px !important; }
    .consigai-trust-replacement {
      grid-template-columns: minmax(0, 1fr) !important;
      padding: 12px !important; gap: 10px !important;
    }
    .consigai-trust-item {
      border-right: 0 !important; border-bottom: 1px solid #dfe7f5 !important;
      padding-right: 0 !important; padding-bottom: 8px !important;
      grid-template-columns: 40px minmax(0, 1fr) !important;
    }
    .consigai-trust-item:last-child { border-bottom: 0 !important; padding-bottom: 0 !important; }
    .consigai-trust-icon { width: 36px !important; height: 36px !important; }
    .consigai-trust-title { font-size: 13px !important; }
    .consigai-trust-copy { font-size: 12px !important; }
    .ba-col.today, .ba-col.after {
      border-radius: 12px !important; border-left: 1px solid var(--line) !important;
    }
    .ba-center-badge { position: static !important; transform: none !important; margin: 8px 0; }
    .savings-banner {
      padding: 14px 14px !important; gap: 10px !important;
      flex-direction: column !important; align-items: flex-start !important;
    }
    .sb-right { text-align: left !important; }
    .sticky-cta {
      grid-template-columns: minmax(0, 1fr) 132px !important;
      padding: 10px 12px !important; gap: 10px 16px !important;
      justify-content: stretch !important;
    }
    .sticky-cta .cta-info {
      width: auto !important;
      max-width: none !important;
    }
    .cta-sep { display: none !important; }
    .sticky-cta > div:nth-child(3),
    .sticky-cta .cta-saving,
    .sticky-cta #ctaSaving,
    .sticky-cta .cta-saving-label {
      width: 132px !important;
      min-width: 132px !important;
    }
    .btn-cta {
      grid-column: 1 / -1 !important;
      width: 100% !important;
      justify-content: center !important;
      padding: 12px 16px !important;
    }
  }
`

export const OFFER_CARD_REDESIGN_CSS = `
  .hero-sub { display: none !important; }
  .section-header { display: none !important; }
  .savings-banner { display: none !important; }
  .topbar { display: none !important; }
  .sticky-cta { display: none !important; }
  html,
  body {
    background: ${gradient.appBackground} !important;
    background-size: ${gradient.appBackgroundSize} !important;
    background-repeat: ${gradient.appBackgroundRepeat} !important;
    background-position: ${gradient.appBackgroundPosition} !important;
  }
  html {
    overflow: hidden !important;
  }
  body {
    overflow-x: hidden !important;
    overflow-y: visible !important;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
    color: var(--text-main, var(--text)) !important;
    padding: 0 24px 24px !important;
  }
  .main { position: relative !important; z-index: 0 !important; }
  .main::before { display: none !important; }
  .hero-title { color: #1a3d8f !important; }
  .hero-title em { color: #0a7c52 !important; font-style: normal !important; }
  @media (min-width: 1024px) { .hero-title { white-space: nowrap !important; } }
  .hero-compare {
    position: relative !important;
    overflow: hidden !important;
    background: #ffffff !important;
    border: 1px solid var(--line) !important;
    border-radius: 20px !important;
    box-shadow: 0 24px 60px rgba(3, 36, 111, 0.11) !important;
    padding: 10px !important;
    user-select: text !important;
    -webkit-user-select: text !important;
  }
  .hero-compare::before {
    content: '' !important;
    position: absolute !important;
    inset: 0 0 auto 0 !important;
    height: 4px !important;
    background: linear-gradient(90deg, var(--blue) 0%, var(--cyan) 55%, var(--green-accent) 100%) !important;
  }
  .hero-compare::after {
    content: '' !important;
    position: absolute !important;
    width: 220px !important;
    height: 220px !important;
    right: -105px !important;
    top: -105px !important;
    border-radius: 50% !important;
    background: radial-gradient(circle, rgba(0, 231, 255, 0.14), transparent 64%) !important;
    pointer-events: none !important;
  }
  .hc-label {
    display: block !important;
    position: relative !important;
    font-size: 0 !important;
    line-height: 1 !important;
    text-transform: none !important;
    margin-bottom: 6px !important;
    padding-bottom: 10px !important;
    border-bottom: 1px solid var(--line) !important;
    user-select: text !important;
    -webkit-user-select: text !important;
    cursor: text !important;
  }
  .hc-label-main {
    display: block !important;
    color: var(--navy) !important;
    font-size: 16px !important;
    font-weight: 950 !important;
    letter-spacing: -0.02em !important;
    line-height: 1.15 !important;
    user-select: text !important;
    -webkit-user-select: text !important;
  }
  .hc-label-sub {
    display: block !important;
    color: var(--muted) !important;
    font-size: 11px !important;
    font-weight: 750 !important;
    letter-spacing: 0 !important;
    line-height: 1.2 !important;
    margin-top: 3px !important;
    user-select: text !important;
    -webkit-user-select: text !important;
  }
  .hc-row {
    display: grid !important;
    grid-template-columns: 1fr 54px 1fr !important;
    gap: 6px !important;
    align-items: center !important;
    margin-bottom: 6px !important;
    user-select: text !important;
    -webkit-user-select: text !important;
  }
  .hc-col {
    min-height: 60px !important;
    padding: 6px 7px !important;
    border-radius: 13px !important;
    border: 1px solid var(--line) !important;
    background: radial-gradient(circle at 88% 10%, rgba(5, 94, 206, 0.10), transparent 34%), linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%) !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    text-align: left !important;
    user-select: text !important;
    -webkit-user-select: text !important;
  }
  .hc-col-label {
    display: block !important;
    color: var(--text-muted) !important;
    font-size: 11px !important;
    font-weight: 850 !important;
    margin-bottom: 4px !important;
    text-align: left !important;
    user-select: text !important;
    -webkit-user-select: text !important;
  }
  .hc-col-val {
    font-size: 21px !important;
    font-weight: 950 !important;
    letter-spacing: -.055em !important;
    line-height: 1 !important;
    white-space: nowrap !important;
    width: 100% !important;
    text-align: center !important;
    margin: 0 !important;
    padding: 0 !important;
    align-self: center !important;
    user-select: text !important;
    -webkit-user-select: text !important;
    cursor: text !important;
  }
  .hc-col-val.old {
    color: #B00020 !important;
    text-decoration: line-through !important;
    text-decoration-thickness: 3px !important;
  }
  .hc-col-val.new {
    color: var(--green-accent) !important;
  }
  .hc-arrow {
    width: 38px !important;
    height: 38px !important;
    border-radius: 50% !important;
    display: grid !important;
    place-items: center !important;
    align-self: center !important;
    justify-self: center !important;
    background: linear-gradient(145deg, var(--blue) 0%, #244FD1 100%) !important;
    color: #fff !important;
    box-shadow: 0 14px 30px rgba(5, 94, 206, 0.25) !important;
  }
  .hc-arrow svg {
    width: 16px !important;
    height: 16px !important;
    stroke-width: 2.6 !important;
  }
  .hc-saving {
    background: linear-gradient(180deg, #F3FFF9 0%, #FFFFFF 100%) !important;
    border: 1px solid #BDECD7 !important;
    border-radius: 14px !important;
    padding: 8px 10px !important;
    display: grid !important;
    grid-template-columns: auto minmax(0, 1fr) !important;
    align-items: center !important;
    gap: 8px !important;
    user-select: text !important;
    -webkit-user-select: text !important;
  }
  .hc-saving-label {
    font-size: 11px !important;
    color: var(--green) !important;
    font-weight: 950 !important;
    user-select: text !important;
    -webkit-user-select: text !important;
  }
  .hc-saving-value {
    font-size: 18px !important;
    font-weight: 950 !important;
    color: var(--green-accent) !important;
    letter-spacing: -.055em !important;
    white-space: nowrap !important;
    width: 100% !important;
    text-align: center !important;
    justify-self: center !important;
    user-select: text !important;
    -webkit-user-select: text !important;
    cursor: text !important;
  }
  .hc-col-val.old { color: #C00000 !important; }
  .hc-col-val.new, .hc-saving-value, #hcNova, #hcEco { color: #0a7c52 !important; }
  .ba-row-val.deduct { color: #C00000 !important; }
  .ba-col.after .ba-row-val.deduct, #baNova { color: #0a7c52 !important; }
  .ba-section .ba-title, .ba-section .ba-row-label, .ba-section .ba-total-label,
  .ba-section .ba-credit-label, .ba-section .ba-credit-note,
  .ba-section .ba-col.today .ba-row-val:not(.deduct),
  .ba-section .ba-col.today .ba-total-val,
  .ba-section .ba-col.today .ba-credit-val { color: #1a3d8f !important; }
  .ba-section .consigai-pocket-label, .ba-section .consigai-pocket-note,
  .ba-section .consigai-pocket-val:not(.positive):not(.negative):not(.value-positive):not(.value-negative),
  .ba-section .consigai-pocket-card.today .consigai-pocket-pill,
  .ba-section .consigai-pocket-card.today .consigai-pocket-icon,
  .ba-section .consigai-pocket-card.after .consigai-pocket-label { color: #1a3d8f !important; }
  .btn-cta { background: linear-gradient(160deg, #1e4aaa, #12307a) !important; }
  .hc-saving-label { font-size: 15px !important; }
  /* Desabilitar animações globais; manter apenas nos cards de oferta e minicards turbo */
  .main * { animation: none !important; transition: none !important; transform: none; }
  .offers-grid .offer-card { transition: all .18s ease !important; }
  .offer-card.turbo-offer .turbo-option { animation: turboMiniFloat 3.6s ease-in-out infinite !important; transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease, background .18s ease !important; }
  .offer-card.turbo-offer .turbo-options .turbo-option:nth-child(2) { animation-delay: .9s !important; }
  .consigai-offer-details-btn { animation: consigaiDetailsFloat 3.8s ease-in-out infinite !important; transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background-position .35s ease !important; }
  .ba-section .vc, .ba-section .popped, #baNova, #baSobra, #baCredito, #baPill {
    animation: none !important; transition: none !important; transform: none !important;
  }
  .sticky-cta .vc, .sticky-cta .popped, #ctaSaving {
    animation: none !important; transition: none !important; transform: none !important;
  }
  .offers-grid {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 14px !important;
    align-items: stretch !important;
  }
  @media (max-width: 760px) {
    .offers-grid {
      grid-template-columns: repeat(3, min(85vw, 340px)) !important;
      overflow-x: auto !important;
      scroll-snap-type: x mandatory !important;
      scroll-padding: 0 5vw !important;
      padding: 4px 5vw 8px !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: none !important;
    }
    .offers-grid::-webkit-scrollbar { display: none !important; }
  }
  .offer-card {
    background: #fff !important;
    border: 2px solid #DDE8F6 !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 28px !important;
    padding: 20px !important;
    height: auto !important;
    min-height: 300px !important;
    container-type: inline-size;
    position: relative !important;
    overflow: hidden !important;
    transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease !important;
    touch-action: manipulation !important;
    will-change: transform, box-shadow, border-color;
    user-select: none !important;
    cursor: pointer !important;
    scroll-snap-align: center;
  }
  .offer-card * { user-select: none !important; }
  .offer-card:hover:not(.selected):not(.active) {
    transform: translateY(-3px) !important;
    border-color: #b8cef5 !important;
    box-shadow: 0 16px 40px rgba(3,36,111,.11) !important;
  }
  .offer-card.selected, .offer-card.active {
    border: 2px solid rgba(0,231,255,.65) !important;
    background: linear-gradient(160deg, #f0faff 0%, #ffffff 60%) !important;
    box-shadow: 0 20px 56px rgba(5,94,206,.13), 0 0 0 4px rgba(0,231,255,.08) !important;
    transform: none !important;
  }
  .offer-card.selected::before, .offer-card.active::before {
    content: '' !important;
    display: block !important;
    position: absolute !important;
    left: 2px !important;
    right: 2px !important;
    top: 2px !important;
    height: 2px !important;
    background: linear-gradient(90deg, #055ECE, #00E7FF) !important;
    border-radius: 999px !important;
    pointer-events: none !important;
  }
  .offer-card:not(.turbo-offer):not(.equilibrio-offer):not(.folga-offer):not(.new-contract-offer):not(.refin-offer) .consigai-offer-card {
    height: 100%;
    display: grid;
    grid-template-rows: 48px auto 1fr auto;
    align-items: start;
    user-select: none;
  }
  .consigai-offer-head { margin-bottom: 0; min-height: 0; display: flex; align-items: flex-start; justify-content: flex-end; }
  .consigai-offer-title-row {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 10px; margin-bottom: 0; flex-wrap: nowrap;
    min-height: 48px;
  }
  .consigai-offer-title-row .consigai-offer-head-badges { margin-left: auto; justify-content: flex-end; }
  .consigai-offer-head-badges {
    display: inline-flex; align-items: center; gap: 6px; flex-wrap: nowrap; flex-shrink: 0;
  }
  .consigai-hidden-state-badge { display: none !important; }
  #badge0, #badge1, #badge2 { display: none !important; }
  .consigai-offer-head-badges .badge {
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 900; letter-spacing: .04em;
    line-height: 1; padding: 6px 10px; border-radius: 999px; white-space: nowrap;
  }
  .consigai-offer-badge-rec {
    display: inline-flex; align-items: center; gap: 5px;
    border-radius: 999px; padding: 6px 10px;
    background: linear-gradient(135deg, #fff3cf 0%, #ffe3a3 100%);
    border: 1px solid #f0d38a; color: #9a6a00;
    font-size: 10px; font-weight: 950; letter-spacing: .06em;
    text-transform: uppercase; line-height: 1; white-space: nowrap;
  }
  .consigai-offer-badge-rec::before { content: '★'; font-size: 14px !important; font-weight: 900; line-height: 1; }
  .consigai-offer-pill {
    display: block; align-items: center; gap: 6px; align-self: flex-start;
    width: auto; max-width: max-content; border-radius: 999px; padding: 8px 13px;
    background: #e8eeff; border: 1px solid #c2d0f8;
    color: #1a3d8f; font-size: 11px; font-weight: 900;
    letter-spacing: .05em; text-transform: uppercase; line-height: 1;
    white-space: nowrap; margin: 0; flex-shrink: 0;
  }
  .offer-card.selected .consigai-offer-pill {
    background: #1a3d8f; border-color: #1a3d8f; color: #fff;
    box-shadow: 0 8px 18px rgba(35,80,200,.18);
  }
  .consigai-offer-lines {
    display: grid; gap: 6px; margin-top: 0; margin-bottom: 0;
    align-content: start; min-height: 142px;
  }
  .consigai-offer-pretext {
    font-size: 24px; line-height: 1.08; letter-spacing: -.03em;
    color: #1a3d8f; font-weight: 850; margin-bottom: 10px;
  }
  .consigai-offer-lines .consigai-offer-line:first-of-type { min-height: 58px; align-content: start; }
  .consigai-offer-line { display: grid; gap: 3px; }
  .consigai-offer-line-main { font-size: 24px; font-weight: 850; line-height: 1.08; letter-spacing: -.03em; }
  .consigai-offer-line-main.blue { color: #1a3d8f; }
  .consigai-offer-line-main.green { color: #ec7000; }
  .consigai-offer-line-main.brand-green { color: #0a7c52; }
  .consigai-offer-word-orange { color: #0a7c52; }
  .consigai-offer-value-green { color: #0a7c52; }
  .consigai-offer-word-estimada {
    color: #7a8db8; font-size: .58em; font-weight: 700;
    letter-spacing: 0; vertical-align: baseline; margin-left: 2px;
  }
  .consigai-offer-total-stack { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 4px; }
  .consigai-offer-total-label {
    display: inline-flex; align-items: baseline; gap: 2px;
    white-space: nowrap; line-height: 1.06;
    font-size: clamp(12px, 6.2cqi, 24px); max-inline-size: 100%;
  }
  .consigai-offer-total-label .consigai-offer-word-orange { white-space: nowrap; overflow: hidden; text-overflow: clip; }
  .consigai-offer-total-stack .consigai-offer-value-green { display: block; }
  .consigai-offer-line-helper { font-size: 11px; color: #1a3d8f; font-weight: 750; line-height: 1; }
  .consigai-offer-line-helper.spacer { color: transparent; }
  .consigai-offer-or {
    display: inline-flex; align-items: center; justify-content: center;
    width: fit-content; font-size: 13px; color: #1a3d8f;
    font-weight: 850; line-height: 1; letter-spacing: -.01em;
    border-radius: 999px; background: #e8eeff; border: 1px solid #c2d0f8;
    padding: 5px 8px; white-space: nowrap; margin: 2px 0;
  }
  .offer-card.turbo-offer {
    border: 2px solid transparent !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 28px !important;
    padding: 20px 20px 16px !important;
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  .offer-card.turbo-offer.selected,
  .offer-card.turbo-offer.active {
    border: 2px solid rgba(0,231,255,.62) !important;
    box-shadow: 0 24px 60px rgba(3,36,111,.12) !important;
  }
  .offer-card.turbo-offer.selected::before,
  .offer-card.turbo-offer.active::before {
    display: none !important;
    content: none !important;
  }
  .offer-card.turbo-offer .consigai-offer-card {
    gap: 0 !important;
    min-height: 0 !important;
  }
  .offer-card.turbo-offer .turbo-module-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid #dde8f6;
  }
  .offer-card.turbo-offer .turbo-module-title {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
  }
  .offer-card.turbo-offer .turbo-module-logo {
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    display: block;
    object-fit: contain;
  }
  .offer-card.turbo-offer .turbo-module-title strong {
    display: block;
    color: #03246F;
    font-size: 16px;
    font-weight: 950;
    letter-spacing: -.02em;
    line-height: 1.15;
  }
  .offer-card.turbo-offer .turbo-module-title span {
    display: block;
    margin-top: 2px;
    color: #64748B;
    font-size: 11px;
    font-weight: 750;
    line-height: 1.2;
  }
  .offer-card.turbo-offer .turbo-body {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-top: 12px;
    min-height: 0;
    flex: 1 1 auto;
  }
  .offer-card.turbo-offer .turbo-heading {
    margin-top: 0;
    font-size: 20px;
    line-height: 1.05;
    letter-spacing: -.04em;
    font-weight: 950;
    display: flex;
    flex-wrap: wrap;
    gap: 0 .28em;
    align-items: baseline;
  }
  .offer-card.turbo-offer .turbo-heading-blue {
    color: #03246F;
  }
  .offer-card.turbo-offer .turbo-heading-green {
    color: #007A52;
  }
  .offer-card.turbo-offer .turbo-intro {
    margin-top: 6px;
    color: #64748B;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 650;
  }
  .offer-card.turbo-offer .turbo-options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
    margin-top: 12px;
  }
  .offer-card.turbo-offer .turbo-option {
    text-align: left;
    min-height: 84px;
    padding: 10px 10px 9px;
    border-radius: 14px;
    border: 1px solid #BDECD7;
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 122, 82, 0.12), transparent 35%),
      linear-gradient(180deg, #F3FFF9 0%, #FFFFFF 100%);
    cursor: pointer;
    transition: 160ms ease;
    appearance: none;
    -webkit-appearance: none;
    box-shadow: none;
  }
  .offer-card.turbo-offer .turbo-option {
    animation: turboMiniFloat 3.6s ease-in-out infinite;
  }
  .offer-card.turbo-offer .turbo-options .turbo-option:nth-child(2) {
    animation-delay: .9s;
  }
  .offer-card.turbo-offer .turbo-option:hover,
  .offer-card.turbo-offer .consigai-offer-mini-card:hover {
    transform: translateY(-3px) !important;
    border-color: #0a7c52 !important;
    box-shadow: 0 10px 24px rgba(0, 122, 82, 0.22) !important;
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 122, 82, 0.20), transparent 35%),
      linear-gradient(180deg, #E8FFF3 0%, #FFFFFF 100%) !important;
  }
  .offer-card.turbo-offer .turbo-option.active,
  .offer-card.turbo-offer .turbo-option.is-selected {
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 122, 82, 0.12), transparent 35%),
      linear-gradient(180deg, #F3FFF9 0%, #FFFFFF 100%);
    border-color: #BDECD7;
    box-shadow: none;
    transform: none;
  }
  .offer-card.turbo-offer:not(.selected):not(.active) .turbo-option.active,
  .offer-card.turbo-offer:not(.selected):not(.active) .turbo-option.is-selected {
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 122, 82, 0.12), transparent 35%),
      linear-gradient(180deg, #F3FFF9 0%, #FFFFFF 100%);
    border-color: #BDECD7;
    box-shadow: none;
    transform: none;
  }
  .offer-card.turbo-offer:not(.selected):not(.active) .turbo-option.active:hover,
  .offer-card.turbo-offer:not(.selected):not(.active) .turbo-option.is-selected:hover {
    box-shadow: none;
  }
  .offer-card.turbo-offer .turbo-option .option-label {
    display: block;
    color: #03246F;
    font-size: 11px;
    font-weight: 900;
    line-height: 1.15;
  }
  .offer-card.turbo-offer .turbo-option strong {
    display: block;
    margin-top: 7px;
    color: #007A52;
    font-size: 18px;
    line-height: 1.1;
    font-weight: 950;
    letter-spacing: -.055em;
    word-break: break-word;
  }
  .offer-card.turbo-offer .turbo-option strong .turbo-suffix {
    font-size: 0.8em;
    font-weight: 950;
    letter-spacing: -.03em;
    vertical-align: baseline;
  }
  .offer-card.turbo-offer .turbo-option small {
    display: block;
    margin-top: 6px;
    color: #64748B;
    font-size: 10px;
    line-height: 1.2;
    font-weight: 700;
  }
  .offer-card.turbo-offer .turbo-note {
    display: flex !important;
    gap: 10px;
    align-items: flex-start;
    margin-top: 10px;
    padding: 10px 11px;
    border-radius: 12px;
    background: #E9F8F1;
    color: #007A52;
    font-size: 11px;
    line-height: 1.25;
    font-weight: 750;
    min-height: 0;
  }
  .offer-card.turbo-offer .turbo-note p {
    margin: 0;
  }
  .offer-card.turbo-offer .turbo-note .note-icon {
    width: 21px;
    height: 21px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #007A52;
    color: white;
    font-size: 12px;
    font-weight: 950;
  }
  .offer-card.turbo-offer .turbo-actions {
    margin-top: 10px;
  }
  .offer-card.turbo-offer .turbo-details-button {
    width: 100% !important;
    min-height: auto;
    border-radius: 14px !important;
    border: 1px solid #BFD4F6 !important;
    background: #F4F8FF !important;
    color: #055ECE !important;
    font-size: 13px !important;
    font-weight: 900 !important;
    cursor: pointer !important;
    transition: 160ms ease !important;
    box-shadow: none !important;
  }
  .offer-card.turbo-offer .turbo-details-button:hover {
    background: #EAF4FF !important;
    border-color: #055ECE !important;
  }
  .offer-card.turbo-offer .consigai-offer-details-btn::after {
    display: none !important;
  }
  .offer-card.turbo-offer .consigai-offer-details-btn {
    animation: none !important;
  }
  .offer-card.folga-offer {
    border: 2px solid transparent !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 28px !important;
    padding: 20px 20px 16px !important;
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  .offer-card.folga-offer.selected,
  .offer-card.folga-offer.active {
    border: 2px solid rgba(0,231,255,.62) !important;
    box-shadow: 0 24px 60px rgba(3,36,111,.12) !important;
  }
  .offer-card.folga-offer.selected::before,
  .offer-card.folga-offer.active::before {
    display: none !important;
    content: none !important;
  }
  .offer-card.folga-offer .consigai-offer-card {
    gap: 0 !important;
    min-height: 0 !important;
  }
  .offer-card.folga-offer .folga-shell {
    gap: 0 !important;
    min-height: 0 !important;
  }
  .offer-card.folga-offer .folga-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid #dde8f6;
  }
  .offer-card.folga-offer .folga-title {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
  }
  .offer-card.folga-offer .folga-icon {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    background: transparent;
    box-shadow: none;
    color: white;
    flex: 0 0 auto;
  }
  .offer-card.folga-offer .folga-icon svg {
    width: 34px;
    height: 34px;
    display: block;
  }
  .offer-card.folga-offer .folga-title strong {
    display: block;
    color: #03246F;
    font-size: 16px;
    font-weight: 950;
    letter-spacing: -.02em;
    line-height: 1.15;
  }
  .offer-card.folga-offer .folga-title span {
    display: block;
    margin-top: 2px;
    color: #64748B;
    font-size: 11px;
    font-weight: 750;
    line-height: 1.2;
  }
  .offer-card.folga-offer .folga-body {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-top: 12px;
    min-height: 0;
    flex: 1 1 auto;
  }
  .offer-card.folga-offer .folga-heading {
    margin: 0;
    color: #03246F;
    font-size: 18px;
    line-height: 1.05;
    letter-spacing: -.045em;
    font-weight: 950;
    display: flex;
    flex-wrap: nowrap;
    gap: 0 .22em;
    align-items: baseline;
    white-space: nowrap;
  }
  .offer-card.folga-offer .folga-heading span {
    color: #007A52;
  }
  .offer-card.folga-offer .folga-intro {
    margin-top: 6px;
    color: #64748B;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 650;
  }
  .offer-card.folga-offer .folga-highlight-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
    margin-top: 12px;
  }
  .offer-card.folga-offer .folga-highlight {
    text-align: left;
    min-height: 84px;
    padding: 10px 10px 9px;
    border-radius: 14px;
    border: 1px solid #DDE8F6;
    background: #F8FBFF;
  }
  .offer-card.folga-offer .folga-highlight.money {
    background:
      radial-gradient(circle at 88% 10%, rgba(5, 94, 206, 0.12), transparent 34%),
      linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%);
  }
  .offer-card.folga-offer .folga-highlight.installment {
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 122, 82, 0.13), transparent 34%),
      linear-gradient(180deg, #F3FFF9 0%, #FFFFFF 100%);
    border-color: #BDECD7;
  }
  .offer-card.folga-offer .folga-highlight small {
    display: block;
    color: #03246F;
    font-size: 11px;
    line-height: 1.15;
    font-weight: 800;
  }
  .offer-card.folga-offer .folga-highlight strong {
    display: block;
    margin-top: 7px;
    color: #03246F;
    font-size: 18px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -.055em;
  }
  .offer-card.folga-offer .folga-highlight.installment strong {
    color: #007A52;
  }
  .offer-card.folga-offer .folga-highlight span {
    display: block;
    margin-top: 6px;
    color: #64748B;
    font-size: 10px;
    line-height: 1.25;
    font-weight: 700;
  }
  .offer-card.folga-offer .folga-note {
    display: flex !important;
    gap: 10px;
    align-items: flex-start;
    margin-top: 10px;
    padding: 10px 11px;
    border-radius: 12px;
    background: #E9F8F1;
    color: #007A52;
    font-size: 11px;
    line-height: 1.25;
    font-weight: 750;
    min-height: 0;
  }
  .offer-card.folga-offer .folga-note p {
    margin: 0;
  }
  .offer-card.folga-offer .folga-note-icon {
    width: 21px;
    height: 21px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #007A52;
    color: white;
    font-size: 12px;
    font-weight: 950;
  }
  .offer-card.folga-offer .folga-actions {
    margin-top: 10px;
  }
  .offer-card.folga-offer .folga-details-button {
    width: 100% !important;
    min-height: auto;
    border-radius: 14px !important;
    border: 1px solid #BFD4F6 !important;
    background: #F4F8FF !important;
    color: #055ECE !important;
    font-size: 13px !important;
    font-weight: 900 !important;
    cursor: pointer !important;
    transition: 160ms ease !important;
    box-shadow: none !important;
  }
  .offer-card.folga-offer .folga-details-button:hover {
    background: #EAF4FF !important;
    border-color: #055ECE !important;
  }
  .consigai-offer-mini-grid {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;
  }
  .consigai-offer-mini-card {
    display: grid; gap: 6px; padding: 12px 12px;
    border-radius: 12px; border: 1px solid #d7e2ff;
    background: #f6f9ff; min-width: 0;
  }
  .offer-card.selected .consigai-offer-mini-card { background: #edf3ff; border-color: #c2d0f8; }
  .consigai-offer-mini-label { font-size: 13px; line-height: 1.15; color: #1a3d8f; font-weight: 800; }
  .offer-card.turbo-offer .consigai-offer-mini-label {
    font-size: 13px; line-height: 1.22; letter-spacing: 0;
    overflow-wrap: anywhere; word-break: normal; text-wrap: balance;
    min-height: 26px; display: block;
  }
  .consigai-offer-mini-value {
    font-size: 24px; line-height: 1; color: #0a7c52;
    font-weight: 900; letter-spacing: -.03em; white-space: nowrap;
  }
  .offer-card.turbo-offer .consigai-offer-mini-grid { gap: 8px; margin-top: 18px !important; }
  .offer-card.turbo-offer .consigai-offer-mini-card {
    gap: 4px; padding: 10px 10px; align-content: start; overflow: hidden;
    cursor: pointer;
    border-color: #BDECD7 !important;
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 122, 82, 0.12), transparent 35%),
      linear-gradient(180deg, #F3FFF9 0%, #FFFFFF 100%) !important;
    box-shadow: none !important;
    transition: border-color .16s ease, box-shadow .16s ease, background .16s ease;
  }
  .offer-card.turbo-offer .consigai-offer-mini-value {
    font-size: clamp(18px, 2.05vw, 22px); line-height: .98;
    letter-spacing: -.015em; min-width: 0; color: #0a7c52;
  }
  .offer-card.simple-offer .consigai-offer-mini-grid {
    grid-template-columns: minmax(0, 1fr); gap: 6px;
    margin-top: auto !important; margin-bottom: 6px;
  }
  .offer-card.simple-offer .consigai-offer-lines { min-height: 0 !important; margin-bottom: 6px; }
  .offer-card.simple-offer .consigai-offer-mini-card {
    display: flex; justify-content: space-between; align-items: center;
    gap: 8px; padding: 7px 8px; overflow: hidden; cursor: default;
    border-color: #dbe6f7; background: #f7faff; box-shadow: none; transition: none;
  }
  .offer-card.simple-offer .consigai-offer-mini-label {
    font-size: 13px; line-height: 1.15; letter-spacing: 0; min-height: 0; display: inline-block;
  }
  .offer-card.simple-offer .consigai-offer-mini-value {
    font-size: clamp(18px, 2.05vw, 22px); line-height: .98;
    letter-spacing: -.015em; min-width: 0; color: #0a7c52;
    margin-left: auto; white-space: nowrap;
  }
  .offer-card.simple-offer .consigai-offer-note-sub { min-height: 20px; line-height: 1.25; }
  .offer-card.turbo-offer.selected .consigai-offer-mini-card {
    border-color: #BDECD7 !important;
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 122, 82, 0.12), transparent 35%),
      linear-gradient(180deg, #F3FFF9 0%, #FFFFFF 100%) !important;
    box-shadow: none;
    transition: border-color .16s ease, box-shadow .16s ease, background .16s ease;
  }
  .offer-card.turbo-offer .consigai-offer-mini-label { color: #1a3d8f; }
  .offer-card.turbo-offer.selected .consigai-offer-mini-card.is-selected,
  .offer-card.turbo-offer.selected .turbo-option.is-selected,
  .offer-card.turbo-offer.selected .turbo-option.active {
    border: 2px solid rgba(0,231,255,.65) !important;
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 122, 82, 0.12), transparent 35%),
      linear-gradient(180deg, #F3FFF9 0%, #FFFFFF 100%) !important;
    box-shadow: 0 0 0 3px rgba(0,231,255,.10) !important;
    transform: none !important;
  }
  .offer-card.turbo-offer.selected .consigai-offer-mini-card.is-selected .consigai-offer-mini-label {
    color: #1a3d8f !important;
  }
  .offer-card.turbo-offer.selected .consigai-offer-mini-card.is-selected .consigai-offer-mini-value {
    color: #0a7c52 !important;
  }
  .offer-card.new-contract-offer {
    border: 2px solid transparent !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 28px !important;
    padding: 20px 20px 16px !important;
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  .offer-card.new-contract-offer.selected,
  .offer-card.new-contract-offer.active {
    border: 2px solid rgba(0,231,255,.62) !important;
    box-shadow: 0 24px 60px rgba(3,36,111,.12) !important;
  }
  .offer-card.new-contract-offer.selected::before,
  .offer-card.new-contract-offer.active::before {
    display: none !important;
    content: none !important;
  }
  .offer-card.new-contract-offer .new-contract-shell {
    gap: 0 !important;
    min-height: 0 !important;
  }
  .offer-card.new-contract-offer .new-contract-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #DDE8F6;
  }
  .offer-card.new-contract-offer .new-contract-title {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
  }
  .offer-card.new-contract-offer .new-contract-icon {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    background: transparent;
    box-shadow: none;
    color: white;
    flex: 0 0 auto;
  }
  .offer-card.new-contract-offer .new-contract-icon svg {
    width: 37px;
    height: 37px;
    display: block;
  }
  .offer-card.new-contract-offer .new-contract-title strong {
    display: block;
    color: #03246F;
    font-size: 16px;
    font-weight: 950;
    letter-spacing: -.02em;
    line-height: 1.15;
  }
  .offer-card.new-contract-offer .new-contract-title span {
    display: block;
    margin-top: 2px;
    color: #64748B;
    font-size: 11px;
    font-weight: 750;
    line-height: 1.2;
  }
  .offer-card.new-contract-offer .new-contract-body {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-top: 10px;
    min-height: 0;
    flex: 1 1 auto;
  }
  .offer-card.new-contract-offer .new-contract-heading {
    margin: 0;
    color: #03246F;
    font-size: 20px;
    line-height: 1.05;
    letter-spacing: -.045em;
    font-weight: 950;
  }
  .offer-card.new-contract-offer .new-contract-heading span {
    color: #055ECE;
  }
  .offer-card.new-contract-offer .new-contract-intro {
    margin-top: 6px;
    color: #64748B;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 650;
  }
  .offer-card.new-contract-offer .new-contract-highlight {
    margin-top: 10px;
    padding: 10px 11px;
    border-radius: 18px;
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 231, 255, 0.15), transparent 34%),
      linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%);
    border: 1px solid #DDE8F6;
  }
  .offer-card.new-contract-offer .new-contract-highlight small {
    display: block;
    color: #64748B;
    font-size: 12px;
    font-weight: 800;
  }
  .offer-card.new-contract-offer .new-contract-highlight strong {
    display: block;
    margin-top: 4px;
    color: #03246F;
    font-size: 26px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -.055em;
  }
  .offer-card.new-contract-offer .new-contract-highlight span {
    display: block;
    margin-top: 4px;
    color: #055ECE;
    font-size: 11px;
    font-weight: 850;
  }
  .offer-card.new-contract-offer .new-contract-note {
    display: flex !important;
    gap: 10px;
    align-items: flex-start;
    margin-top: 10px;
    padding: 10px 11px;
    border-radius: 14px;
    background: #F4F8FF;
    border: 1px solid #DDE8F6;
    color: #03246F;
    font-size: 10px;
    line-height: 1.35;
    font-weight: 750;
    min-height: 0;
  }
  .offer-card.new-contract-offer .new-contract-note p {
    margin: 0;
  }
  .offer-card.new-contract-offer .new-contract-note-icon {
    width: 21px;
    height: 21px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #055ECE;
    color: white;
    font-size: 12px;
    font-weight: 950;
  }
  .offer-card.new-contract-offer .new-contract-actions {
    margin-top: 10px;
  }
  .offer-card.new-contract-offer .new-contract-details-button {
    min-height: 40px;
    border-radius: 14px !important;
    border: 1px solid #BFD4F6 !important;
    background: #F4F8FF !important;
    color: #055ECE !important;
    font-size: 13px !important;
    font-weight: 900 !important;
    box-shadow: none !important;
  }
  .offer-card.new-contract-offer .new-contract-details-button:hover {
    background: #EAF4FF !important;
    border-color: #055ECE !important;
  }
  .offer-card.equilibrio-offer {
    border: 2px solid transparent !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 28px !important;
    padding: 20px 20px 16px !important;
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  .offer-card.equilibrio-offer.selected,
  .offer-card.equilibrio-offer.active {
    border: 2px solid rgba(0,231,255,.68) !important;
    box-shadow: 0 24px 60px rgba(3,36,111,.12) !important;
  }
  .offer-card.equilibrio-offer.selected::before,
  .offer-card.equilibrio-offer.active::before {
    display: none !important;
    content: none !important;
  }
  .offer-card.equilibrio-offer .equilibrio-shell {
    gap: 0 !important;
    min-height: 0 !important;
  }
  .offer-card.equilibrio-offer .equilibrio-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid #DDE8F6;
  }
  .offer-card.equilibrio-offer .equilibrio-title {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
  }
  .offer-card.equilibrio-offer .equilibrio-icon {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    background: transparent;
    box-shadow: none;
    color: white;
    flex: 0 0 auto;
    overflow: visible;
  }
  .offer-card.equilibrio-offer .equilibrio-icon svg {
    width: 34px;
    height: 34px;
    display: block;
    transform: scale(1.18);
    transform-origin: center;
    stroke-width: 2.4;
  }
  .offer-card.equilibrio-offer .equilibrio-title strong {
    display: block;
    color: #03246F;
    font-size: 16px;
    font-weight: 950;
    letter-spacing: -.02em;
    line-height: 1.15;
  }
  .offer-card.equilibrio-offer .equilibrio-title span {
    display: block;
    margin-top: 2px;
    color: #64748B;
    font-size: 11px;
    font-weight: 750;
    line-height: 1.2;
  }
  .offer-card.equilibrio-offer .equilibrio-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    border-radius: 999px;
    background: #FFF7DD;
    color: #765200;
    border: 1px solid rgba(246,196,83,.65);
    font-size: 11px;
    font-weight: 900;
    white-space: nowrap;
  }
  .offer-card.equilibrio-offer .equilibrio-body {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-top: 12px;
    min-height: 0;
    flex: 1 1 auto;
  }
  .offer-card.equilibrio-offer .equilibrio-heading {
    margin: 0;
    color: #03246F;
    font-size: 20px;
    line-height: 1.05;
    letter-spacing: -.045em;
    font-weight: 950;
  }
  .offer-card.equilibrio-offer .equilibrio-heading span {
    color: #007A52;
  }
  .offer-card.equilibrio-offer .equilibrio-intro {
    margin-top: 6px;
    color: #64748B;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 650;
  }
  .offer-card.equilibrio-offer .equilibrio-benefit-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-top: 12px;
  }
  .offer-card.equilibrio-offer .equilibrio-benefit {
    min-height: 84px;
    padding: 10px 10px 9px;
    border-radius: 14px;
    border: 1px solid #DDE8F6;
    background: #F8FBFF;
  }
  .offer-card.equilibrio-offer .equilibrio-benefit.money {
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 231, 255, 0.14), transparent 35%),
      linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%);
  }
  .offer-card.equilibrio-offer .equilibrio-benefit.economy {
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 122, 82, 0.12), transparent 35%),
      linear-gradient(180deg, #F3FFF9 0%, #FFFFFF 100%);
    border-color: #BDECD7;
  }
  .offer-card.equilibrio-offer .equilibrio-benefit-label {
    display: block;
    color: #03246F;
    font-size: 11px;
    font-weight: 900;
  }
  .offer-card.equilibrio-offer .equilibrio-benefit strong {
    display: block;
    margin-top: 7px;
    font-size: 18px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -.055em;
  }
  .offer-card.equilibrio-offer .equilibrio-benefit.money strong {
    color: #03246F;
  }
  .offer-card.equilibrio-offer .equilibrio-benefit.economy strong {
    color: #007A52;
  }
  .offer-card.equilibrio-offer .equilibrio-benefit small {
    display: block;
    margin-top: 6px;
    color: #64748B;
    font-size: 10px;
    line-height: 1.25;
    font-weight: 700;
  }
  .offer-card.equilibrio-offer .equilibrio-note {
    display: flex !important;
    gap: 10px;
    align-items: flex-start;
    margin-top: 10px;
    padding: 10px 11px;
    border-radius: 12px;
    background: #E9F8F1;
    color: #007A52;
    font-size: 11px;
    line-height: 1.35;
    font-weight: 750;
    min-height: 0;
  }
  .offer-card.equilibrio-offer .equilibrio-note p {
    margin: 0;
  }
  .offer-card.equilibrio-offer .equilibrio-note-icon {
    width: 21px;
    height: 21px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #007A52;
    color: white;
    font-size: 12px;
    font-weight: 950;
  }
  .offer-card.equilibrio-offer .equilibrio-actions {
    margin-top: 10px;
  }
  .offer-card.equilibrio-offer .equilibrio-details-button {
    min-height: auto;
    border-radius: 14px !important;
    border: 1px solid #BFD4F6 !important;
    background: #F4F8FF !important;
    color: #055ECE !important;
    font-size: 13px !important;
    font-weight: 900 !important;
    box-shadow: none !important;
  }
  .offer-card.equilibrio-offer .equilibrio-details-button:hover {
    background: #EAF4FF !important;
    border-color: #055ECE !important;
  }
  .offer-card.refin-offer {
    border: 2px solid transparent !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 28px !important;
    padding: 20px 20px 16px !important;
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  .offer-card.refin-offer.selected,
  .offer-card.refin-offer.active {
    border: 2px solid rgba(0,231,255,.62) !important;
    box-shadow: 0 24px 60px rgba(3,36,111,.12) !important;
  }
  .offer-card.refin-offer.selected::before,
  .offer-card.refin-offer.active::before {
    display: none !important;
    content: none !important;
  }
  .offer-card.refin-offer .refin-shell {
    gap: 0 !important;
    min-height: 0 !important;
  }
  .offer-card.refin-offer .refin-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #DDE8F6;
  }
  .offer-card.refin-offer .refin-title {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
  }
  .offer-card.refin-offer .refin-icon {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    background: transparent;
    box-shadow: none;
    color: white;
    flex: 0 0 auto;
  }
  .offer-card.refin-offer .refin-icon svg {
    width: 37px;
    height: 37px;
    display: block;
  }
  .offer-card.refin-offer .refin-title strong {
    display: block;
    color: #03246F;
    font-size: 16px;
    font-weight: 950;
    letter-spacing: -.02em;
    line-height: 1.15;
  }
  .offer-card.refin-offer .refin-title span {
    display: block;
    margin-top: 2px;
    color: #64748B;
    font-size: 11px;
    font-weight: 750;
    line-height: 1.2;
  }
  .offer-card.refin-offer .refin-body {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-top: 10px;
    min-height: 0;
    flex: 1 1 auto;
  }
  .offer-card.refin-offer .refin-heading {
    margin: 0;
    color: #03246F;
    font-size: 20px;
    line-height: 1.05;
    letter-spacing: -.045em;
    font-weight: 950;
  }
  .offer-card.refin-offer .refin-heading .refin-heading-light {
    color: #055ECE;
  }
  .offer-card.refin-offer .refin-intro {
    margin-top: 6px;
    color: #64748B;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 650;
  }
  .offer-card.refin-offer .refin-highlight {
    margin-top: 10px;
    padding: 10px 11px;
    border-radius: 18px;
    background:
      radial-gradient(circle at 88% 10%, rgba(0, 231, 255, 0.15), transparent 34%),
      linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%);
    border: 1px solid #DDE8F6;
  }
  .offer-card.refin-offer .refin-highlight small {
    display: block;
    color: #64748B;
    font-size: 12px;
    font-weight: 800;
  }
  .offer-card.refin-offer .refin-highlight strong {
    display: block;
    margin-top: 4px;
    color: #03246F;
    font-size: 26px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -.055em;
  }
  .offer-card.refin-offer .refin-highlight span {
    display: block;
    margin-top: 4px;
    color: #055ECE;
    font-size: 11px;
    font-weight: 850;
  }
  .offer-card.refin-offer .refin-note {
    display: flex !important;
    gap: 10px;
    align-items: flex-start;
    margin-top: 10px;
    padding: 10px 11px;
    border-radius: 14px;
    background: #F4F8FF;
    border: 1px solid #DDE8F6;
    color: #03246F;
    font-size: 10px;
    line-height: 1.35;
    font-weight: 750;
    min-height: 0;
  }
  .offer-card.refin-offer .refin-note p {
    margin: 0;
  }
  .offer-card.refin-offer .refin-note-icon {
    width: 21px;
    height: 21px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #055ECE;
    color: white;
    font-size: 12px;
    font-weight: 950;
  }
  .offer-card.refin-offer .refin-actions {
    margin-top: 10px;
  }
  .offer-card.refin-offer .refin-details-button {
    min-height: 40px;
    border-radius: 14px !important;
    border: 1px solid #BFD4F6 !important;
    background: #F4F8FF !important;
    color: #055ECE !important;
    font-size: 13px !important;
    font-weight: 900 !important;
    box-shadow: none !important;
  }
  .offer-card.refin-offer .refin-details-button:hover {
    background: #EAF4FF !important;
    border-color: #055ECE !important;
  }
  .consigai-offer-note { display: block; margin-top: auto; min-height: 0; }
  .consigai-offer-note-dot { display: none; }
  .consigai-offer-note-text { display: block; }
  .consigai-offer-note-title { display: none; }
  .consigai-offer-note-sub {
    color: #7a8db8; font-weight: 400; font-size: clamp(10px, 0.95vw, 12px);
    line-height: 1.35; display: block; min-height: 20px;
  }
  .consigai-offer-actions {
    margin-top: 16px;
  }
  .generic-actions {
    margin-top: 12px;
  }
  .consigai-offer-details-btn {
    width: 100% !important;
    border-radius: 14px !important;
    border: 1px solid rgba(35,80,200,.20) !important;
    background: linear-gradient(135deg, #f8fbff 0%, #e9f1ff 50%, #f8fbff 100%) !important;
    background-size: 220% 100% !important;
    background-position: 0% 0% !important;
    color: #2350c8 !important;
    padding: 12px 14px !important;
    font-size: clamp(12px, 1vw, 13px) !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    font-family: inherit !important;
    box-shadow: 0 1px 0 rgba(255,255,255,.72) inset, 0 8px 18px rgba(35,80,200,.08) !important;
    position: relative !important;
    overflow: hidden !important;
    transform: translateY(0) !important;
    transition:
      transform .18s ease,
      box-shadow .18s ease,
      border-color .18s ease,
      background-position .35s ease,
      filter .18s ease !important;
    animation: consigaiDetailsFloat 3.8s ease-in-out infinite;
  }
  .consigai-offer-pill { font-size: clamp(10px, 0.9vw, 11px) !important; }
  .consigai-offer-line-main { font-size: clamp(18px, 1.8vw, 24px) !important; }
  .consigai-offer-line-helper { font-size: clamp(10px, 0.95vw, 11px) !important; }
  .consigai-offer-mini-label { font-size: clamp(11px, 1vw, 13px) !important; }
  .consigai-offer-mini-value { font-size: clamp(18px, 1.9vw, 22px) !important; white-space: nowrap !important; }
  .consigai-offer-details-btn:hover {
    background-position: 100% 0% !important;
    border-color: rgba(35,80,200,.34) !important;
    box-shadow: 0 2px 0 rgba(255,255,255,.76) inset, 0 12px 24px rgba(35,80,200,.12) !important;
    transform: translateY(-2px) scale(1.01) !important;
    filter: saturate(1.05);
  }
  .consigai-offer-details-btn:active {
    transform: translateY(0) scale(.985) !important;
    box-shadow: 0 1px 0 rgba(255,255,255,.66) inset, 0 6px 14px rgba(35,80,200,.10) !important;
  }
  .consigai-offer-details-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,.55) 45%, transparent 60%);
    transform: translateX(-120%) skewX(-18deg);
    opacity: 0;
    pointer-events: none;
  }
  .consigai-offer-details-btn:hover::after {
    opacity: 1;
    animation: consigaiDetailsShine .9s ease forwards;
  }
  .consigai-offer-metric {
    margin-top: 10px; display: flex; justify-content: space-between;
    align-items: center; border-radius: 12px; background: #f8faff;
    border: 1px solid #e4eaf8; padding: 12px;
  }
  .offer-card.selected .consigai-offer-metric {
    background: #f2f6ff; border-color: #c2d0f8;
    box-shadow: 0 8px 18px rgba(35,80,200,.08);
  }
  .consigai-offer-metric-label { font-size: 15px; color: #1a3d8f; font-weight: 800; }
  .consigai-offer-metric-value {
    font-size: 16px; color: #1a3d8f; font-weight: 900;
    letter-spacing: -.02em; white-space: nowrap;
  }
  .consigai-offer-metric-value.green { color: #0a7c52; }

  @media (min-width: 1081px) {
    .offer-card.equilibrio-offer .equilibrio-body,
    .offer-card.folga-offer .folga-body,
    .offer-card.turbo-offer .turbo-body {
      display: grid !important;
      grid-template-rows: 24px 42px 84px 1fr auto !important;
      align-items: start !important;
      gap: 0 !important;
      padding-top: 12px !important;
    }
    .offer-card.turbo-offer .turbo-body {
      padding-top: 13px !important;
    }
    .offer-card.equilibrio-offer .equilibrio-heading,
    .offer-card.folga-offer .folga-heading,
    .offer-card.turbo-offer .turbo-heading {
      min-height: 24px !important;
    }
    .offer-card.equilibrio-offer .equilibrio-intro,
    .offer-card.folga-offer .folga-intro,
    .offer-card.turbo-offer .turbo-intro {
      margin-top: 6px !important;
      min-height: 32px !important;
    }
    .offer-card.equilibrio-offer .equilibrio-benefit-grid,
    .offer-card.folga-offer .folga-highlight-grid,
    .offer-card.turbo-offer .turbo-options {
      margin-top: 0 !important;
      min-height: 84px !important;
    }
  }

  @keyframes consigaiDetailsFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1px); }
  }
  @keyframes turboMiniFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
  @keyframes consigaiDetailsShine {
    0% { transform: translateX(-120%) skewX(-18deg); }
    100% { transform: translateX(120%) skewX(-18deg); }
  }
  @media (max-width: 1080px) {
    .offers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  }
  @media (max-width: 760px) {
    .offers-grid {
      display: flex !important;
      gap: 10px !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      scroll-snap-type: x mandatory !important;
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior-x: contain !important;
      padding: 2px 0 10px !important;
      margin: 0 -12px 10px !important;
      padding-left: 12px !important;
      padding-right: 12px !important;
      scrollbar-width: none !important;
    }
    .offers-grid::-webkit-scrollbar { display: none !important; }
    .offer-card {
      flex: 0 0 min(84vw, 340px) !important;
      width: min(84vw, 340px) !important;
      min-height: auto !important;
      padding: 14px !important;
      scroll-snap-align: start !important;
    }
    .offer-card.turbo-offer {
      height: auto !important;
      min-height: 0 !important;
      padding: 18px 18px 14px !important;
    }
    .offer-card.turbo-offer .turbo-module-header {
      align-items: flex-start;
      flex-direction: column;
    }
    .offer-card.turbo-offer .turbo-options { grid-template-columns: 1fr !important; gap: 8px !important; }
    .offer-card.turbo-offer .turbo-option {
      min-height: 0 !important;
      padding: 13px !important;
    }
    .offer-card.turbo-offer .turbo-option strong { font-size: 22px !important; }
  .offer-card.turbo-offer .turbo-heading { font-size: 22px !important; }
    .offer-card.turbo-offer .turbo-intro { font-size: 12px !important; }
    .offer-card.turbo-offer .turbo-note { min-height: 0 !important; padding: 12px !important; }
    .offer-card.turbo-offer .turbo-details-button { padding: 10px 12px !important; font-size: 12px !important; }
    .offer-card.folga-offer {
      height: auto !important;
      min-height: 0 !important;
      padding: 18px 18px 14px !important;
    }
    .offer-card.folga-offer .folga-header {
      align-items: flex-start;
      flex-direction: column;
    }
    .offer-card.folga-offer .folga-highlight-grid {
      grid-template-columns: 1fr !important;
    }
    .offer-card.folga-offer .folga-highlight {
      min-height: 0 !important;
      padding: 13px !important;
    }
    .offer-card.folga-offer .folga-highlight strong {
      font-size: 18px !important;
    }
    .offer-card.folga-offer .folga-heading { font-size: 21px !important; white-space: normal !important; flex-wrap: wrap !important; }
    .offer-card.folga-offer .folga-intro { font-size: 12px !important; }
    .offer-card.folga-offer .folga-note { padding: 10px 11px !important; font-size: 10px !important; }
    .offer-card.folga-offer .folga-details-button { padding: 10px 12px !important; font-size: 12px !important; }
    .offer-card.new-contract-offer {
      height: auto !important;
      min-height: 0 !important;
      padding: 14px !important;
    }
    .offer-card.new-contract-offer .new-contract-header {
      align-items: flex-start;
      flex-direction: column;
    }
    .offer-card.new-contract-offer .new-contract-highlight { padding: 10px 11px !important; }
    .offer-card.new-contract-offer .new-contract-highlight strong { font-size: 25px !important; }
    .offer-card.new-contract-offer .new-contract-heading { font-size: 21px !important; }
    .offer-card.new-contract-offer .new-contract-intro { font-size: 12px !important; }
    .offer-card.new-contract-offer .new-contract-note { padding: 9px 10px !important; font-size: 10px !important; }
    .offer-card.new-contract-offer .new-contract-details-button { padding: 10px 12px !important; font-size: 12px !important; }
    .offer-card.equilibrio-offer {
      height: auto !important;
      min-height: 0 !important;
      padding: 18px 18px 14px !important;
    }
    .offer-card.equilibrio-offer .equilibrio-header {
      align-items: flex-start;
      flex-direction: column;
    }
    .offer-card.equilibrio-offer .equilibrio-status {
      align-self: flex-start;
    }
    .offer-card.equilibrio-offer .equilibrio-benefit-grid {
      grid-template-columns: 1fr !important;
    }
    .offer-card.equilibrio-offer .equilibrio-benefit {
      min-height: 0 !important;
      padding: 13px !important;
    }
    .offer-card.equilibrio-offer .equilibrio-benefit strong {
      font-size: 18px !important;
    }
    .offer-card.equilibrio-offer .equilibrio-heading { font-size: 21px !important; }
    .offer-card.equilibrio-offer .equilibrio-intro { font-size: 12px !important; }
    .offer-card.equilibrio-offer .equilibrio-note { padding: 10px 11px !important; font-size: 10px !important; }
    .offer-card.equilibrio-offer .equilibrio-details-button { padding: 10px 12px !important; font-size: 12px !important; }
    .offer-card.refin-offer {
      height: auto !important;
      min-height: 0 !important;
      padding: 14px !important;
    }
    .offer-card.refin-offer .refin-header {
      align-items: flex-start;
      flex-direction: column;
    }
    .offer-card.refin-offer .refin-highlight { padding: 10px 11px !important; }
    .offer-card.refin-offer .refin-highlight strong { font-size: 25px !important; }
    .offer-card.refin-offer .refin-heading { font-size: 21px !important; }
    .offer-card.refin-offer .refin-intro { font-size: 12px !important; }
    .offer-card.refin-offer .refin-note { padding: 9px 10px !important; font-size: 10px !important; }
    .offer-card.refin-offer .refin-details-button { padding: 10px 12px !important; font-size: 12px !important; }
    .consigai-offer-lines, .offer-card.turbo-offer .consigai-offer-lines { min-height: 0 !important; }
    .consigai-offer-note, .consigai-offer-note-sub { min-height: 0 !important; }
    .consigai-offer-line-main { font-size: 22px !important; }
    .consigai-offer-mini-value { font-size: 22px !important; }
    .offer-card.turbo-offer .consigai-offer-mini-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
    .offer-card.turbo-offer .consigai-offer-mini-label { font-size: 13px !important; }
    .consigai-offer-actions { margin-top: 10px !important; }
    .consigai-offer-details-btn {
      padding: 11px 12px !important;
      font-size: 12px !important;
      animation: none !important;
    }
  }

  @media (max-width: 540px) {
    .sticky-cta { display: none !important; }
  }
`
