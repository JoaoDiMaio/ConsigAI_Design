import { appFontFamily, colors, gradient } from '../ui/theme'

/**
 * Wrapper de página com mesh gradient + grain.
 * Substitui o padrão de background inline repetido em todas as telas.
 */
export function PageBackground({ children, style: styleProp }) {
  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: appFontFamily,
      color: colors.text,
      background: gradient.appBackground,
      backgroundSize: gradient.appBackgroundSize,
      backgroundRepeat: gradient.appBackgroundRepeat,
      backgroundPosition: gradient.appBackgroundPosition,
      paddingBottom: 110,
      overflowX: 'hidden',
      position: 'relative',
      ...styleProp,
    }}>
      {children}
    </div>
  )
}

/**
 * Container de conteúdo centralizado.
 */
export function PageContent({ children, style: styleProp }) {
  return (
    <main style={{
      maxWidth: 1120,
      margin: '28px auto 0',
      padding: '0 20px',
      position: 'relative',
      zIndex: 1,
      ...styleProp,
    }}>
      {children}
    </main>
  )
}

/**
 * Barra inferior fixa com CTA.
 */
export function BottomBar({ children }) {
  return (
    <div style={{
      position: 'fixed',
      left: 0, right: 0, bottom: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,.96)',
      borderTop: `1px solid ${colors.line}`,
      backdropFilter: 'blur(20px)',
      boxShadow: '0 -12px 36px rgba(3,36,111,.11)',
    }}>
      <div style={{
        maxWidth: 1120,
        margin: '0 auto',
        padding: '0 20px',
        minHeight: 80,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
      }}>
        {children}
      </div>
    </div>
  )
}
