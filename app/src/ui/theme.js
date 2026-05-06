export const appFontFamily = "'Plus Jakarta Sans', system-ui, sans-serif"

// Canonical color decisions for the ConsigAI product.
// Keep this file as the single source of truth when unifying colors.
export const semanticColors = {
  brandPrimary: '#043B8B',
  brandDark: '#002D6E',
  brandInteractive: '#2454D6',
  brandSoft: '#F4F9FF',
  brandSurface: '#FFFFFF',
  brandAccent: '#1DA1EB',
  logoCyan: '#00E7FF',

  success: '#00A86B',
  successDark: '#007A52',
  successSoft: '#F0FFF8',
  successBorder: '#BDECD7',

  textPrimary: '#071B45',
  textSecondary: '#64748B',
  textMuted: '#8A9AB8',

  border: '#DDE8F6',
  borderStrong: '#BFD4F6',
  surfaceSubtle: '#F8FBFF',
  pageBg: '#F6FAFF',
  pageBgAlt: '#F4F9FF',

  warning: '#9A6500',
  warningSoft: '#FFF6E7',
  warningBorder: '#F2D8A9',

  error: '#B32727',
  errorStrong: '#E53E3E',
  errorSoft: '#FFF1F1',
  errorBorder: '#F1C2C2',

  selectedBorder: '#2454D6',
  selectedSoft: '#F4F9FF',
  selectedHover: '#EAF4FF',
}

export const colorDocumentation = [
  { token: '--color-brand-primary', hex: semanticColors.brandPrimary, role: 'CTA principal, marca, links e seleção principal.' },
  { token: '--color-brand-dark', hex: semanticColors.brandDark, role: 'Títulos, números financeiros principais e header institucional.' },
  { token: '--color-brand-interactive', hex: semanticColors.brandInteractive, role: 'Hover, foco, borda selecionada e ícones interativos.' },
  { token: '--color-brand-soft', hex: semanticColors.brandSoft, role: 'Fundos suaves, cards neutros e áreas de simulação.' },
  { token: '--color-success', hex: semanticColors.success, role: 'Economia, ganho, redução de custo e benefício financeiro.' },
  { token: '--color-success-dark', hex: semanticColors.successDark, role: 'Texto positivo e títulos curtos de economia.' },
  { token: '--color-success-soft', hex: semanticColors.successSoft, role: 'Blocos positivos e estado visual de ganho.' },
  { token: '--color-success-border', hex: semanticColors.successBorder, role: 'Borda de cards positivos e comparações favoráveis.' },
  { token: '--color-text-primary', hex: semanticColors.textPrimary, role: 'Texto principal e labels de alta importância.' },
  { token: '--color-text-secondary', hex: semanticColors.textSecondary, role: 'Texto auxiliar, descrições e microcopy.' },
  { token: '--color-border', hex: semanticColors.border, role: 'Bordas neutras, divisores e inputs padrão.' },
  { token: '--color-surface', hex: semanticColors.brandSurface, role: 'Cards, painéis e superfícies principais.' },
  { token: '--color-warning', hex: semanticColors.warning, role: 'Estimado, sujeito à análise e atenção leve.' },
  { token: '--color-error', hex: semanticColors.error, role: 'Erro real, validação e falha operacional.' },
]

export function cssVarsBlock(tokenMap) {
  return Object.entries(tokenMap)
    .map(([token, value]) => `  ${token}: ${value};`)
    .join('\n')
}

export const colorTokenMap = {
  '--color-brand-primary': semanticColors.brandPrimary,
  '--color-brand-dark': semanticColors.brandDark,
  '--color-brand-interactive': semanticColors.brandInteractive,
  '--color-brand-soft': semanticColors.brandSoft,
  '--color-brand-accent': semanticColors.brandAccent,
  '--color-logo-cyan': semanticColors.logoCyan,
  '--color-success': semanticColors.success,
  '--color-success-dark': semanticColors.successDark,
  '--color-success-soft': semanticColors.successSoft,
  '--color-success-border': semanticColors.successBorder,
  '--color-text-primary': semanticColors.textPrimary,
  '--color-text-secondary': semanticColors.textSecondary,
  '--color-text-muted': semanticColors.textMuted,
  '--color-border': semanticColors.border,
  '--color-border-strong': semanticColors.borderStrong,
  '--color-surface': semanticColors.brandSurface,
  '--color-surface-subtle': semanticColors.surfaceSubtle,
  '--color-page-bg': semanticColors.pageBg,
  '--color-page-bg-alt': semanticColors.pageBgAlt,
  '--color-warning': semanticColors.warning,
  '--color-warning-soft': semanticColors.warningSoft,
  '--color-warning-border': semanticColors.warningBorder,
  '--color-error': semanticColors.error,
  '--color-error-strong': semanticColors.errorStrong,
  '--color-error-soft': semanticColors.errorSoft,
  '--color-error-border': semanticColors.errorBorder,
  '--color-selected-border': semanticColors.selectedBorder,
  '--color-selected-soft': semanticColors.selectedSoft,
  '--color-selected-hover': semanticColors.selectedHover,
}

