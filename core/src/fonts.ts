import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const interNormal =
  require.resolve('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')
const interItalic =
  require.resolve('@fontsource-variable/inter/files/inter-latin-wght-italic.woff2')
const openSansNormal =
  require.resolve('@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2')
const openSansItalic =
  require.resolve('@fontsource-variable/open-sans/files/open-sans-latin-wght-italic.woff2')
const merriweatherNormal =
  require.resolve('@fontsource-variable/merriweather/files/merriweather-latin-wght-normal.woff2')
const merriweatherItalic =
  require.resolve('@fontsource-variable/merriweather/files/merriweather-latin-wght-italic.woff2')
const playfairNormal =
  require.resolve('@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2')
const playfairItalic =
  require.resolve('@fontsource-variable/playfair-display/files/playfair-display-latin-wght-italic.woff2')
const caveatNormal =
  require.resolve('@fontsource-variable/caveat/files/caveat-latin-wght-normal.woff2')
const sourceCodeNormal =
  require.resolve('@fontsource-variable/source-code-pro/files/source-code-pro-latin-wght-normal.woff2')
const sourceCodeItalic =
  require.resolve('@fontsource-variable/source-code-pro/files/source-code-pro-latin-wght-italic.woff2')

type FontFace = {
  family: string
  path: string
  style: 'normal' | 'italic'
  weight: string
}

const fontFaceCss = ({ family, path, style, weight }: FontFace) => `
@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  src: url(data:font/woff2;base64,${readFileSync(path).toString('base64')}) format('woff2');
}`

const fontFaces: FontFace[] = [
  { family: 'Inter Variable', path: interNormal, style: 'normal', weight: '100 900' },
  { family: 'Inter Variable', path: interItalic, style: 'italic', weight: '100 900' },
  { family: 'Open Sans Variable', path: openSansNormal, style: 'normal', weight: '300 800' },
  { family: 'Open Sans Variable', path: openSansItalic, style: 'italic', weight: '300 800' },
  {
    family: 'Merriweather Variable',
    path: merriweatherNormal,
    style: 'normal',
    weight: '300 900',
  },
  {
    family: 'Merriweather Variable',
    path: merriweatherItalic,
    style: 'italic',
    weight: '300 900',
  },
  {
    family: 'Playfair Display Variable',
    path: playfairNormal,
    style: 'normal',
    weight: '400 900',
  },
  {
    family: 'Playfair Display Variable',
    path: playfairItalic,
    style: 'italic',
    weight: '400 900',
  },
  { family: 'Caveat Variable', path: caveatNormal, style: 'normal', weight: '400 700' },
  {
    family: 'Source Code Pro Variable',
    path: sourceCodeNormal,
    style: 'normal',
    weight: '200 900',
  },
  {
    family: 'Source Code Pro Variable',
    path: sourceCodeItalic,
    style: 'italic',
    weight: '200 900',
  },
]

export const embeddedFontsCss = fontFaces.map(fontFaceCss).join('\n')
