export const CARD_SELECTION = {
  transition: 'transform .18s ease, border-color .18s ease, box-shadow .18s ease',
  baseBorder: '#dbe6f7',
  hoverBorder: '#b8cef5',
  selectedBorder: 'rgba(0,231,255,.65)',
  baseShadow: 'none',
  hoverShadow: '0 12px 30px rgba(3,36,111,.09)',
  selectedShadow: '0 0 0 3px rgba(0,231,255,.10)',
  hoverBackground: '#F8FBFF',
  selectedBackground: '#F4FBFF',
}

export function getSelectableCardStyle({ selected, hovered, baseBackground, hoverBackground, selectedBackground }) {
  const background = selected
    ? (selectedBackground || CARD_SELECTION.selectedBackground)
    : hovered
      ? (hoverBackground || CARD_SELECTION.hoverBackground)
      : baseBackground

  return {
    borderColor: selected ? CARD_SELECTION.selectedBorder : hovered ? CARD_SELECTION.hoverBorder : CARD_SELECTION.baseBorder,
    boxShadow: selected ? CARD_SELECTION.selectedShadow : hovered ? CARD_SELECTION.hoverShadow : CARD_SELECTION.baseShadow,
    ...(background ? { background } : {}),
    transform: hovered && !selected ? 'translateY(-1px)' : 'none',
    transition: CARD_SELECTION.transition,
    willChange: 'transform, box-shadow, border-color',
  }
}