// Bridge for pages that still use local aliases such as --blue-dark / --green.
export const onboardingAliasVars = {
  ...colorTokenMap,
  '--blue-dark': 'var(--color-brand-dark)',
  '--blue-deep': '#06184E',
  '--blue-main': 'var(--color-brand-primary)',
  '--logo-blue': 'var(--color-brand-interactive)',
  '--cyan': 'var(--color-brand-accent)',
  '--green': 'var(--color-success)',
  '--green-dark': 'var(--color-success-dark)',
  '--green-soft': 'var(--color-success-soft)',
  '--green-line': 'var(--color-success-border)',
  '--muted': 'var(--color-text-secondary)',
  '--muted-soft': 'var(--color-text-muted)',
  '--line': 'var(--color-border)',
  '--line-strong': 'var(--color-border-strong)',
  '--blue-soft': 'var(--color-brand-soft)',
  '--white': 'var(--color-surface)',
  '--warning': 'var(--color-warning)',
  '--warning-soft': 'var(--color-warning-soft)',
  '--error': 'var(--color-error)',
  '--error-soft': 'var(--color-error-soft)',
  '--shadow': '0 24px 68px rgba(3, 36, 111, 0.12)',
  '--soft-shadow': '0 16px 38px rgba(3, 36, 111, 0.08)',
}

export const onboardingAliasVarsCss = cssVarsBlock(onboardingAliasVars)

export const colors = {
  brandPrimary: semanticColors.brandPrimary,
  brandDark: semanticColors.brandDark,
  brandInteractive: semanticColors.brandInteractive,
  brandSoft: semanticColors.brandSoft,
  brandSurface: semanticColors.brandSurface,
  brandAccent: semanticColors.brandAccent,
  logoCyan: semanticColors.logoCyan,

  success: semanticColors.success,
  successDark: semanticColors.successDark,
  successSoft: semanticColors.successSoft,
  successBorder: semanticColors.successBorder,

  textPrimary: semanticColors.textPrimary,
  textSecondary: semanticColors.textSecondary,
  textMuted: semanticColors.textMuted,
  border: semanticColors.border,
  borderStrong: semanticColors.borderStrong,
  surfaceSubtle: semanticColors.surfaceSubtle,
  pageBg: semanticColors.pageBg,
  pageBgAlt: semanticColors.pageBgAlt,
  warning: semanticColors.warning,
  warningSoft: semanticColors.warningSoft,
  warningBorder: semanticColors.warningBorder,
  error: semanticColors.error,
  errorStrong: semanticColors.errorStrong,
  errorSoft: semanticColors.errorSoft,
  errorBorder: semanticColors.errorBorder,
  selectedBorder: semanticColors.selectedBorder,
  selectedSoft: semanticColors.selectedSoft,
  selectedHover: semanticColors.selectedHover,

  // Legacy palette kept while pages migrate to semantic names.
  navyDeep: '#001851',
  navy: '#03246F',
  blue: '#055ECE',
  blue2: '#1844B8',
  blueBrand: '#2350C8',
  blueMid: '#1878DE',
  blueLight: semanticColors.brandAccent,
  blueSubtle: '#E8EEFF',
  blueTint: '#C2D0F8',
  blueHaze: '#EEF5FF',

  cyan: semanticColors.logoCyan,
  cyanSoft: 'rgba(0,231,255,0.12)',
  cyanBorder: 'rgba(0,231,255,0.34)',

  green: semanticColors.successDark,
  greenAccent: semanticColors.success,
  greenDark: semanticColors.successDark,
  greenSoft: semanticColors.successSoft,
  greenBg: semanticColors.successSoft,
  greenBorder: semanticColors.successBorder,
  greenMid: '#B8E0CA',

  gold: '#F6C453',
  goldText: '#7A5200',
  goldBtn: '#A87000',
  goldBody: '#9B7020',
  goldSoft: '#FFF7DD',
  goldBg: '#FFFBF0',
  goldBorder: '#EDDDB0',
  goldIcon: '#FDE9A0',

  red: '#A51D2D',
  danger: semanticColors.error,
  dangerAlt: semanticColors.errorStrong,
  dangerBg: semanticColors.errorSoft,

  text: semanticColors.textPrimary,
  muted: semanticColors.textSecondary,
  mutedAlt: '#7A8DB8',
  line: semanticColors.border,
  lineAlt: '#E4EAF8',
  bg: semanticColors.pageBg,
  bgAlt: semanticColors.pageBgAlt,
  white: semanticColors.brandSurface,
  cardBorder: '#E6ECF8',
}

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
  heavy: 950,
}

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
}

