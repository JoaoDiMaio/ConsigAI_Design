import { chromium } from 'playwright';

for (const vp of [{name:'desktop',w:1366,h:768},{name:'mobile',w:390,h:844}]) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto('http://127.0.0.1:4173/ofertas', { waitUntil: 'networkidle' });
  const frame = page.frame({ url: /Ofertas_ConsigAI\.html/ }) || page.frames().find(f => f.url().includes('Ofertas_ConsigAI'));
  await frame.waitForSelector('#oc0', { state: 'visible' });
  await frame.click('#oc2');
  await frame.click('#oc0');
  const state = await page.evaluate(() => {
    const doc = document.querySelector('iframe[title="Ofertas ConsigAI"]')?.contentWindow?.document;
    const c0 = doc.querySelector('#oc0')?.classList.contains('selected');
    const c2 = doc.querySelector('#oc2')?.classList.contains('selected');
    const cta = doc.querySelector('#ctaName')?.textContent?.trim();
    const cardRect = doc.querySelector('#oc0')?.getBoundingClientRect();
    const topbarH = doc.querySelector('.topbar')?.getBoundingClientRect()?.height || 0;
    const stickyH = doc.querySelector('.sticky-cta')?.getBoundingClientRect()?.height || 0;
    const winH = doc.defaultView.innerHeight;
    return {
      c0, c2, cta,
      cardTop: cardRect?.top,
      cardBottom: cardRect?.bottom,
      safeTop: topbarH + 8,
      safeBottom: winH - stickyH - 8,
    };
  });
  await frame.click('.btn-cta');
  await page.waitForTimeout(400);
  console.log(vp.name, JSON.stringify(state), 'route', page.url());
  await browser.close();
}
