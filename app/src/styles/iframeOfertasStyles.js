// CSS strings injetados no documento do iframe /Ofertas_ConsigAI.html.
// Separados aqui para poder editar sem abrir o componente principal.
// Quando o HTML do iframe for migrado para JSX nativo, mover para .css normais.
import { gradient } from '../ui/theme'

export const RESPONSIVE_STYLES_CSS = `
  .consigai-offer-lines--no-min-height { min-height: 0 !important; }

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
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    gap: 2px 12px;
    align-items: center;
    margin-bottom: 12px;
  }
  .impact-header .ba-title { grid-column: 1; grid-row: 1; }
  .impact-header .ba-sub {
    grid-column: 1; grid-row: 2;
    color: var(--gray-text) !important;
    font-size: 13px;
  }
  .impact-header .income-base { grid-column: 2; grid-row: 1 / 3; align-self: center; }
  .income-base {
    min-width: 160px; max-width: 160px;
    border: 1px solid var(--gray-border); border-radius: 12px;
    background: #f4f8ff; padding: 8px 12px;
  }
  .income-base-label {
    font-size: 11px; line-height: 1.2; color: var(--gray-text);
    font-weight: 600; margin-bottom: 3px;
  }
  .income-base-value {
    font-size: 19px; line-height: 1; color: var(--blue-title);
    font-weight: 800; letter-spacing: -.02em;
  }
  .consigai-pocket-visual.impact-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch; gap: 12px;
  }
  .impact-card {
    border-radius: 14px; padding: 14px 14px 12px;
    border: 1px solid var(--gray-border); background: var(--gray-bg);
  }
  .impact-card-before { background: var(--gray-bg); border-color: var(--gray-border); }
  .impact-card-after {
    background: linear-gradient(180deg, #F6FFFB 0%, #F7FBFF 100%);
    border-color: var(--green-border);
  }
  .impact-card-gain { background: #F8FFFB; border: 2px solid var(--green-strong); }
  .impact-chip {
    display: inline-flex; align-items: center; gap: 7px;
    border-radius: 999px; padding: 5px 11px; margin-bottom: 10px;
    font-size: 10px; line-height: 1.1; font-weight: 800;
    letter-spacing: .05em; text-transform: uppercase;
    color: var(--blue-title); border: 1px solid transparent;
    background: #e9f0ff;
  }
  .impact-card-after .impact-chip {
    background: rgba(109, 245, 212, 0.18);
    border-color: rgba(0, 169, 157, 0.25);
  }
  .consigai-logo-mark {
    width: 12px; height: 12px; border-radius: 999px;
    background: linear-gradient(135deg, var(--blue-action) 0%, var(--cyan-brand) 55%, var(--teal-brand) 100%);
    box-shadow: 0 0 0 1px rgba(36, 84, 214, 0.08); flex: 0 0 auto;
  }
  .impact-row {
    display: grid; grid-template-columns: 34px minmax(0, 1fr);
    gap: 10px; align-items: center; padding: 9px 0;
    border-bottom: 1px solid #dfe7f5;
  }
  .impact-row:last-child { border-bottom: 0; padding-bottom: 0; }
  .impact-icon {
    width: 34px; height: 34px; border-radius: 999px;
    display: inline-flex; align-items: center; justify-content: center;
    color: var(--blue-action); background: #eaf0ff;
  }
  .impact-card-after .impact-icon { color: var(--teal-brand); background: rgba(24, 183, 232, 0.12); }
  .brand-icon { color: var(--teal-brand); background: rgba(24, 183, 232, 0.12); }
  .impact-icon svg {
    width: 18px; height: 18px; stroke: currentColor; fill: none;
    stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round;
  }
  .consigai-pocket-label { font-size: 11px; font-weight: 600; color: var(--blue-title); margin-bottom: 2px; }
  .consigai-pocket-val {
    font-size: clamp(16px, 2.1vw, 24px); font-weight: 900;
    letter-spacing: -.03em; color: var(--blue-title); line-height: 1.05;
  }
  .value-negative { color: var(--red-negative); }
  .value-positive { color: var(--green-medium); }
  .consigai-pocket-note { margin-top: 2px; color: var(--gray-text); font-size: 10px; line-height: 1.2; }
  .gain-header {
    display: grid; grid-template-columns: 42px minmax(0, 1fr);
    gap: 10px; align-items: center;
    border-bottom: 1px solid var(--green-border);
    padding-bottom: 10px; margin-bottom: 10px;
  }
  .gain-icon {
    width: 42px; height: 42px; border-radius: 999px;
    background: linear-gradient(145deg, var(--green-strong) 0%, var(--teal-brand) 100%);
    color: #fff; display: inline-flex; align-items: center; justify-content: center;
  }
  .gain-icon svg {
    width: 22px; height: 22px; stroke: currentColor; fill: none;
    stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round;
  }
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

  @media (min-width: 1024px) {
    .main { padding: 18px 18px 100px !important; }
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
    .impact-card { padding: 12px 12px 10px !important; }
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
    .sticky-cta { padding: 10px 18px !important; gap: 16px !important; }
    .btn-cta { padding: 12px 22px !important; }
  }

  @media (max-width: 1080px) {
    .main { padding: 24px 16px 120px !important; }
    .hero { padding: 18px 18px !important; gap: 16px !important; }
    .hero-compare { justify-self: end !important; width: min(332px, 100%) !important; }
    .hc-row { gap: 12px !important; }
    .offers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .offers-grid > .offer-card:nth-child(3) {
      grid-column: 1 / -1 !important; justify-self: center !important;
      width: min(520px, 100%) !important;
    }
    .ba-section { padding: 20px 16px !important; }
    .consigai-pocket-visual.impact-grid { grid-template-columns: minmax(0, 1fr) !important; }
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
    .topbar-center { order: 3; width: 100%; }
    .topbar-title { font-size: 14px !important; }
    .topbar-sub { font-size: 11px !important; }
    .main { padding: 16px 12px 132px !important; }
    .hero { grid-template-columns: minmax(0, 1fr) !important; }
    .hero-compare { justify-self: stretch !important; width: 100% !important; }
    .hc-row { grid-template-columns: 1fr !important; }
    .hc-arrow { transform: rotate(90deg) !important; }
    .hc-saving { align-items: flex-start !important; flex-direction: column !important; gap: 8px !important; }
    .offers-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 10px !important; }
    .offers-grid > .offer-card:nth-child(3) {
      grid-column: auto !important; justify-self: stretch !important; width: 100% !important;
    }
    .offer-card { padding: 14px !important; }
    .offer-values { gap: 12px !important; }
    .consigai-pocket-visual.impact-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 10px !important; }
    .impact-card-before, .impact-card-after, .impact-card-gain { grid-column: 1 !important; }
    .gain-header {
      grid-template-columns: 1fr !important; text-align: center !important; justify-items: center !important;
    }
    .gain-item {
      grid-template-columns: 28px minmax(0, 1fr) !important;
      grid-template-areas: "icon label" "icon value" !important;
      align-items: flex-start !important; gap: 3px !important;
    }
    .consigai-pocket-gain-icon { grid-area: icon !important; }
    .consigai-pocket-gain-label { grid-area: label !important; }
    .consigai-pocket-gain-num { grid-area: value !important; }
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
      padding: 10px 12px !important; gap: 10px !important;
      flex-wrap: wrap !important; justify-content: flex-start !important;
    }
    .cta-sep { display: none !important; }
    .btn-cta { width: 100% !important; justify-content: center !important; padding: 12px 16px !important; }
  }
`

