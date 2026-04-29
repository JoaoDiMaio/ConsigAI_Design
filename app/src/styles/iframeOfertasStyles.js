// CSS strings injetados no documento do iframe /Ofertas_ConsigAI.html.
// Separados aqui para poder editar sem abrir o componente principal.
// Quando o HTML do iframe for migrado para JSX nativo, mover para .css normais.

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
    .hero-compare { justify-self: end !important; width: min(360px, 100%) !important; }
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
  body {
    min-height: 100vh !important;
    font-family: Inter, Arial, Helvetica, sans-serif !important;
    background-image: url('/fundo-ofertas.svg') !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    color: var(--text-main, var(--text)) !important;
    padding: 0 24px 24px !important;
  }
  .main { position: relative !important; z-index: 0 !important; }
  .main::before { display: none !important; }
  .hero-title { color: #1a3d8f !important; }
  .hero-title em { color: #0a7c52 !important; font-style: normal !important; }
  @media (min-width: 1024px) { .hero-title { white-space: nowrap !important; } }
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
    border: 2px solid transparent !important;
    box-shadow: 0 8px 24px rgba(0,24,81,.06) !important;
    border-radius: 22px !important;
    padding: 18px !important;
    height: 282px !important; min-height: 282px !important;
    container-type: inline-size;
    transition: border-color .18s ease, box-shadow .18s ease, background .18s ease !important;
    touch-action: manipulation !important;
    will-change: transform, box-shadow, border-color;
    user-select: text;
  }
  .offer-card.selected, .offer-card.active {
    border: 2px solid transparent !important;
    background:
      linear-gradient(180deg, #ffffff 0%, #f7fbff 100%) padding-box,
      linear-gradient(135deg, #2454D6, #18B7E8, #00A99D) border-box !important;
    box-shadow: 0 18px 42px rgba(13, 35, 90, 0.24) !important;
  }
  .offer-card.selected::before, .offer-card.active::before { display: none !important; }
  .offer-card:hover { border-color: #c2d0f8 !important; }
  .consigai-offer-card { height: 100%; display: flex; flex-direction: column; user-select: text; }
  .consigai-offer-head { margin-bottom: 0; min-height: 0; display: flex; align-items: flex-start; justify-content: flex-end; }
  .consigai-offer-title-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px; margin-bottom: 16px; flex-wrap: nowrap;
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
    width: auto; max-width: max-content; border-radius: 999px; padding: 7px 12px;
    background: #e8eeff; border: 1px solid #c2d0f8;
    color: #1a3d8f; font-size: 11px; font-weight: 900;
    letter-spacing: .05em; text-transform: uppercase; line-height: 1;
    white-space: nowrap; margin: 0 0 12px; flex-shrink: 0;
  }
  .offer-card.selected .consigai-offer-pill {
    background: #1a3d8f; border-color: #1a3d8f; color: #fff;
    box-shadow: 0 8px 18px rgba(35,80,200,.18);
  }
  .consigai-offer-lines {
    display: grid; gap: 3px; margin-top: 2px; margin-bottom: 10px;
    align-content: start; min-height: 112px;
  }
  .consigai-offer-pretext {
    font-size: 24px; line-height: 1.08; letter-spacing: -.03em;
    color: #1a3d8f; font-weight: 850; margin-bottom: 8px;
  }
  .consigai-offer-lines .consigai-offer-line:first-of-type { min-height: 50px; align-content: start; }
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
  .offer-card.turbo-offer .consigai-offer-lines { display: block; min-height: 112px; }
  .consigai-offer-mini-grid {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;
  }
  .consigai-offer-mini-card {
    display: grid; gap: 6px; padding: 11px 10px;
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
  .offer-card.turbo-offer .consigai-offer-mini-grid { gap: 8px; margin-top: 26px !important; }
  .offer-card.turbo-offer .consigai-offer-mini-card {
    gap: 4px; padding: 9px 8px; align-content: start; overflow: hidden;
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
    border-color: #2454D6 !important; background: #eef5ff !important;
    box-shadow: 0 3px 10px rgba(35, 80, 200, .12) !important;
  }
  .consigai-offer-note { display: block; margin-top: auto; min-height: 0; }
  .consigai-offer-note-dot { display: none; }
  .consigai-offer-note-text { display: block; }
  .consigai-offer-note-title { display: none; }
  .consigai-offer-note-sub {
    color: #7a8db8; font-weight: 400; font-size: 12px;
    line-height: 1.35; display: block; min-height: 20px;
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
  @media (max-width: 1080px) {
    .offers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  }
  @media (max-width: 760px) {
    .offers-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 10px !important; }
    .offer-card { min-height: auto !important; padding: 14px !important; }
    .consigai-offer-lines, .offer-card.turbo-offer .consigai-offer-lines { min-height: 0 !important; }
    .consigai-offer-note, .consigai-offer-note-sub { min-height: 0 !important; }
    .consigai-offer-line-main { font-size: 22px !important; }
    .consigai-offer-mini-value { font-size: 22px !important; }
    .offer-card.turbo-offer .consigai-offer-mini-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
    .offer-card.turbo-offer .consigai-offer-mini-label { font-size: 13px !important; }
  }
`
