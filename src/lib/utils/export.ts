export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: keyof T; label: string; format?: (v: unknown) => string }[],
  filename: string,
) {
  const header = columns.map((c) => `"${c.label}"`).join(';')
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = c.format ? c.format(row[c.key]) : String(row[c.key] ?? '')
        return `"${val.replace(/"/g, '""')}"`
      })
      .join(';'),
  )
  const bom     = '\uFEFF'
  const content = bom + [header, ...rows].join('\n')
  const blob    = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `${filename}.csv`)
}

export function exportToPDF(title: string, htmlContent: string) {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 12px;
               color: #1e293b; padding: 24px; }
        h1   { font-size: 18px; margin-bottom: 4px; }
        p.sub{ font-size: 11px; color: #64748b; margin-bottom: 20px; }
        table{ width: 100%; border-collapse: collapse; }
        th   { background: #f1f5f9; text-align: left;
               padding: 8px 10px; font-size: 10px;
               text-transform: uppercase; letter-spacing: .05em;
               border-bottom: 2px solid #e2e8f0; }
        td   { padding: 7px 10px; border-bottom: 1px solid #f1f5f9; }
        tfoot td { font-weight: bold; background: #f8fafc;
                   border-top: 2px solid #e2e8f0; }
        @media print { body { padding: 0; } button { display: none; } }
      </style>
    </head>
    <body>
      ${htmlContent}
      <script>setTimeout(() => { window.print(); window.close(); }, 400);<\/script>
    </body>
    </html>
  `)
  win.document.close()
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a   = Object.assign(document.createElement('a'), {
    href: url, download: filename,
  })
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