export const radius = {
  sm: 8,
  md: 13,
  lg: 21,
  xl: 28,
  xxl: 28,
  xxxl: 34,
  hero: 34,
  pill: 999,
}

export const shadow = {
  sm: '0 2px 10px rgba(0,0,0,.08)',
  md: '0 8px 24px rgba(3,36,111,.07)',
  lg: '0 8px 28px rgba(0,24,81,.09)',
  xl: '0 16px 40px rgba(3,36,111,.11)',
  xxl: '0 20px 56px rgba(5,94,206,.13)',
  card: '0 8px 28px rgba(0,24,81,.09)',
  cardHover: '0 16px 48px rgba(3,36,111,.11)',
  cardSelected: '0 20px 56px rgba(36,84,214,.14), 0 0 0 2px rgba(36,84,214,.12)',
  header: '0 8px 28px rgba(3,36,111,.22)',
  bottomBar: '0 -12px 36px rgba(3,36,111,.11)',
  green: '0 16px 40px rgba(0,122,82,.10)',
  button: '0 14px 32px rgba(4,59,139,.30)',
  buttonSm: '0 8px 20px rgba(4,59,139,.22)',
}

export const gradient = {
  topbar: `linear-gradient(105deg, ${colors.navy} 0%, ${semanticColors.brandPrimary} 55%, ${colors.navy} 100%)`,
  button: `linear-gradient(160deg, ${semanticColors.brandPrimary} 0%, ${semanticColors.brandDark} 100%)`,
  buttonLegacy: 'linear-gradient(160deg,#1e4aaa,#12307a)',
  brand: `linear-gradient(90deg, ${semanticColors.brandPrimary}, ${semanticColors.brandInteractive})`,
  brandAccent: `linear-gradient(135deg, ${semanticColors.brandPrimary}, ${semanticColors.brandAccent})`,
  cardSelected: `linear-gradient(160deg, ${semanticColors.selectedSoft} 0%, #fff 60%)`,
  greenCard: 'linear-gradient(160deg,#edfff6 0%,#fff 70%)',
  greenCardMid: 'linear-gradient(160deg,#f2fff9 0%,#fff 70%)',
  pageBg: 'linear-gradient(160deg,#eaf4ff 0%,#f4f9ff 45%,#f8fdff 100%)',
  mesh: [
    'radial-gradient(ellipse 70% 55% at 8% 4%, rgba(4,59,139,0.10) 0%, transparent 100%)',
    'radial-gradient(ellipse 55% 45% at 95% 6%, rgba(29,161,235,0.06) 0%, transparent 100%)',
    'radial-gradient(ellipse 50% 40% at 92% 60%, rgba(36,84,214,0.07) 0%, transparent 100%)',
    'radial-gradient(ellipse 60% 50% at 4% 92%, rgba(0,122,82,0.07) 0%, transparent 100%)',
    'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(29,161,235,0.05) 0%, transparent 100%)',
    'linear-gradient(160deg, #eaf4ff 0%, #f4f9ff 45%, #f8fdff 100%)',
  ].join(','),
  grain: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23g)' opacity='0.038'/%3E%3C/svg%3E")`,
  appBackgroundSize: '260px 260px, cover, cover, cover, cover, cover, cover',
  appBackgroundRepeat: 'repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat',
  appBackgroundPosition: '0 0, center, center, center, center, center, center',
}

gradient.appBackground = `${gradient.grain}, ${gradient.mesh}`

export const theme = {
  phi: 1.618,
  navy: colors.navyDeep,
  blue: colors.brandPrimary,
  blue2: colors.blue2,
  blueLight: colors.brandSoft,
  blueMid: colors.borderStrong,
  text: colors.textPrimary,
  muted: colors.textSecondary,
  line: colors.border,
  green: colors.successDark,
  greenBg: colors.successSoft,
  greenAccent: colors.success,
  danger: colors.error,
  dangerBg: colors.errorSoft,
  bg: colors.pageBgAlt,
  cardBorder: colors.border,
  goldLine: colors.goldBorder,
  goldBtn: colors.goldBtn,
  goldBody: colors.goldBody,
  goldIcon: colors.goldIcon,
  greenSoft: colors.successSoft,
  greenBorder: colors.successBorder,
  warning: colors.warning,
  warningBg: colors.warningSoft,
  cardShadow: shadow.card,
  cardRadiusSm: radius.sm + 5,
  cardRadiusMd: radius.xxl - 3,
  cardPadY: spacing[3],
  cardPadX: spacing[5] + 1,
}

export const appPageStyle = {
  minHeight: '100vh',
  background: 'transparent',
  fontFamily: appFontFamily,
  color: colors.textPrimary,
}
