// Objeto t compartilhado pelas páginas que ainda usam o padrão legado.
// Combina o theme legado com os novos tokens de cores e sombra.
// Evita repetir `const t = { ...theme, ...colors, shadow: shadow.card }` em cada página.
import { theme, colors, shadow } from '../ui/theme'

export const t = { ...theme, ...colors, shadow: shadow.card }
