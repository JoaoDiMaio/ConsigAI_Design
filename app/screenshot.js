import { mkdirSync } from 'fs';
import { chromium } from 'playwright';

(async () => {
  mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch();
  const routes = [
    { name: 'entrada', path: '/entrada' },
    { name: 'cadastro', path: '/cadastro' },
    { name: 'upload_extrato', path: '/upload-extrato' },
    { name: 'ofertas', path: '/ofertas' },
    { name: 'novo_contrato', path: '/novo-contrato' },
    { name: 'refinanciamento', path: '/refinanciamento' },
    { name: 'portabilidade', path: '/portabilidade' },
    { name: 'turbo_economia', path: '/novo-economia' },
    { name: 'contratacao', path: '/contratacao' },
    { name: 'dados_bancarios', path: '/dados-bancarios' },
    { name: 'andamento_propostas', path: '/acompanhamento' },
    { name: 'configuracoes', path: '/configuracoes' }
  ];

  for (const route of routes) {
    const url = `http://localhost:5175${route.path}`;
    
    // Desktop
    const contextDesktop = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageDesktop = await contextDesktop.newPage();
    await pageDesktop.goto(url, { waitUntil: 'networkidle' });
    await pageDesktop.screenshot({ path: `screenshots/${route.name}_desktop.png`, fullPage: true });
    await contextDesktop.close();

    // Mobile
    const contextMobile = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const pageMobile = await contextMobile.newPage();
    await pageMobile.goto(url, { waitUntil: 'networkidle' });
    await pageMobile.screenshot({ path: `screenshots/${route.name}_mobile.png`, fullPage: true });
    await contextMobile.close();
  }

  await browser.close();
})();
