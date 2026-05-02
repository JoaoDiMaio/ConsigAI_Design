import { createElement } from 'react'

export const BRAND_AI_COLOR = '#1DA1EB'

export function BrandName({ as, className, style, ...props }) {
  const Component = as || 'span'
  const mergedStyle = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    ...style,
  }
  return createElement(
    Component,
    { className, style: mergedStyle, ...props },
    createElement('span', { style: { color: 'inherit', fontWeight: 'inherit' } }, 'Consig'),
    createElement('span', { style: { color: BRAND_AI_COLOR, fontWeight: 'inherit', display: 'inline' } }, 'AI'),
  )
}
