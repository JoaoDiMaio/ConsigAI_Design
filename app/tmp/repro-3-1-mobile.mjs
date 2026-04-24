import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://127.0.0.1:4173/ofertas', { waitUntil: 'networkidle' });
const frame = page.frame({ url: /Ofertas_ConsigAI\.html/ }) || page.frames().find(f => f.url().includes('Ofertas_ConsigAI'));
await frame.waitForSelector('#oc0', { state: 'visible' });

await frame.click('#oc2');
await frame.click('#oc0');
const status = await page.evaluate(() => {
  const doc = document.querySelector('iframe[title="Ofertas ConsigAI"]')?.contentWindow?.document;
  return {
    oc0: doc.querySelector('#oc0')?.classList.contains('selected'),
    oc2: doc.querySelector('#oc2')?.classList.contains('selected'),
    ctaName: doc.querySelector('#ctaName')?.textContent?.trim(),
  };
});
console.log('mobile_state_after_3_to_1', JSON.stringify(status));
await frame.click('.btn-cta');
await page.waitForTimeout(500);
console.log('mobile_route_after_3_to_1', page.url());

await browser.close();
