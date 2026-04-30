// ─── Font ─────────────────────────────────────────────────────────────────────
export const appFontFamily = "'Plus Jakarta Sans', system-ui, sans-serif"

// ─── Colors ───────────────────────────────────────────────────────────────────
export const colors = {
  // Blues
  navyDeep:   '#001851',
  navy:       '#03246F',
  blue:       '#055ECE',
  blue2:      '#1844b8',
  blueBrand:  '#2350c8',
  blueMid:    '#1878DE',
  blueLight:  '#1DA1EB',
  blueSubtle: '#e8eeff',
  blueTint:   '#c2d0f8',
  blueHaze:   '#EEF5FF',

  // Cyan
  cyan:       '#00E7FF',
  cyanSoft:   'rgba(0,231,255,0.12)',
  cyanBorder: 'rgba(0,231,255,0.34)',

  // Greens
  green:        '#007A52',
  greenAccent:  '#16a364',
  greenDark:    '#0a6640',
  greenSoft:    '#E9F8F1',
  greenBg:      '#e8f5ee',
  greenBorder:  '#BDECD7',
  greenMid:     '#b8e0ca',

  // Gold
  gold:       '#F6C453',
  goldText:   '#7a5200',
  goldBtn:    '#a87000',
  goldBody:   '#9b7020',
  goldSoft:   '#FFF7DD',
  goldBg:     '#fffbf0',
  goldBorder: '#edddb0',
  goldIcon:   '#fde9a0',

  // Red / Danger
  red:      '#A51D2D',
  danger:   '#b32727',
  dangerAlt:'#d94b4b',
  dangerBg: '#fff1f1',

  // Warning
  warning:   '#9a6500',
  warningBg: '#fff6e7',

  // Neutrals
  text:   '#071B45',
  muted:  '#64748B',
  mutedAlt: '#7a8db8',
  line:   '#DDE8F6',
  lineAlt: '#e4eaf8',
  bg:     '#F6FAFF',
  bgAlt:  '#f4f7fd',
  white:  '#FFFFFF',
  cardBorder: '#e6ecf8',
}

// ─── Typography ───────────────────────────────────────────────────────────────
export const fontWeight = {
  regular:   400,
  medium:    500,
  semibold:  600,
  bold:      700,
  extrabold: 800,
  black:     900,
  heavy:     950,
}

// ─── Spacing (px) ─────────────────────────────────────────────────────────────
export const spacing = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  28,
  8:  32,
  9:  36,
  10: 40,
}

// ─── Border radius (px) ───────────────────────────────────────────────────────
export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 28,
  pill: 999,
}

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const shadow = {
  sm:       '0 2px 10px rgba(0,0,0,.08)',
  md:       '0 8px 24px rgba(3,36,111,.07)',
  lg:       '0 8px 28px rgba(0,24,81,.09)',
  xl:       '0 16px 40px rgba(3,36,111,.11)',
  xxl:      '0 20px 56px rgba(5,94,206,.13)',
  card:     '0 8px 28px rgba(0,24,81,.09)',
  cardHover:'0 16px 48px rgba(3,36,111,.11)',
  cardSelected: '0 20px 56px rgba(5,94,206,.13), 0 0 0 4px rgba(0,231,255,.08)',
  header:   '0 8px 28px rgba(3,36,111,.22)',
  bottomBar:'0 -12px 36px rgba(3,36,111,.11)',
  green:    '0 16px 40px rgba(0,122,82,.10)',
  button:   '0 14px 32px rgba(5,94,206,.30)',
  buttonSm: '0 8px 20px rgba(5,94,206,.25)',
}

// ─── Gradients ────────────────────────────────────────────────────────────────
export const gradient = {
  topbar:        'linear-gradient(105deg,#03246F 0%,#0449A8 55%,#03246F 100%)',
  button:        'linear-gradient(160deg,#055ECE 0%,#044EAF 100%)',
  buttonLegacy:  'linear-gradient(160deg,#1e4aaa,#12307a)',
  brand:         'linear-gradient(90deg,#055ECE,#00E7FF)',
  brandAccent:   'linear-gradient(135deg,#055ECE,#00aadd)',
  cardSelected:  'linear-gradient(160deg,#f0faff 0%,#fff 60%)',
  greenCard:     'linear-gradient(160deg,#edfff6 0%,#fff 70%)',
  greenCardMid:  'linear-gradient(160deg,#f2fff9 0%,#fff 70%)',
  pageBg:        'linear-gradient(160deg,#eaf4ff 0%,#f4f9ff 45%,#f8fdff 100%)',
  mesh: [
    "radial-gradient(ellipse 70% 55% at 8%  4%,  rgba(5,94,206,0.10)  0%, transparent 100%)",
    "radial-gradient(ellipse 55% 45% at 95% 6%,  rgba(0,231,255,0.06) 0%, transparent 100%)",
    "radial-gradient(ellipse 50% 40% at 92% 60%, rgba(24,120,222,0.07) 0%, transparent 100%)",
    "radial-gradient(ellipse 60% 50% at 4%  92%, rgba(0,122,82,0.07)  0%, transparent 100%)",
    "radial-gradient(ellipse 70% 60% at 50% 100%,rgba(0,231,255,0.05) 0%, transparent 100%)",
    "linear-gradient(160deg, #eaf4ff 0%, #f4f9ff 45%, #f8fdff 100%)",
  ].join(','),
  grain: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23g)' opacity='0.038'/%3E%3C/svg%3E")`,
  appBackgroundSize: '260px 260px, cover, cover, cover, cover, cover, cover',
  appBackgroundRepeat: 'repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat',
  appBackgroundPosition: '0 0, center, center, center, center, center, center',
}

gradient.appBackground = `${gradient.grain}, ${gradient.mesh}`

// ─── Legacy shape (backward-compat com código existente) ──────────────────────
export const theme = {
  phi: 1.618,
  // blues
  navy:        colors.navyDeep,
  blue:        colors.blueBrand,
  blue2:       colors.blue2,
  blueLight:   colors.blueSubtle,
  blueMid:     colors.blueTint,
  // text
  text:        colors.text,
  muted:       colors.mutedAlt,
  line:        colors.lineAlt,
  // greens
  green:       colors.greenDark,
  greenBg:     colors.greenBg,
  greenAccent: colors.greenAccent,
  // danger
  danger:      colors.danger,
  dangerBg:    colors.dangerBg,
  // bg
  bg:          colors.bgAlt,
  cardBorder:  colors.cardBorder,
  // shadows / radius / spacing (legacy shape)
  // aliases de compatibilidade usados por MiniCard e páginas legadas
  goldLine:    colors.goldBorder,
  goldBtn:     colors.goldBtn,
  goldBody:    colors.goldBody,
  goldIcon:    colors.goldIcon,
  greenSoft:   colors.greenDark,
  greenBorder: colors.greenBorder,
  warning:     colors.warning,
  warningBg:   colors.warningBg,
  cardShadow:  shadow.card,
  cardRadiusSm: radius.sm + 5,
  cardRadiusMd: radius.xxl - 3,
  cardPadY:    spacing[3],
  cardPadX:    spacing[5] + 1,
}

export const appPageStyle = {
  minHeight: '100vh',
  background: gradient.appBackground,
  backgroundSize: gradient.appBackgroundSize,
  backgroundRepeat: gradient.appBackgroundRepeat,
  backgroundPosition: gradient.appBackgroundPosition,
  fontFamily: appFontFamily,
  color: colors.text,
}
