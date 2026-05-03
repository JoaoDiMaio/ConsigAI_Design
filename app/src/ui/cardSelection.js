export const CARD_SELECTION = {
  transition: 'transform .2s ease, border-color .2s ease, box-shadow .2s ease',
  baseBorder: '#dbe6f7',
  hoverBorder: '#b8cef5',
  selectedBorder: 'rgba(0,231,255,.65)',
  baseShadow: 'none',
  hoverShadow: '0 16px 40px rgba(3,36,111,.11)',
  selectedShadow: '0 20px 56px rgba(5,94,206,.13), 0 0 0 4px rgba(0,231,255,.08)',
}

export function getSelectableCardStyle({ selected, hovered }) {
  return {
    borderColor: selected ? CARD_SELECTION.selectedBorder : hovered ? CARD_SELECTION.hoverBorder : CARD_SELECTION.baseBorder,
    boxShadow: selected ? CARD_SELECTION.selectedShadow : hovered ? CARD_SELECTION.hoverShadow : CARD_SELECTION.baseShadow,
    transform: hovered && !selected ? 'translateY(-3px)' : 'none',
    transition: CARD_SELECTION.transition,
    willChange: 'transform, box-shadow, border-color',
  }
}
