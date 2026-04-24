import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await page.goto('http://127.0.0.1:4173/ofertas', { waitUntil: 'networkidle' });
const frame = page.frame({ url: /Ofertas_ConsigAI\.html/ }) || page.frames().find(f => f.url().includes('Ofertas_ConsigAI'));
await frame.waitForSelector('#oc0', { state: 'visible' });

const state = async (label) => {
  const s = await page.evaluate(() => {
    const doc = document.querySelector('iframe[title="Ofertas ConsigAI"]')?.contentWindow?.document;
    const pick = (id) => ({ id, selected: doc.querySelector('#'+id)?.classList.contains('selected') });
    return [pick('oc0'), pick('oc1'), pick('oc2')];
  });
  console.log(label, JSON.stringify(s));
};

await state('initial');
await frame.click('#oc2');
await state('after_oc2');
await frame.click('#oc0');
await state('after_oc0');
await frame.click('.btn-cta');
await page.waitForTimeout(500);
console.log('route_after_3_to_1', page.url());

await page.goto('http://127.0.0.1:4173/ofertas', { waitUntil: 'networkidle' });
const frame2 = page.frame({ url: /Ofertas_ConsigAI\.html/ }) || page.frames().find(f => f.url().includes('Ofertas_ConsigAI'));
await frame2.waitForSelector('#oc0', { state: 'visible' });
await frame2.click('#oc0');
await frame2.click('.btn-cta');
await page.waitForTimeout(500);
console.log('route_after_direct_1', page.url());

await browser.close();
