import { useEffect, useId, useRef, useState } from 'react'
import logoSvg from '../assets/logo.svg'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { toClientCallName } from '../lib/formatters'
import { appFontFamily, theme } from '../ui/theme'

const DESKTOP_HEADER_HEIGHT = 72
const TABLET_HEADER_HEIGHT = 72
const MOBILE_HEADER_HEIGHT = 72
const MOBILE_LOGO_ICON_SIZE = 52

function ClientMenu({ actions = [], compact = false, clientName = 'Cliente' }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const displayName = toClientCallName(clientName)

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
        aria-label={hasActions ? 'Abrir menu do cliente' : 'Menu do cliente'}
        style={{
          borderRadius: compact ? 10 : 12,
          border: '1px solid rgba(255,255,255,.14)',
          background: 'rgba(255,255,255,.08)',
          padding: compact ? '8px 10px' : '8px 12px',
          minHeight: compact ? 40 : 40,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? 7 : 9,
          cursor: hasActions ? 'pointer' : 'default',
          boxShadow: '0 2px 10px rgba(0,0,0,.12)',
          fontFamily: appFontFamily,
          maxWidth: compact ? 190 : 260,
        }}
      >
        <svg
          aria-hidden="true"
          width={compact ? 16 : 18}
          height={compact ? 16 : 18}
          viewBox="0 0 24 24"
          fill="none"
          style={{ display: 'block' }}
        >
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#fff" strokeWidth="1.8" />
          <path d="M5 20c1.8-3.6 5-5 7-5s5.2 1.4 7 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span
          style={{
            display: 'grid',
            gap: 1,
            minWidth: 0,
            textAlign: 'left',
            lineHeight: 1.1,
          }}
        >
          {!compact ? (
            <span
              style={{
                color: 'rgba(255,255,255,.48)',
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
              }}
            >
              Cliente
            </span>
          ) : null}
          <span
            style={{
              color: '#fff',
              fontSize: compact ? 12 : 14,
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: compact ? 118 : 180,
            }}
          >
            {displayName}
          </span>
        </span>
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
  onLogoClick,
  actions = [],
  clientName = 'Cliente',
  fixed = false,
  sticky = true,
  minHeight: minHeightProp,
  paddingRight,
}) {
  const isTabletHeader = useMediaQuery('(max-width: 1079px)')

  const headerMinHeight = minHeightProp ?? (isTabletHeader ? TABLET_HEADER_HEIGHT : DESKTOP_HEADER_HEIGHT)
  const headerHorizontalPadding = isTabletHeader ? 18 : 24
  const logoHeight = isTabletHeader ? 36 : 72

  return (
    <div
      style={{
        background: theme.navy,
        minHeight: headerMinHeight,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${paddingRight != null ? paddingRight : headerHorizontalPadding}px 0 ${headerHorizontalPadding}px`,
        position: fixed ? 'fixed' : sticky ? 'sticky' : 'relative',
        top: (fixed || sticky) ? 0 : undefined,
        left: fixed ? 0 : undefined,
        right: fixed ? 0 : undefined,
        width: fixed ? '100%' : undefined,
        zIndex: 40,
        boxShadow: '0 2px 16px rgba(0,0,0,.18)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', right: -60, top: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(35,86,216,.15)' }} />
        <div style={{ position: 'absolute', right: 80, top: 10, width: 140, height: 140, borderRadius: '50%', background: 'rgba(35,86,216,.08)' }} />
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '8px 12px' }}>
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Ir para ofertas"
            style={{
              border: 0,
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              minHeight: 0,
              margin: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              alignSelf: 'center',
              lineHeight: 0,
            }}
          >
            <img src={logoSvg} alt="" aria-hidden="true" style={{ height: logoHeight, width: 'auto', display: 'block', margin: 0 }} />
          </button>
          <div aria-hidden="true" />

          <div style={{ justifySelf: 'end' }}>
            <ClientMenu actions={actions} clientName={clientName} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobilePageHeader({
  onLogoClick,
  actions = [],
  clientName = 'Cliente',
  fixed = false,
  sticky = true,
  minHeight: minHeightProp,
  paddingRight,
}) {
  return (
    <div
      style={{
        background: theme.navy,
        padding: `max(8px, env(safe-area-inset-top)) ${paddingRight != null ? paddingRight : 14}px 8px 14px`,
        minHeight: minHeightProp ?? MOBILE_HEADER_HEIGHT,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 16px rgba(0,0,0,.18)',
        position: fixed ? 'fixed' : sticky ? 'sticky' : 'relative',
        top: (fixed || sticky) ? 0 : undefined,
        left: fixed ? 0 : undefined,
        right: fixed ? 0 : undefined,
        width: fixed ? '100%' : undefined,
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
          <img src={logoSvg} alt="" aria-hidden="true" style={{ height: MOBILE_LOGO_ICON_SIZE, width: 'auto' }} />
        </button>
        <div aria-hidden="true" />

        <div style={{ marginLeft: 'auto', justifySelf: 'end' }}>
          <ClientMenu actions={actions} compact clientName={clientName} />
        </div>
      </div>
    </div>
  )
}
