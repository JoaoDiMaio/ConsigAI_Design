import { test, expect } from 'playwright/test'

const CRITICAL_ROUTES = [
  { name: 'Entrada', path: '/entrada' },
  { name: 'Cadastro', path: '/cadastro' },
  { name: 'UploadExtrato', path: '/upload-extrato' },
  { name: 'CarregamentoOfertas', path: '/carregamento-ofertas' },
  { name: 'Ofertas', path: '/ofertas' },
  { name: 'NovoContrato', path: '/novo-contrato' },
  { name: 'Refinanciamento', path: '/refinanciamento' },
  { name: 'Portabilidade', path: '/portabilidade' },
  { name: 'EstrategiaCombinada', path: '/estrategia-combinada' },
  { name: 'Configuracoes', path: '/configuracoes' },
  { name: 'DadosBancarios', path: '/dados-bancarios' },
  { name: 'Contratacao', path: '/contratacao' },
  { name: 'AndamentoPropostas', path: '/acompanhamento' },
]

for (const route of CRITICAL_ROUTES) {
  test(`${route.name} renderiza sem erro crítico`, async ({ page }) => {
    const consoleErrors = []
    const pageErrors = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => {
      pageErrors.push(err.message)
    })

    await page.goto(route.path, { waitUntil: 'networkidle' })

    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('#root')).toBeVisible()

    const rootContent = page.locator('#root > :not(style)').first()
    await expect(rootContent).toBeVisible()

    const rootText = (await page.locator('#root').textContent())?.trim() ?? ''
    expect.soft(rootText.length, `${route.name} sem conteúdo textual`).toBeGreaterThan(0)

    expect.soft(pageErrors, `${route.name} teve pageerror`).toEqual([])
    expect.soft(consoleErrors, `${route.name} teve console.error`).toEqual([])
  })
}
