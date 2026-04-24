import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await page.goto('http://127.0.0.1:4173/ofertas', { waitUntil: 'networkidle' });
const frame = page.frame({ url: /Ofertas_ConsigAI\.html/ }) || page.frames().find(f => f.url().includes('Ofertas_ConsigAI'));
await frame.waitForSelector('#oc2', { state: 'visible' });
await frame.click('#oc2');
await frame.click('.btn-cta');
await page.waitForTimeout(400);
console.log('CTA_ROUTE', page.url());
await browser.close();
