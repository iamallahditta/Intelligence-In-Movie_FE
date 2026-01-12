export default function createMedicalTemplate(data) {
  const { header, sidebar, mainContent } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        header, footer { padding: 10px 30px; background: #f9f9f9; }
        .header, .footer { display: flex; justify-content: space-between; align-items: center; }
        .sidebar { width: 25%; float: left; padding: 15px; background: #f1f1f1; box-sizing: border-box; }
        .main { padding: 15px; box-sizing: border-box; }
        .with-sidebar .main { margin-left: 25%; }
        .section { margin-bottom: 20px; }
        h1, h2, h4 { margin: 0 0 10px; }
        p { margin: 0 0 5px; line-height: 1.5; }
        img { max-height: 50px; }
      </style>
    </head>
    <body class="${sidebar?.show ? 'with-sidebar' : ''}">

      <header class="header">
        ${header.logoPosition === 'left' || header.logoPosition === 'both'
          ? `<img src="${header.leftLogo || ''}" alt="Left Logo" />` : ''}
        <h1>${header.title || 'Medical Report'}</h1>
        ${header.logoPosition === 'right' || header.logoPosition === 'both'
          ? `<img src="${header.rightLogo || ''}" alt="Right Logo" />` : ''}
      </header>

      ${sidebar?.show ? `
        <aside class="sidebar">
          ${(sidebar.blocks || []).map(block => `
            <div class="section">
              <h4>${block.title}</h4>
              <p>${block.content}</p>
            </div>
          `).join('')}
        </aside>
      ` : ''}

      <main class="main">
        ${(mainContent?.sections || []).map(section => `
          <div class="section">
            <h2>${section.heading}</h2>
            <p>${section.content}</p>
          </div>
        `).join('')}
      </main>

    </body>
    </html>
  `;
}
