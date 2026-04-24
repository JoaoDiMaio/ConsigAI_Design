import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await page.goto('http://127.0.0.1:4173/ofertas', { waitUntil: 'networkidle' });
const frame = page.frame({ url: /Ofertas_ConsigAI\.html/ }) || page.frames().find(f => f.url().includes('Ofertas_ConsigAI'));
await frame.waitForSelector('#oc0', { state: 'visible' });
await frame.click('#oc2');
await frame.click('#oc0');
await frame.locator('#oc0').screenshot({ path: 'tmp/repro-card0-after-3-1.png' });
const details = await frame.evaluate(() => {
  const c = document.querySelector('#oc0');
  const row = c?.querySelector('.consigai-offer-title-row');
  const pill = c?.querySelector('.consigai-offer-pill');
  const rec = c?.querySelector('.consigai-offer-badge-rec');
  const b0 = c?.querySelector('#badge0');
  const r = (el) => el ? el.getBoundingClientRect() : null;
  return {
    badge0Class: b0?.className || null,
    badge0Text: b0?.textContent?.trim() || null,
    row: r(row),
    pill: r(pill),
    rec: r(rec),
  };
});
console.log(JSON.stringify(details, null, 2));
await browser.close();
