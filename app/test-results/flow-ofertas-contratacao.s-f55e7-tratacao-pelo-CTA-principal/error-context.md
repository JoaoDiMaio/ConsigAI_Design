# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow-ofertas-contratacao.smoke.spec.js >> Ofertas navega para Contratacao pelo CTA principal
- Location: tests\flow-ofertas-contratacao.smoke.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Continuar/ })

```

# Test source

```ts
  1 | import { test, expect } from 'playwright/test'
  2 | 
  3 | test('Ofertas navega para Contratacao pelo CTA principal', async ({ page }) => {
  4 |   await page.goto('/ofertas', { waitUntil: 'networkidle' })
> 5 |   await page.getByRole('button', { name: /Continuar/ }).click()
    |                                                         ^ Error: locator.click: Test timeout of 30000ms exceeded.
  6 |   await expect(page).toHaveURL(/\/contratacao$/)
  7 | })
  8 | 
```