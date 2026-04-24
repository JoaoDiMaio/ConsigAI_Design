import { test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const vp of viewports) {
  test(`ofertas responsividade ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://127.0.0.1:4173/ofertas', { waitUntil: 'networkidle' });

    const iframe = page.frameLocator('iframe[title="Ofertas ConsigAI"]');
    await iframe.locator('#oc0').waitFor({ state: 'visible', timeout: 15000 });

    await iframe.locator('#oc1').click();
    await iframe.locator('#oc2').click();
    await iframe.locator('#oc0').click();

    const metrics = await page.evaluate(() => {
      const frameEl = document.querySelector('iframe[title="Ofertas ConsigAI"]');
      const frameDoc = frameEl?.contentWindow?.document;
      if (!frameDoc) return { error: 'frameDoc_not_available' };

      const getRect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height, top: r.top, left: r.left, right: r.right, bottom: r.bottom };
      };

      const scroll = {
        parent: {
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          hasOverflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
        },
        frame: {
          innerWidth: frameEl.contentWindow.innerWidth,
          scrollWidth: frameDoc.documentElement.scrollWidth,
          hasOverflowX: frameDoc.documentElement.scrollWidth > frameEl.contentWindow.innerWidth + 1,
        },
      };

      const cards = Array.from(frameDoc.querySelectorAll('.offers-grid .offer-card')).map((card, idx) => ({
        idx,
        id: card.id,
        top: card.getBoundingClientRect().top,
        left: card.getBoundingClientRect().left,
        width: card.getBoundingClientRect().width,
      }));

      const firstCard = frameDoc.querySelector('#oc0');
      const titlePill = firstCard?.querySelector('.consigai-offer-title-row .consigai-offer-pill');
      const recBadge = firstCard?.querySelector('.consigai-offer-title-row .consigai-offer-badge-rec');
      const titleRow = firstCard?.querySelector('.consigai-offer-title-row');

      const firstCardAlignment = {
        titleRow: getRect(titleRow),
        titlePill: getRect(titlePill),
        recBadge: getRect(recBadge),
      };

      const sameLine = !!(firstCardAlignment.titlePill && firstCardAlignment.recBadge) &&
        Math.abs(firstCardAlignment.titlePill.top - firstCardAlignment.recBadge.top) < 8;

      return {
        scroll,
        cards,
        firstCardAlignment,
        sameLine,
        route: window.location.pathname,
      };
    });

    console.log(`RESP_CHECK ${vp.name} ${JSON.stringify(metrics)}`);
    await page.screenshot({ path: `tmp/ofertas-${vp.name}.png`, fullPage: true });
  });
}
