# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: critical-flows.smoke.spec.js >> Entrada navega para Cadastro pelo CTA secundário
- Location: tests\critical-flows.smoke.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Descobrir minha economia' })

```

# Test source

```ts
  1  | import { test, expect } from 'playwright/test'
  2  | 
  3  | test('Entrada navega para Cadastro pelo CTA secundário', async ({ page }) => {
  4  |   await page.goto('/entrada', { waitUntil: 'networkidle' })
> 5  |   await page.getByRole('button', { name: 'Descobrir minha economia' }).click()
     |                                                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  6  |   await expect(page).toHaveURL(/\/cadastro$/)
  7  | })
  8  | 
  9  | test('CarregamentoOfertas redireciona para Ofertas', async ({ page }) => {
  10 |   await page.goto('/carregamento-ofertas', { waitUntil: 'domcontentloaded' })
  11 |   await expect(page).toHaveURL(/\/ofertas$/, { timeout: 15_000 })
  12 | })
  13 | 
```