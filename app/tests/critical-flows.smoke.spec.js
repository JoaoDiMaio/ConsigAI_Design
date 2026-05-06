import { test, expect } from 'playwright/test'

test('Entrada navega para Cadastro pelo CTA secundário', async ({ page }) => {
  await page.goto('/entrada', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Criar minha conta' }).click()
  await expect(page).toHaveURL(/\/cadastro$/)
})

test('CarregamentoOfertas redireciona para Ofertas', async ({ page }) => {
  await page.goto('/carregamento-ofertas', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/ofertas$/, { timeout: 15_000 })
})
