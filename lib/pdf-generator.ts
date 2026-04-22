import puppeteer, { Browser } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (browser) return browser

  const isDev = process.env.NODE_ENV === 'development'

  // In development, use your local Chrome installation
  const executablePath = isDev
    ? process.platform === 'win32'
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : '/usr/bin/google-chrome'
    : await chromium.executablePath() // In production, use the lightweight Chromium

  browser = await puppeteer.launch({
    args: isDev ? [] : chromium.args,
    executablePath,
    headless: true,
  })

  return browser
}

export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await getBrowser()
  const page = await browser.newPage()

  await page.setViewport({ width: 794, height: 1123 })
  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  })

  await page.close()

  return Buffer.from(pdfBuffer)
}