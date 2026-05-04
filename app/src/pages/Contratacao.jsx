import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { loadProfileData } from '../lib/profileStorage'
import { gradient } from '../ui/theme'

function pickSummaryValue(summary, labels, fallback) {
  if (!Array.isArray(summary)) return fallback
  const lowered = labels.map((l) => l.toLowerCase())
  const found = summary.find((item) => {
    const label = String(item?.label ?? '').toLowerCase()
    return lowered.some((target) => label.includes(target))
  })
  return found?.value ?? fallback
}

function IconCheck({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M9.55 17.3 4.8 12.55l1.4-1.4 3.35 3.35 8.25-8.25 1.4 1.4z" />
    </svg>
  )
}

function IconClock({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm1-8.6V7h-2v5.2l4 2.4 1-1.7-3-1.8Z"
      />
    </svg>
  )
}

function IconShield({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2 4 5v6.4c0 5.2 3.4 9.9 8 11.6 4.6-1.7 8-6.4 8-11.6V5l-8-3Zm0 18.7c-3.6-1.6-6-5.7-6-9.3V6.4l6-2.2 6 2.2v5c0 3.6-2.4 7.7-6 9.3Z"
      />
    </svg>
  )
}

function IconWhatsapp({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20.5 3.5A11 11 0 0 0 3.6 17.2L2 22l4.9-1.5A11 11 0 1 0 20.5 3.5Zm-8.6 17a8.9 8.9 0 0 1-4.5-1.2l-.3-.2-2.9.9 1-2.8-.2-.3a9 9 0 1 1 6.9 3.6Zm5-6.8c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.3 8.1 8.1 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.3-.4c.1-.2 0-.3 0-.5l-1-2.3c-.2-.4-.4-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.5s1 2.8 1.1 3c.1.2 2 3.1 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2.1-1.4.3-.6.3-1.2.2-1.3-.2-.2-.4-.3-.7-.4Z"
      />
    </svg>
  )
}

