import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/ofertas', { waitUntil: 'networkidle' });

  const frame = page.frame({ url: /Ofertas_ConsigAI\.html/ }) || page.frames().find(f => f.url().includes('Ofertas_ConsigAI'));
  if (!frame) {
    results.push({ viewport: vp.name, error: 'iframe_not_found' });
    await context.close();
    continue;
  }

  await frame.waitForSelector('#oc0', { state: 'visible', timeout: 20000 });

  await frame.click('#oc1');
  await frame.click('#oc2');
  await frame.click('#oc0');

  const metrics = await page.evaluate(() => {
    const frameEl = document.querySelector('iframe[title="Ofertas ConsigAI"]');
    const frameDoc = frameEl?.contentWindow?.document;
    if (!frameDoc) return { error: 'frameDoc_not_available' };

    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
    };

    const cards = Array.from(frameDoc.querySelectorAll('.offers-grid .offer-card')).map((card) => {
      const r = card.getBoundingClientRect();
      return { id: card.id, top: r.top, left: r.left, width: r.width, height: r.height };
    });

    const uniqueRows = [...new Set(cards.map(c => Math.round(c.top)))].length;

    const firstCard = frameDoc.querySelector('#oc0');
    const titleRow = firstCard?.querySelector('.consigai-offer-title-row');
    const titlePill = firstCard?.querySelector('.consigai-offer-title-row .consigai-offer-pill');
    const recBadge = firstCard?.querySelector('.consigai-offer-title-row .consigai-offer-badge-rec');

    const titleRect = rect(titlePill);
    const badgeRect = rect(recBadge);
    const sameLine = !!(titleRect && badgeRect) && Math.abs(titleRect.top - badgeRect.top) < 6;

    const recommendedAtRight = !!(titleRect && badgeRect) && badgeRect.left > titleRect.left;

    return {
      parentOverflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      frameOverflowX: frameDoc.documentElement.scrollWidth > frameEl.contentWindow.innerWidth + 1,
      parentInnerWidth: window.innerWidth,
      frameInnerWidth: frameEl.contentWindow.innerWidth,
      cards,
      uniqueRows,
      sameLine,
      recommendedAtRight,
      titleRow: rect(titleRow),
      titlePill: titleRect,
      recommendedBadge: badgeRect,
      route: window.location.pathname,
    };
  });

  await page.screenshot({ path: `tmp/ofertas-${vp.name}-new.png`, fullPage: true });
  results.push({ viewport: vp, metrics });
  await context.close();
}

await browser.close();
await fs.writeFile('tmp/ofertas-responsividade-result.json', JSON.stringify(results, null, 2), 'utf8');
console.log(JSON.stringify(results, null, 2));
