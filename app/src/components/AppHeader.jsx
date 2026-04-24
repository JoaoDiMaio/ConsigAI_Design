import { useEffect, useId, useRef, useState } from 'react'
import logoSvg from '../assets/logo.svg'
import logoIconSvg from '../assets/logo-icon.svg'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { appFontFamily, theme } from '../ui/theme'

const DESKTOP_HEADER_HEIGHT = 72
const TABLET_HEADER_HEIGHT = 72
const MOBILE_HEADER_HEIGHT = 72
const MOBILE_LOGO_ICON_SIZE = 34

function toClientCallName(clientName) {
  const full = String(clientName || '').trim()
  if (!full) return 'Cliente'

  const firstName = full.split(/\s+/)[0]
  const femaleFirstNames = new Set([
    'maria', 'ana', 'mariana', 'juliana', 'patricia', 'fernanda', 'carla', 'paula', 'renata', 'beatriz',
    'camila', 'bruna', 'aline', 'leticia', 'daniela', 'adriana', 'simone', 'fabiana', 'claudia',
  ])

  const normalizedFirst = firstName.toLowerCase()
  const honorific = femaleFirstNames.has(normalizedFirst) || /a$/.test(normalizedFirst) ? 'Sra.' : 'Sr.'
  return `${honorific} ${firstName}`
}

function ClientMenu({ clientName, actions = [], compact = false }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!wrapperRef.current || wrapperRef.current.contains(event.target)) return
      setOpen(false)
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const hasActions = actions.length > 0
  const menuId = useId()

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={hasActions ? menuId : undefined}
        style={{
          borderRadius: compact ? 10 : 12,
          border: '1px solid rgba(255,255,255,.14)',
          background: 'rgba(255,255,255,.08)',
          padding: compact ? '4px 8px 5px' : '5px 12px 6px',
          minHeight: compact ? 40 : 40,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          cursor: hasActions ? 'pointer' : 'default',
          boxShadow: '0 2px 10px rgba(0,0,0,.12)',
          fontFamily: appFontFamily,
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '.07em', color: 'rgba(255,255,255,.66)', fontWeight: 700, lineHeight: 1 }}>
            Cliente
          </div>
            <div style={{ marginTop: 2, fontSize: compact ? 11 : 12, fontWeight: 700, color: '#fff', maxWidth: compact ? 136 : 170, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
              {clientName}
            </div>
          </div>
        {hasActions ? (
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform .15s ease',
              display: 'inline-block',
            }}
          >
            <path d="M3 6l5 5 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </button>

      {hasActions && open ? (
        <div
          id={menuId}
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: compact ? 160 : 180,
            maxWidth: 'calc(100vw - 24px)',
            borderRadius: 12,
            background: '#fff',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: '0 12px 28px rgba(0,24,81,.18)',
            padding: 6,
            zIndex: 30,
            overflow: 'auto',
          }}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false)
                action.onClick?.()
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                border: 0,
                borderRadius: 8,
                background: '#fff',
                color: theme.text,
                padding: '9px 10px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: appFontFamily,
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function DesktopPageHeader({
  clientName,
  chipLabel,
  title,
  subtitle,
  onLogoClick,
  actions = [],
}) {
  const displayClientName = toClientCallName(clientName)
  const isTabletHeader = useMediaQuery('(max-width: 1079px)')

  const headerMinHeight = isTabletHeader ? TABLET_HEADER_HEIGHT : DESKTOP_HEADER_HEIGHT
  const headerHorizontalPadding = isTabletHeader ? 18 : 24
  const headerGrid = isTabletHeader ? '190px minmax(0, 1fr) auto' : '214px minmax(0, 1fr) auto'
  const logoHeight = isTabletHeader ? 36 : 40
  const titleFontSize = isTabletHeader ? 15 : 16
  const subtitleFontSize = 11
  const subtitleClamp = 1

  return (
    <div
      style={{
        background: theme.navy,
        minHeight: headerMinHeight,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${headerHorizontalPadding}px`,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 2px 16px rgba(0,0,0,.18)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', right: -60, top: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(35,86,216,.15)' }} />
        <div style={{ position: 'absolute', right: 80, top: 10, width: 140, height: 140, borderRadius: '50%', background: 'rgba(35,86,216,.08)' }} />
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: headerGrid, alignItems: 'center', gap: '8px 12px' }}>
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Ir para ofertas"
            style={{
              border: 0,
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              minHeight: logoHeight,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              alignSelf: 'center',
              lineHeight: 0,
            }}
          >
            <img src={logoSvg} alt="ConsigAI" style={{ height: logoHeight, width: 'auto', display: 'block' }} />
          </button>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.14)', padding: '3px 10px 3px 7px', marginBottom: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: theme.greenAccent }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: 'rgba(255,255,255,.72)', textTransform: 'uppercase' }}>{chipLabel}</span>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: titleFontSize,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-.01em',
                lineHeight: 1.2,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: subtitleFontSize,
                color: 'rgba(255,255,255,.45)',
                fontWeight: 500,
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: subtitleClamp,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {subtitle}
            </p>
          </div>

          <div style={{ justifySelf: 'end' }}>
            <ClientMenu clientName={displayClientName} actions={actions} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobilePageHeader({
  clientName,
  chipLabel,
  title,
  subtitle,
  onLogoClick,
  actions = [],
}) {
  const displayClientName = toClientCallName(clientName)

  return (
    <div
      style={{
        background: theme.navy,
        padding: 'max(8px, env(safe-area-inset-top)) 14px 8px',
        minHeight: MOBILE_HEADER_HEIGHT,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 16px rgba(0,0,0,.18)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 8, minHeight: 46, width: '100%' }}>
        <button
          type="button"
          onClick={onLogoClick}
          aria-label="Ir para ofertas"
          style={{ border: 0, background: 'transparent', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', minHeight: 46, lineHeight: 0 }}
        >
          <img src={logoIconSvg} alt="" aria-hidden="true" style={{ height: MOBILE_LOGO_ICON_SIZE, width: MOBILE_LOGO_ICON_SIZE }} />
          <span style={{ fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: '-.01em', lineHeight: 1 }}>ConsigAI</span>
        </button>

        <div style={{ minWidth: 0 }}>
          {chipLabel ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.14)', padding: '2px 8px 2px 6px', marginBottom: 2 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: theme.greenAccent }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.07em', color: 'rgba(255,255,255,.72)', textTransform: 'uppercase' }}>{chipLabel}</span>
            </div>
          ) : null}
          {title ? (
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', lineHeight: 1.2 }}>
              {title}
            </div>
          ) : null}
          {subtitle ? (
            <div style={{ marginTop: 1, fontSize: 10, color: 'rgba(255,255,255,.45)', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', lineHeight: 1.2 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ marginLeft: 'auto', justifySelf: 'end' }}>
          <ClientMenu clientName={displayClientName} actions={actions} compact />
        </div>
      </div>
    </div>
  )
}