export const OFFER_CARD_REDESIGN_CSS = `
  .hero-sub { display: none !important; }
  .section-header { display: none !important; }
  .savings-banner { display: none !important; }
  .topbar { display: none !important; }
  html,
  body {
    background: ${gradient.appBackground} !important;
    background-size: ${gradient.appBackgroundSize} !important;
    background-repeat: ${gradient.appBackgroundRepeat} !important;
    background-position: ${gradient.appBackgroundPosition} !important;
  }
  body {
    min-height: 100vh !important;
    font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif !important;
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
    margin-bottom: 6px !important;
    padding-bottom: 10px !important;
    border-bottom: 1px solid var(--line) !important;
  }
  .hc-label::before {
    content: 'Comparativo da oferta' !important;
    display: block !important;
    color: var(--navy) !important;
    font-size: 16px !important;
    font-weight: 950 !important;
    letter-spacing: -0.02em !important;
    line-height: 1.15 !important;
  }
  .hc-label::after {
    content: 'Antes e depois da ConsigAI' !important;
    display: block !important;
    color: var(--muted) !important;
    font-size: 11px !important;
    font-weight: 750 !important;
    letter-spacing: 0 !important;
    line-height: 1.2 !important;
    margin-top: 3px !important;
  }
  .hc-row {
    display: grid !important;
    grid-template-columns: 1fr 54px 1fr !important;
    gap: 6px !important;
    align-items: stretch !important;
    margin-bottom: 6px !important;
  }
  .hc-col {
    min-height: 72px !important;
    padding: 7px !important;
    border-radius: 13px !important;
    border: 1px solid var(--line) !important;
    background: radial-gradient(circle at 88% 10%, rgba(5, 94, 206, 0.10), transparent 34%), linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%) !important;
    text-align: left !important;
  }
  .hc-col-label {
    display: block !important;
    color: var(--text-muted) !important;
    font-size: 11px !important;
    font-weight: 850 !important;
    margin-bottom: 4px !important;
  }
  .hc-col-val {
    font-size: 18px !important;
    font-weight: 950 !important;
    letter-spacing: -.055em !important;
    line-height: 1 !important;
    white-space: nowrap !important;
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
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 8px !important;
  }
  .hc-saving-label {
    font-size: 11px !important;
    color: var(--green) !important;
    font-weight: 950 !important;
  }
  .hc-saving-value {
    font-size: 18px !important;
    font-weight: 950 !important;
    color: var(--green-accent) !important;
    letter-spacing: -.055em !important;
    white-space: nowrap !important;
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
  /* Desabilitar animações globais; manter apenas nos 3 cards de oferta */
  .main * { animation: none !important; transition: none !important; transform: none; }
  .offers-grid .offer-card { transition: all .18s ease !important; }
  .ba-section .vc, .ba-section .popped, #baNova, #baSobra, #baCredito, #baPill {
    animation: none !important; transition: none !important; transform: none !important;
  }
  .offers-grid {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 14px !important; align-items: stretch !important;
  }
  .offer-card {
    background: #fff !important;
    border: 1.5px solid #DDE8F6 !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 24px !important;
    padding: 22px !important;
    height: 334px !important; min-height: 334px !important;
    container-type: inline-size;
    position: relative !important;
    overflow: hidden !important;
    transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease !important;
    touch-action: manipulation !important;
    will-change: transform, box-shadow, border-color;
    user-select: text;
  }
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
  .consigai-offer-card { height: 100%; display: flex; flex-direction: column; user-select: text; }
  .consigai-offer-head { margin-bottom: 0; min-height: 0; display: flex; align-items: flex-start; justify-content: flex-end; }
  .consigai-offer-title-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px; margin-bottom: 18px; flex-wrap: nowrap;
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
    white-space: nowrap; margin: 0 0 14px; flex-shrink: 0;
  }
  .offer-card.selected .consigai-offer-pill {
    background: #1a3d8f; border-color: #1a3d8f; color: #fff;
    box-shadow: 0 8px 18px rgba(35,80,200,.18);
  }
  .consigai-offer-lines {
    display: grid; gap: 6px; margin-top: 2px; margin-bottom: 12px;
    align-content: start; min-height: 126px;
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
    border: 1.5px solid transparent !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 30px !important;
    padding: 18px 18px 14px !important;
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
    border: 1px solid #DDE8F6;
    background: #F8FBFF;
    cursor: pointer;
    transition: 160ms ease;
    appearance: none;
    -webkit-appearance: none;
    box-shadow: none;
  }
  .offer-card.turbo-offer .turbo-option:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 231, 255, 0.85);
    box-shadow: 0 12px 28px rgba(3, 36, 111, 0.10);
  }
  .offer-card.turbo-offer .turbo-option.active,
  .offer-card.turbo-offer .turbo-option.is-selected {
    background: #EFFFFA;
    border-color: #00E7FF;
    box-shadow: 0 12px 30px rgba(0, 231, 255, 0.16);
  }
  .offer-card.turbo-offer:not(.selected):not(.active) .turbo-option.active,
  .offer-card.turbo-offer:not(.selected):not(.active) .turbo-option.is-selected {
    background: #F8FBFF;
    border-color: #DDE8F6;
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
    margin-top: 4px;
    color: #007A52;
    font-size: 18px;
    line-height: 1.1;
    font-weight: 950;
    letter-spacing: -.04em;
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
    margin-top: 4px;
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
    border: 1.5px solid transparent !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 30px !important;
    padding: 18px 18px 14px !important;
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
    color: #64748B;
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
    cursor: pointer; border-color: #dbe6f7; background: #f7faff;
    box-shadow: none; transition: none;
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
    border-color: #dbe6f7; background: #f7faff; box-shadow: none;
    transition: border-color .16s ease, box-shadow .16s ease, background .16s ease;
  }
  .offer-card.turbo-offer .consigai-offer-mini-label { color: #1a3d8f; }
  .offer-card.turbo-offer.selected .consigai-offer-mini-card.is-selected {
    border: 2px solid rgba(0,231,255,.65) !important;
    background: linear-gradient(160deg, #f0faff 0%, #ffffff 60%) !important;
    box-shadow: 0 10px 24px rgba(5,94,206,.16), 0 0 0 3px rgba(0,231,255,.08) !important;
    transform: translateY(-1px) !important;
  }
  .offer-card.turbo-offer.selected .consigai-offer-mini-card.is-selected .consigai-offer-mini-label {
    color: #1a3d8f !important;
  }
  .offer-card.turbo-offer.selected .consigai-offer-mini-card.is-selected .consigai-offer-mini-value {
    color: #0a7c52 !important;
  }
  .offer-card.new-contract-offer {
    border: 1.5px solid transparent !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 30px !important;
    padding: 18px !important;
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
    border: 1.5px solid transparent !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 30px !important;
    padding: 18px 18px 14px !important;
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
    border: 1.5px solid transparent !important;
    box-shadow: 0 8px 24px rgba(3,36,111,.07) !important;
    border-radius: 30px !important;
    padding: 18px !important;
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
    color: #7a8db8; font-weight: 400; font-size: 12px;
    line-height: 1.35; display: block; min-height: 20px;
  }
  .consigai-offer-actions {
    margin-top: 16px;
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
    font-size: 13px !important;
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
  @keyframes consigaiDetailsFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1px); }
  }
  @keyframes consigaiDetailsShine {
    0% { transform: translateX(-120%) skewX(-18deg); }
    100% { transform: translateX(120%) skewX(-18deg); }
  }
  @media (max-width: 1080px) {
    .offers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  }
  @media (max-width: 760px) {
    .offers-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 10px !important; }
    .offer-card { min-height: auto !important; padding: 14px !important; }
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
`
