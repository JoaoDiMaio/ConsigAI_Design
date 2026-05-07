import { test, expect } from 'playwright/test'

test('Ofertas navega para Contratacao pelo CTA principal', async ({ page }) => {
  await page.goto('/ofertas', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /Continuar/ }).click()
  await expect(page).toHaveURL(/\/contratacao$/)
})
