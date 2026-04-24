import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://127.0.0.1:4173/ofertas', { waitUntil: 'networkidle' });
const frame = page.frame({ url: /Ofertas_ConsigAI\.html/ }) || page.frames().find(f => f.url().includes('Ofertas_ConsigAI'));
await frame.waitForSelector('#oc0', { state: 'visible' });
await frame.click('#oc2');
await frame.click('#oc0');
await page.waitForTimeout(900);
const state = await page.evaluate(() => {
  const doc = document.querySelector('iframe[title="Ofertas ConsigAI"]')?.contentWindow?.document;
  const cardRect = doc.querySelector('#oc0')?.getBoundingClientRect();
  const topbarH = doc.querySelector('.topbar')?.getBoundingClientRect()?.height || 0;
  const stickyH = doc.querySelector('.sticky-cta')?.getBoundingClientRect()?.height || 0;
  const winH = doc.defaultView.innerHeight;
  return { cardTop: cardRect?.top, cardBottom: cardRect?.bottom, safeTop: topbarH + 8, safeBottom: winH - stickyH - 8, scrollY: doc.defaultView.scrollY };
});
console.log(JSON.stringify(state));
await browser.close();
