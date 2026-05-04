export function printSimulationReceipt({
  title,
  highlightLabel,
  highlightValue,
  rows,
  total,
}) {
  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  const rowsHtml = (rows || [])
    .map(
      ({ label, value }) =>
        `<div class="row"><span>${String(label || '')}</span><strong>${String(value || '')}</strong></div>`,
    )
    .join('')

  const totalHtml = total
    ? `<div class="sep"></div><div class="total"><span>${String(total.label || '')}</span><strong>${String(total.value || '')}</strong></div>`
    : ''

  const receiptHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Recibo de Simulação</title>
      <style>
        @page { size: auto; margin: 0; }
        * { box-sizing: border-box; }
        html, body { width: 100%; height: 100%; }
        body { margin: 0; font-family: Arial, sans-serif; color: #4f4f4f; background: #fff; }
        .wrap { width: 100%; min-height: 100%; display: flex; justify-content: center; align-items: flex-start; padding: 24px 24px 48px; }
        .ticket { width: min(760px, 100%); border-radius: 14px; padding: 34px 30px 30px; border: 1px solid #ececec; font-size: 28px; background: linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3; }
        .title { text-align: center; font-size: 28px; font-weight: 800; color: #444; }
        .date { font-size: 20px; margin-top: 8px; text-align: center; color: #808080; }
        .sep { border-top: 2px dashed #cfcfcf; margin: 20px 0; }
        .label { text-align: center; font-size: 22px; font-weight: 800; }
        .value { text-align: center; margin-top: 6px; font-size: 56px; font-weight: 900; color: #232323; }
        .grid { display: grid; gap: 12px; font-size: 22px; }
        .row { display: flex; justify-content: space-between; gap: 16px; }
        .total { display: flex; justify-content: space-between; gap: 16px; }
        .total span { font-size: 22px; font-weight: 700; }
        .total strong { font-size: 30px; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="ticket">
          <div class="title">${String(title || '')}</div>
          <div class="date">${today}</div>
          <div class="sep"></div>
          <div class="label">${String(highlightLabel || '')}</div>
          <div class="value">${String(highlightValue || '')}</div>
          <div class="sep"></div>
          <div class="grid">${rowsHtml}</div>
          ${totalHtml}
        </div>
      </div>
      <script>
        window.onload = () => {
          window.print();
          window.onafterprint = () => window.close();
        };
      </script>
    </body>
    </html>
  `

  const printWindow = window.open('', '_blank', 'width=900,height=700')
  if (!printWindow) return
  printWindow.document.open()
  printWindow.document.write(receiptHtml)
  printWindow.document.close()
}

