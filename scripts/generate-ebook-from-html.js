/**
 * Script para gerar PDF premium do ebook a partir de HTML
 * Usa Puppeteer para renderização de alta qualidade
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function generatePDF() {
  console.log('📚 Gerando PDF Premium do Ebook...\n');

  const htmlPath = path.join(__dirname, '../public/downloads/introducao-lusitano.html');
  const outputPath = path.join(__dirname, '../public/downloads/introducao-lusitano.pdf');

  // Check if HTML exists
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ Ficheiro HTML não encontrado:', htmlPath);
    process.exit(1);
  }

  console.log('📄 A processar HTML...');

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport to A4 dimensions (at 96 DPI)
    await page.setViewport({
      width: 794,  // 210mm at 96 DPI
      height: 1123, // 297mm at 96 DPI
      deviceScaleFactor: 2
    });

    // Load HTML file
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Emulate print media
    await page.emulateMediaType('print');

    // Extra wait for rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🖨️  A gerar PDF...');

    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      },
      displayHeaderFooter: false,
      scale: 1
    });

    await browser.close();

    // Check file size
    const stats = fs.statSync(outputPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('\n✅ PDF Premium gerado com sucesso!');
    console.log('📍 Localização:', outputPath);
    console.log('📊 Tamanho:', fileSizeInMB, 'MB');
    console.log('\n🎉 O ebook pode ser descarregado em:');
    console.log('   http://localhost:3000/downloads/introducao-lusitano.pdf');

  } catch (error) {
    console.error('\n❌ Erro ao gerar PDF:', error.message);
    console.error('\nDica: Certifica-te que tens puppeteer instalado:');
    console.error('npm install --save-dev puppeteer');
    process.exit(1);
  }
}

generatePDF();