export default function Contratacao() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const screenRef = useRef(null)
  const clientName = loadProfileData().nomeCompleto || 'Cliente'

  const [largeFont, setLargeFont] = useState(false)
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const sourcePath = state?.sourcePath ?? '/ofertas'

  const offerData = useMemo(() => {
    const summary = state?.summary ?? []
    const type = state?.offerTitle ?? 'Portabilidade de consignado'
    const heroValue = pickSummaryValue(summary, ['parcela nova', 'parcela', 'nova parcela'], state?.primaryValue ?? 'R$ 496/mes')
    const savingValue = pickSummaryValue(summary, ['beneficio', 'economia'], 'R$ 2.399')
    const currentInstallment = pickSummaryValue(summary, ['parcela atual'], 'R$ 550')
    const term = pickSummaryValue(summary, ['prazo'], '42 meses')
    const rate = pickSummaryValue(summary, ['taxa'], '1,88% a.m.')

    return {
      type,
      heroValue,
      heroSub: heroValue.includes('/mes') ? 'alivio mensal' : 'valor principal',
      savingValue,
      currentInstallment,
      term,
      rate,
    }
  }, [state])

  useEffect(() => {
    if (submitted) {
      screenRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [submitted])

  const canSubmit = check1 && check2
  const acceptedTermsCount = Number(check1) + Number(check2)

  const lifeComparison = useMemo(() => {
    const afterInstallment = offerData.heroValue.includes('/mes') ? offerData.heroValue : `${offerData.heroValue}/mes`
    return {
      before: {
        installment: offerData.currentInstallment,
        highlight: 'Mais aperto no fim do mes e menor previsibilidade',
      },
      after: {
        installment: afterInstallment,
        highlight: `${offerData.savingValue} de economia para voce respirar melhor`,
      },
    }
  }, [offerData])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .contratacao-page {
          --scale: 1;
          --font: 'Plus Jakarta Sans', system-ui, sans-serif;
          --navy: #03246F;
          --blue: #055ECE;
          --blue-light: #e8eeff;
          --blue-mid: #c2d0f8;
          --text: #071B45;
          --muted: #64748B;
          --line: #DDE8F6;
          --green: #007A52;
          --green-bg: #E9F8F1;
          --green-accent: #16a364;
          --whatsapp: #25d366;
          --bg-panel: #f3f6fd;
          --card-bg: #ffffff;
          --shadow-soft: 0 8px 28px rgba(0,24,81,.08);
          --shadow-cta: 0 10px 24px rgba(5,94,206,.28);
          --r-card: 21px;

          min-height: 100vh;
          font-family: var(--font);
          color: var(--text);
          background: ${gradient.appBackground};
          background-size: ${gradient.appBackgroundSize};
          background-repeat: ${gradient.appBackgroundRepeat};
          background-position: ${gradient.appBackgroundPosition};
        }

        .contratacao-page * { box-sizing: border-box; margin: 0; padding: 0; }
        .contratacao-page.large-font { --scale: 1.13; }

        .desktop-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 40px 54px;
        }

        .desktop-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 22px;
          align-items: start;
        }

        .desktop-sidebar {
          position: sticky;
          top: 24px;
        }

        .sidebar-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-card {
          border-radius: 21px;
          border: 1px solid #e2eafa;
          background: #fff;
          box-shadow: var(--shadow-soft);
          padding: 16px;
        }

        .sidebar-title {
          font-size: calc(11px * var(--scale));
          font-weight: 800;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 10px;
        }

        .sidebar-key {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
          padding: 6px 0;
          border-bottom: 1px solid var(--line);
        }

        .sidebar-key:last-child { border-bottom: 0; padding-bottom: 0; }

        .sidebar-key span {
          font-size: calc(11px * var(--scale));
          color: var(--muted);
          font-weight: 600;
        }

        .sidebar-key strong {
          font-size: calc(12px * var(--scale));
          color: var(--text);
          font-weight: 700;
          text-align: right;
        }

        .sidebar-step {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          border-bottom: 1px solid var(--line);
        }

        .sidebar-step:last-child { border-bottom: 0; padding-bottom: 0; }

        .sidebar-step-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: calc(10px * var(--scale));
          font-weight: 700;
          background: #edf3ff;
          color: var(--blue);
        }

        .sidebar-step.done .sidebar-step-dot {
          background: #e8f5ee;
          color: var(--green);
        }

        .sidebar-step strong {
          display: block;
          font-size: calc(11px * var(--scale));
          color: var(--text);
          font-weight: 700;
          margin-bottom: 1px;
        }

        .sidebar-step span {
          font-size: calc(10px * var(--scale));
          color: var(--muted);
          font-weight: 500;
          line-height: 1.35;
        }

        .sidebar-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          background: #eff4ff;
          color: var(--blue);
          padding: 5px 10px;
          font-size: calc(10px * var(--scale));
          font-weight: 700;
          margin-bottom: 8px;
        }

        .sidebar-meta-line {
          font-size: calc(11px * var(--scale));
          color: var(--muted);
          font-weight: 600;
          line-height: 1.45;
          margin-bottom: 5px;
        }

        .sidebar-meta-line strong {
          color: var(--text);
          font-weight: 700;
        }

        .life-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .life-card {
          border-radius: 13px;
          padding: 10px;
          border: 1px solid var(--line);
        }

        .life-card.before {
          background: #f7f9ff;
        }

        .life-card.after {
          background: #eefaf3;
          border-color: #c6e9d4;
        }

        .life-label {
          font-size: calc(10px * var(--scale));
          text-transform: uppercase;
          letter-spacing: .06em;
          font-weight: 800;
          margin-bottom: 5px;
          color: var(--muted);
        }

        .life-value {
          font-size: calc(18px * var(--scale));
          line-height: 1.05;
          letter-spacing: -.02em;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 5px;
        }

        .life-card.after .life-value {
          color: var(--green);
        }

        .life-copy {
          font-size: calc(11px * var(--scale));
          line-height: 1.35;
          color: var(--muted);
          font-weight: 600;
        }

        .life-caption {
          margin-top: 9px;
          font-size: calc(11px * var(--scale));
          line-height: 1.35;
          color: #4f6395;
          font-weight: 600;
          text-align: center;
        }

        .phone { width: 100%; min-width: 0; }

        .screen {
          min-height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-gutter: stable;
          scroll-behavior: smooth;
        }

        .header { padding: 18px 20px 0; background: transparent; }

        .fontbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 16px;
        }

        .font-toggle {
          display: flex;
          gap: 2px;
          padding: 3px;
          border-radius: 999px;
          background: #fff;
          border: 1px solid var(--line);
          box-shadow: 0 2px 8px rgba(0,24,81,.07);
        }

        .font-toggle button {
          border: 0;
          background: transparent;
          color: var(--muted);
          font: 600 calc(10px * var(--scale))/1 var(--font);
          padding: 7px 11px;
          border-radius: 999px;
          cursor: pointer;
          transition: .16s ease;
        }

        .font-toggle button.active {
          background: var(--navy);
          color: #fff;
        }

        .header-user {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 10px;
          margin-bottom: 20px;
          padding: 14px 14px 0;
        }

        .mobile-brand {
          display: none;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .mobile-brand-name {
          font-size: calc(16px * var(--scale));
          font-weight: 700;
          color: #fff;
          letter-spacing: -.01em;
        }

        .hello {
          font-size: calc(11px * var(--scale));
          color: rgba(255,255,255,.56);
          margin-bottom: 4px;
        }

        .name {
          font-size: calc(18px * var(--scale));
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }

        .benefit-chip {
          flex-shrink: 0;
          text-align: right;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 12px;
          padding: 8px 12px;
        }

        .benefit-chip small {
          display: block;
          font-size: calc(10px * var(--scale));
          color: rgba(255,255,255,.55);
          margin-bottom: 3px;
        }

        .benefit-chip strong {
          font-size: calc(15px * var(--scale));
          font-weight: 700;
          color: #fff;
        }

        .panel {
          background: transparent;
          border-radius: 26px 26px 0 0;
          padding: 22px 18px 24px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--blue-light);
          border-radius: 999px;
          padding: 4px 10px 4px 8px;
          margin-bottom: 9px;
        }

        .tag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); }

        .tag span {
          font-size: calc(10px * var(--scale));
          font-weight: 800;
          letter-spacing: .08em;
          color: var(--blue);
          text-transform: uppercase;
        }

        .section-title {
          font-size: calc(22px * var(--scale));
          font-weight: 800;
          color: var(--text);
          line-height: 1.12;
          margin-bottom: 4px;
          letter-spacing: -.01em;
        }

        .section-sub {
          font-size: calc(12px * var(--scale));
          color: var(--muted);
          font-weight: 500;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .progress-strip {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 14px;
          box-shadow: var(--shadow-soft);
        }

        .progress-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }

        .progress-top strong {
          font-size: calc(12px * var(--scale));
          color: var(--text);
          font-weight: 700;
        }

        .progress-top span {
          font-size: calc(11px * var(--scale));
          color: var(--muted);
          font-weight: 600;
        }

        .progress-track {
          height: 8px;
          border-radius: 999px;
          background: #e9eefc;
          overflow: hidden;
        }

        .progress-fill {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #2350c8 0%, #16a364 100%);
        }

        .offer-summary {
          background: linear-gradient(145deg, #001851 0%, #103991 100%);
          border-radius: var(--r-card);
          padding: 16px;
          margin-bottom: 14px;
          box-shadow: 0 14px 32px rgba(0,24,81,.22);
          position: relative;
          overflow: hidden;
        }

        .offer-summary::after {
          content: '';
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,.08);
          right: -90px;
          top: -120px;
          pointer-events: none;
        }

        .offer-label {
          position: relative;
          z-index: 1;
          font-size: calc(10px * var(--scale));
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: rgba(255,255,255,.52);
          margin-bottom: 12px;
        }

        .offer-hero {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
        }

        .offer-hero-type {
          font-size: calc(11px * var(--scale));
          color: rgba(255,255,255,.65);
          font-weight: 600;
          margin-bottom: 4px;
        }

        .offer-hero-value {
          font-size: calc(30px * var(--scale));
          font-weight: 800;
          color: #fff;
          line-height: 1;
          letter-spacing: -.03em;
          white-space: nowrap;
        }

        .offer-hero-sub {
          font-size: calc(11px * var(--scale));
          color: rgba(255,255,255,.58);
          font-weight: 500;
          margin-top: 4px;
        }

        .offer-badge {
          background: rgba(255,255,255,.14);
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 12px;
          padding: 10px 12px;
          text-align: center;
          flex-shrink: 0;
          backdrop-filter: blur(3px);
        }

        .offer-badge-label {
          font-size: calc(10px * var(--scale));
          color: rgba(255,255,255,.62);
          font-weight: 700;
          margin-bottom: 4px;
        }

        .offer-badge-value {
          font-size: calc(17px * var(--scale));
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          letter-spacing: -.01em;
        }

        .offer-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1px 1fr 1px 1fr;
          align-items: center;
        }

        .offer-sep { width: 1px; background: rgba(255,255,255,.18); height: 30px; }

        .offer-item { text-align: center; padding: 0 4px; }

        .offer-item-label {
          font-size: calc(10px * var(--scale));
          color: rgba(255,255,255,.62);
          font-weight: 500;
          margin-bottom: 3px;
        }

        .offer-item-value {
          font-size: calc(13px * var(--scale));
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
        }

        .insight-rail {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }

        .insight-item {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 13px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          box-shadow: var(--shadow-soft);
        }

        .insight-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          background: linear-gradient(140deg, #2350c8, #16a364);
        }

        .insight-item span {
          font-size: calc(11px * var(--scale));
          color: var(--text);
          font-weight: 600;
          line-height: 1.35;
        }

        .checklist-card,
        .terms-card,
        .success-info-card {
          background: var(--card-bg);
          border-radius: var(--r-card);
          border: 1px solid #e5ecf8;
          box-shadow: var(--shadow-soft);
        }

        .checklist-card { padding: 16px; margin-bottom: 14px; }
        .terms-card { padding: 14px 16px; margin-bottom: 14px; }
        .success-info-card { padding: 14px; margin-bottom: 14px; text-align: left; }

        .checklist-label,
        .terms-label,
        .success-info-label {
          font-size: calc(10px * var(--scale));
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 10px;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 1px solid var(--line);
        }

        .check-item:last-child { border-bottom: 0; padding-bottom: 0; }

        .check-icon {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .check-icon.ok {
          background: var(--green-bg);
          color: var(--green);
        }

        .check-icon.pending {
          background: #f0f4ff;
          color: var(--blue);
        }

        .check-text { flex: 1; }

        .check-title {
          font-size: calc(12px * var(--scale));
          font-weight: 700;
          color: var(--text);
          margin-bottom: 1px;
        }

        .check-sub {
          font-size: calc(10px * var(--scale));
          color: var(--muted);
          font-weight: 500;
        }

        .check-status {
          font-size: calc(10px * var(--scale));
          font-weight: 700;
          border-radius: 999px;
          padding: 3px 8px;
          flex-shrink: 0;
        }

        .check-status.ok {
          background: var(--green-bg);
          color: var(--green);
        }

        .check-status.pending {
          background: var(--blue-light);
          color: var(--blue);
        }

        .whatsapp-card {
          background: linear-gradient(155deg, #f1fdf6 0%, #e6f8ee 100%);
          border: 1px solid #b7e7c9;
          border-radius: var(--r-card);
          padding: 16px;
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: var(--shadow-soft);
        }

        .wa-top { display: flex; align-items: center; gap: 10px; }

        .wa-icon {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          background: var(--whatsapp);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(37,211,102,.3);
        }

        .wa-title {
          font-size: calc(14px * var(--scale));
          font-weight: 700;
          color: var(--green);
          margin-bottom: 2px;
        }

        .wa-sub {
          font-size: calc(11px * var(--scale));
          color: #376f4e;
          font-weight: 500;
          line-height: 1.35;
        }

        .wa-steps { display: flex; flex-direction: column; gap: 6px; }

        .wa-step { display: flex; align-items: flex-start; gap: 8px; }

        .wa-step-num {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #c8eeda;
          color: var(--green);
          font-size: calc(10px * var(--scale));
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wa-step-text {
          font-size: calc(11px * var(--scale));
          color: #3d7a55;
          font-weight: 500;
          line-height: 1.4;
          padding-top: 1px;
        }

        .wa-step-text strong { color: var(--green); font-weight: 700; }

        .wa-phone {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #b8e8cb;
          border-radius: 13px;
          padding: 10px 12px;
        }

        .wa-phone-num {
          font-size: calc(14px * var(--scale));
          font-weight: 700;
          color: var(--green);
          flex: 1;
          letter-spacing: .02em;
        }

        .wa-phone-tag {
          font-size: calc(10px * var(--scale));
          font-weight: 700;
          background: var(--green-bg);
          color: var(--green);
          border-radius: 999px;
          padding: 3px 8px;
        }

        .terms-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .terms-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border-radius: 12px;
          padding: 8px;
          transition: background .15s ease;
        }

        .terms-row:hover { background: #f6f9ff; }

        .terms-row input {
          width: 20px;
          height: 20px;
          margin-top: 1px;
          accent-color: var(--blue);
          cursor: pointer;
          flex-shrink: 0;
        }

        .terms-row label {
          font-size: calc(11px * var(--scale));
          color: var(--muted);
          font-weight: 500;
          line-height: 1.45;
          cursor: pointer;
          user-select: none;
        }

        .terms-row a {
          color: var(--blue);
          text-decoration: none;
          font-weight: 700;
        }

        .terms-row a:hover { text-decoration: underline; }

        .actions-sticky {
          position: sticky;
          bottom: 0;
          padding: 10px 0 max(8px, env(safe-area-inset-bottom));
          background: linear-gradient(180deg, rgba(243,246,253,0) 0%, rgba(243,246,253,.92) 24%, rgba(243,246,253,.98) 100%);
          backdrop-filter: blur(2px);
        }

        .btn {
          width: 100%;
          border: 0;
          border-radius: 21px;
          font-family: var(--font);
          cursor: pointer;
          transition: .16s ease;
        }

        .btn:active { transform: scale(.985); }

        .btn-primary {
          background: linear-gradient(160deg, #2f59d0 0%, #1d43b0 100%);
          color: #fff;
          padding: 15px 14px;
          font-size: calc(15px * var(--scale));
          font-weight: 700;
          line-height: 1.2;
          box-shadow: var(--shadow-cta);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary:hover { filter: brightness(1.05); }

        .btn-primary:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
          filter: none;
          box-shadow: none;
        }

        .btn-secondary {
          background: #fff;
          color: var(--blue);
          border: 1.5px solid var(--blue-mid);
          padding: 13px;
          font-size: calc(13px * var(--scale));
          font-weight: 700;
        }

        .btn-secondary:hover { background: #f0f5ff; }

        .success-overlay { display: none; text-align: center; padding: 10px 0 20px; }
        .success-overlay.visible { display: block; }

        .confetti-wrap {
          position: relative;
          width: 84px;
          height: 84px;
          margin: 0 auto 16px;
        }

        .success-circle {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2350c8 0%, #0a6640 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          animation: popIn .45s cubic-bezier(.34,1.56,.64,1) forwards;
          box-shadow: 0 10px 24px rgba(0,24,81,.24);
        }

        @keyframes popIn {
          from { transform: scale(.4); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-title {
          font-size: calc(22px * var(--scale));
          font-weight: 800;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: -.01em;
        }

        .success-sub {
          font-size: calc(12px * var(--scale));
          color: var(--muted);
          font-weight: 500;
          line-height: 1.5;
          max-width: 280px;
          margin: 0 auto 22px;
        }

        .success-wa {
          background: var(--whatsapp);
          border-radius: 21px;
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
          border-radius: 13px;
          background: rgba(255,255,255,.22);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .success-wa-title {
          font-size: calc(13px * var(--scale));
          font-weight: 700;
          color: #fff;
          margin-bottom: 3px;
        }

        .success-wa-sub {
          font-size: calc(11px * var(--scale));
          color: rgba(255,255,255,.84);
          font-weight: 500;
          line-height: 1.3;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--line);
          font-size: calc(12px * var(--scale));
          gap: 8px;
        }

        .info-row:last-child { border-bottom: 0; padding-bottom: 0; }

        .info-row-label { color: var(--muted); font-weight: 500; }
        .info-row-value { color: var(--text); font-weight: 700; text-align: right; }

        .spacer { height: 8px; }
        .mobile-only { display: block; }

        .desktop-shell {
          background: linear-gradient(120deg, #001851 0%, #032970 100%);
        }

        .contratacao-page.desktop-mode .screen {
          min-height: auto;
          overflow: visible;
        }

        .contratacao-page.desktop-mode .header {
          padding: 0;
        }

        .contratacao-page.desktop-mode .header-user {
          display: none;
        }

        .contratacao-page.desktop-mode .fontbar {
          margin-bottom: 18px;
        }

        .contratacao-page.desktop-mode .panel {
          background: transparent;
          border-radius: 0;
          padding: 0;
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
        }

        .contratacao-page.desktop-mode #viewReview,
        .contratacao-page.desktop-mode #viewSuccess {
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        .contratacao-page.desktop-mode .actions-sticky {
          position: static;
          padding: 0;
          background: transparent;
        }

        .contratacao-page.desktop-mode .mobile-only,
        .contratacao-page.desktop-mode .mobile-brand {
          display: none;
        }

        @media (max-width: 1080px) {
          .desktop-layout {
            grid-template-columns: 1fr;
          }

          .desktop-sidebar {
            position: static;
          }
        }

        @media (max-width: 767px) {
          .desktop-content {
            display: none;
          }

          .section-title {
            font-size: calc(21px * var(--scale));
          }

          .offer-hero {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .offer-badge {
            width: 100%;
            text-align: left;
          }

          .offer-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .offer-sep { display: none; }

          .offer-item {
            border: 1px solid rgba(255,255,255,.18);
            border-radius: 10px;
            padding: 7px 8px;
          }

          .wa-phone {
            flex-direction: column;
            align-items: flex-start;
          }

          .wa-phone-tag {
            align-self: flex-start;
          }
        }
      `}</style>

      <div className={`contratacao-page ${largeFont ? 'large-font' : ''} ${isDesktop ? 'desktop-mode' : ''}`}>
        {isDesktop ? (
          <DesktopPageHeader
            clientName={clientName}
            chipLabel="Confirmacao final"
            title="Revise e confirme sua contratacao"
            subtitle={`Confira os detalhes da proposta de ${offerData.type} antes de finalizar.`}
            onLogoClick={() => navigate('/ofertas')}
            actions={[
              { label: 'Ofertas', onClick: () => navigate('/ofertas') },
              { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
            ]}
          />
        ) : (
          <MobilePageHeader
            clientName={clientName}
            onLogoClick={() => navigate('/ofertas')}
            actions={[
              { label: 'Ofertas', onClick: () => navigate('/ofertas') },
              { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
            ]}
          />
        )}

        <div className={isDesktop ? 'desktop-content desktop-layout' : ''}>
          <div className="phone">
            <div className="screen" ref={screenRef}>
              <section className="header">
                <div className="fontbar">
                  <div className="font-toggle" role="group" aria-label="Tamanho da fonte">
                    <button type="button" className={!largeFont ? 'active' : ''} onClick={() => setLargeFont(false)}>
                      Normal
                    </button>
                    <button type="button" className={largeFont ? 'active' : ''} onClick={() => setLargeFont(true)}>
                      A+
                    </button>
                  </div>
                </div>

                <div className="panel">
                  <div id="viewReview" style={{ display: submitted ? 'none' : 'block' }}>
                    <div className="tag">
                      <div className="tag-dot" />
                      <span>Passo 3 de 3</span>
                    </div>
                    <h2 className="section-title">Revise sua contratacao</h2>
                    <p className="section-sub">Ultima etapa. Voce confirma agora e finalizamos pelo WhatsApp.</p>

                    <div className="progress-strip" aria-label="Progresso do fluxo">
                      <div className="progress-top">
                        <strong>Cadastro concluido</strong>
                        <span>100%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" />
                      </div>
                    </div>

                    <div className="offer-summary">
                      <div className="offer-label">Oferta selecionada</div>
                      <div className="offer-hero">
                        <div>
                          <div className="offer-hero-type">{offerData.type}</div>
                          <div className="offer-hero-value">{offerData.heroValue}</div>
                          <div className="offer-hero-sub">{offerData.heroSub}</div>
                        </div>
                        <div className="offer-badge">
                          <div className="offer-badge-label">Voce economiza</div>
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

                    <div className="insight-rail">
                      <div className="insight-item">
                        <div className="insight-icon"><IconShield size={15} /></div>
                        <span>Seus dados ja foram validados para a contratacao.</span>
                      </div>
                      <div className="insight-item">
                        <div className="insight-icon"><IconClock size={15} /></div>
                        <span>Tempo medio para contato: ate 2 horas uteis.</span>
                      </div>
                    </div>

                    <div className="checklist-card">
                      <div className="checklist-label">Documentos e dados</div>
                      <div className="check-item">
                        <div className="check-icon ok"><IconCheck size={15} /></div>
                        <div className="check-text">
                          <div className="check-title">Dados pessoais</div>
                          <div className="check-sub">CPF, data de nascimento e telefone</div>
                        </div>
                        <div className="check-status ok">Confirmado</div>
                      </div>
                      <div className="check-item">
                        <div className="check-icon ok"><IconCheck size={15} /></div>
                        <div className="check-text">
                          <div className="check-title">Extrato do INSS</div>
                          <div className="check-sub">extrato_junho_2025.pdf</div>
                        </div>
                        <div className="check-status ok">Enviado</div>
                      </div>
                      <div className="check-item">
                        <div className="check-icon pending"><IconClock size={14} /></div>
                        <div className="check-text">
                          <div className="check-title">Dados bancarios</div>
                          <div className="check-sub">Confirmacao feita no contato final</div>
                        </div>
                        <div className="check-status pending">Pendente</div>
                      </div>
                    </div>

                    <div className="whatsapp-card">
                      <div className="wa-top">
                        <div className="wa-icon"><IconWhatsapp size={20} /></div>
                        <div>
                          <div className="wa-title">Finalizamos pelo WhatsApp</div>
                          <div className="wa-sub">Um consultor entrara em contato para concluir sua contratacao.</div>
                        </div>
                      </div>
                      <div className="wa-steps">
                        <div className="wa-step">
                          <div className="wa-step-num">1</div>
                          <div className="wa-step-text">Voce confirma aqui e <strong>enviamos sua solicitacao</strong>.</div>
                        </div>
                        <div className="wa-step">
                          <div className="wa-step-num">2</div>
                          <div className="wa-step-text">Nosso consultor <strong>entra em contato em ate 2h</strong>.</div>
                        </div>
                        <div className="wa-step">
                          <div className="wa-step-num">3</div>
                          <div className="wa-step-text"><strong>Assinatura digital</strong> no proprio WhatsApp.</div>
                        </div>
                      </div>
                      <div className="wa-phone">
                        <div className="wa-phone-num">(11) 99999-0000</div>
                        <div className="wa-phone-tag">Seu numero</div>
                      </div>
                    </div>

                    <div className="terms-card">
                      <div className="terms-label">Aceite necessario</div>
                      <div className="terms-list">
                        <div className="terms-row">
                          <input
                            id="term-1"
                            type="checkbox"
                            checked={check1}
                            onChange={(e) => setCheck1(e.target.checked)}
                          />
                          <label htmlFor="term-1">
                            Li e aceito os <a href="#" onClick={(e) => e.preventDefault()}>Termos de contratacao</a> e a{' '}
                            <a href="#" onClick={(e) => e.preventDefault()}>Politica de privacidade</a>.
                          </label>
                        </div>
                        <div className="terms-row">
                          <input
                            id="term-2"
                            type="checkbox"
                            checked={check2}
                            onChange={(e) => setCheck2(e.target.checked)}
                          />
                          <label htmlFor="term-2">
                            Autorizo a <a href="#" onClick={(e) => e.preventDefault()}>consulta ao meu historico de credito</a> para analise da proposta.
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="actions-sticky">
                      <button className="btn btn-primary" type="button" disabled={!canSubmit} onClick={() => setSubmitted(true)}>
                        Confirmar contratacao
                      </button>
                      <button className="btn btn-secondary" type="button" onClick={() => navigate(sourcePath)}>
                        Voltar para oferta
                      </button>
                    </div>
                  </div>

                  <div id="viewSuccess" className={`success-overlay ${submitted ? 'visible' : ''}`}>
                    <div className="confetti-wrap">
                      <div className="success-circle"><IconCheck size={40} /></div>
                    </div>
                    <div className="success-title">Solicitacao enviada!</div>
                    <div className="success-sub">Tudo certo. Em breve um consultor entrara em contato pelo seu WhatsApp.</div>

                    <div className="success-wa">
                      <div className="success-wa-icon"><IconWhatsapp size={20} /></div>
                      <div>
                        <div className="success-wa-title">Aguarde o contato no WhatsApp</div>
                        <div className="success-wa-sub">(11) 99999-0000 - em ate 2 horas uteis</div>
                      </div>
                    </div>

                    <div className="success-info-card">
                      <div className="success-info-label">Resumo da solicitacao</div>
                      <div className="info-row"><span className="info-row-label">Tipo</span><span className="info-row-value">{offerData.type}</span></div>
                      <div className="info-row"><span className="info-row-label">Valor principal</span><span className="info-row-value">{offerData.heroValue}</span></div>
                      <div className="info-row"><span className="info-row-label">Economia</span><span className="info-row-value">{offerData.savingValue}</span></div>
                      <div className="info-row"><span className="info-row-label">Protocolo</span><span className="info-row-value">#2026-04892</span></div>
                    </div>

                    <button className="btn btn-primary" type="button" onClick={() => navigate('/ofertas')}>
                      Voltar ao inicio
                    </button>
                  </div>

                  <div className="spacer" />
                </div>
              </section>
            </div>
          </div>

          {isDesktop && (
            <aside className="desktop-sidebar">
              <div className="sidebar-stack">
                <div className="sidebar-card">
                  <div className="sidebar-title">Resumo da oferta</div>
                  <div className="sidebar-key">
                    <span>Tipo</span>
                    <strong>{offerData.type}</strong>
                  </div>
                  <div className="sidebar-key">
                    <span>Nova parcela</span>
                    <strong>{offerData.heroValue}</strong>
                  </div>
                  <div className="sidebar-key">
                    <span>Economia</span>
                    <strong>{offerData.savingValue}</strong>
                  </div>
                  <div className="sidebar-key">
                    <span>Prazo</span>
                    <strong>{offerData.term}</strong>
                  </div>
                </div>

                <div className="sidebar-card">
                  <div className="sidebar-title">Etapas</div>
                  <div className={`sidebar-step ${acceptedTermsCount === 2 ? 'done' : ''}`}>
                    <div className="sidebar-step-dot">{acceptedTermsCount === 2 ? <IconCheck size={12} /> : 1}</div>
                    <div>
                      <strong>Aceite dos termos</strong>
                      <span>{acceptedTermsCount}/2 concluido</span>
                    </div>
                  </div>
                  <div className={`sidebar-step ${submitted ? 'done' : ''}`}>
                    <div className="sidebar-step-dot">{submitted ? <IconCheck size={12} /> : 2}</div>
                    <div>
                      <strong>Envio da solicitacao</strong>
                      <span>Confirmacao da proposta</span>
                    </div>
                  </div>
                  <div className={`sidebar-step ${submitted ? 'done' : ''}`}>
                    <div className="sidebar-step-dot">{submitted ? <IconCheck size={12} /> : 3}</div>
                    <div>
                      <strong>Contato do consultor</strong>
                      <span>Finalizacao via WhatsApp</span>
                    </div>
                  </div>
                </div>

                <div className="sidebar-card">
                  <div className="sidebar-title">Tempo estimado</div>
                  <div className="sidebar-pill">
                    <IconClock size={13} />
                    Ate 2h uteis para contato
                  </div>
                  <div className="sidebar-meta-line">
                    <strong>Inicio do atendimento:</strong> em ate 2 horas uteis.
                  </div>
                  <div className="sidebar-meta-line">
                    <strong>Conclusao media:</strong> no mesmo dia, apos validacao final.
                  </div>
                </div>

                <div className="sidebar-card">
                  <div className="sidebar-title">Impacto na sua rotina</div>
                  <div className="life-grid">
                    <div className="life-card before">
                      <div className="life-label">Antes</div>
                      <div className="life-value">{lifeComparison.before.installment}</div>
                      <div className="life-copy">{lifeComparison.before.highlight}</div>
                    </div>
                    <div className="life-card after">
                      <div className="life-label">Depois</div>
                      <div className="life-value">{lifeComparison.after.installment}</div>
                      <div className="life-copy">{lifeComparison.after.highlight}</div>
                    </div>
                  </div>
                  <div className="life-caption">Menos pressao mensal, mais espaco para decidir com tranquilidade.</div>
                </div>

                <div className="sidebar-card">
                  <div className="sidebar-title">Suporte</div>
                  <div className="sidebar-meta-line">
                    <strong>WhatsApp:</strong> (11) 99999-0000
                  </div>
                  <div className="sidebar-meta-line">
                    <strong>Horario:</strong> segunda a sexta, 08h as 18h.
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  )
}
