import { useState } from 'react'
import { theme } from '../ui/theme'

const t = { ...theme }

const VARIANT_COLORS = {
  eco: {
    bg: '#f4fbf7',
    border: '#b8e0ca',
    iconBg: '#e1f3ea',
    iconStroke: '#0a6640',
    nameCl: t.green,
    descCl: t.greenSoft,
    divider: '#b8e0ca',
    valueCl: t.green,
    btnBg: t.green,
    detailCl: t.greenSoft,
  },
  refin: {
    bg: '#fffaf0',
    border: t.goldLine,
    iconBg: '#fff0c9',
    iconStroke: '#b07800',
    nameCl: t.gold,
    descCl: '#9b7020',
    divider: t.goldLine,
    valueCl: t.gold,
    btnBg: t.goldBtn,
    detailCl: '#9b7020',
  },
  novo: {
    bg: '#f2f6ff',
    border: '#c0d2f5',
    iconBg: '#d9e5ff',
    iconStroke: '#1840a8',
    nameCl: '#0c3278',
    descCl: '#4a6fa8',
    divider: '#c0d2f5',
    valueCl: '#0c3278',
    btnBg: '#1840a8',
    detailCl: '#4a6fa8',
  },
}

const VARIANT_ICON = {
  eco: (stroke) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M11 6l5 4-5 4" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  refin: (stroke) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 10h3l2 4 3-8 2 4h4" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  novo: (stroke) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 4v12M4 10h12" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="10" cy="10" r="7.2" stroke={stroke} strokeWidth="1.5" opacity=".55" />
    </svg>
  ),
}

export function MiniCard({ variant = 'eco', name, desc, value, detail, onNav }) {
  const colors = VARIANT_COLORS[variant] ?? VARIANT_COLORS.eco
  const icon = VARIANT_ICON[variant] ?? VARIANT_ICON.eco
  const [hov, setHov] = useState(false)

  return (
    <div style={{ borderRadius: 16, border: `2px solid ${colors.border}`, background: colors.bg, overflow: 'hidden', marginBottom: 8 }}>
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: colors.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon(colors.iconStroke)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.nameCl, lineHeight: 1.2, marginBottom: 3 }}>{name}</div>
            <div style={{ fontSize: 10.5, fontWeight: 500, color: colors.descCl, lineHeight: 1.35 }}>{desc}</div>
          </div>
        </div>
      </div>
      <div style={{ height: 1, background: colors.divider, margin: '0 14px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, whiteSpace: 'nowrap', color: colors.valueCl }}>
            <span style={{ fontSize: 11, fontWeight: 600 }}>R$</span>
            <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em' }}>{value}</span>
          </div>
          {detail ? <div style={{ fontSize: 9.5, fontWeight: 500, color: colors.detailCl, marginTop: 2 }}>{detail}</div> : null}
        </div>
        <button
          onClick={onNav}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            border: 0, borderRadius: 12, color: '#fff', background: colors.btnBg,
            padding: '11px 16px', fontWeight: 600, fontSize: 11.5, lineHeight: 1.2,
            cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            boxShadow: '0 4px 10px rgba(0,24,81,.10)',
            transform: hov ? 'translateY(-1px) scale(1.02)' : 'none',
            transition: 'transform .18s ease, box-shadow .18s ease, filter .18s ease',
            filter: hov ? 'brightness(1.03)' : 'none',
          }}
        >
          Ver oferta
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
