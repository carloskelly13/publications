import chromium from '@sparticuz/chromium'
import puppeteer, { type Browser } from 'puppeteer-core'
import { existsSync } from 'node:fs'
import { HttpError } from './errors.js'
import type { PdfInput } from './schemas.js'

let browserPromise: Promise<Browser> | undefined

const localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const browserConfiguration = async () => {
  const executablePath =
    process.env.CHROME_EXECUTABLE_PATH ??
    (existsSync(localChrome) ? localChrome : await chromium.executablePath())
  const serverlessChromium = executablePath !== localChrome && !process.env.CHROME_EXECUTABLE_PATH
  return {
    args: serverlessChromium ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 },
    executablePath,
    headless: true as const,
  }
}

const launchBrowser = async (): Promise<Browser> => puppeteer.launch(await browserConfiguration())

const getBrowser = (): Promise<Browser> => {
  browserPromise ??= launchBrowser().catch((error) => {
    browserPromise = undefined
    throw error
  })
  return browserPromise
}

const validateSvg = ({ svg }: { svg: string }): void => {
  const normalized = svg.trimStart().toLowerCase()
  if (!normalized.startsWith('<svg') || normalized.includes('<script')) {
    throw new HttpError({
      statusCode: 400,
      message: 'The PDF payload must be a script-free SVG document.',
    })
  }
}

const html = ({ svg }: { svg: string }): string => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:">
  <style>
    @page { margin: 0; }
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
    svg { display: block; width: 100%; height: 100%; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body>${svg}</body>
</html>`

export const renderPdf = async ({ input }: { input: PdfInput }): Promise<Buffer> => {
  validateSvg({ svg: input.svg })
  const browser = await getBrowser()
  const page = await browser.newPage()
  try {
    await page.setJavaScriptEnabled(false)
    await page.setRequestInterception(true)
    page.on('request', (request) => void request.abort())
    await page.setContent(html({ svg: input.svg }))
    await page.emulateMediaType('screen')
    const bytes = await page.pdf({
      width: `${input.width}in`,
      height: `${input.height}in`,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })
    return Buffer.from(bytes)
  } finally {
    await page.close()
  }
}
