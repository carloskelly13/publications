export const fontFamilies = [
  { label: 'Inter', value: 'Inter Variable', category: 'sans-serif' },
  { label: 'Open Sans', value: 'Open Sans Variable', category: 'sans-serif' },
  { label: 'Merriweather', value: 'Merriweather Variable', category: 'serif' },
  { label: 'Playfair Display', value: 'Playfair Display Variable', category: 'serif' },
  { label: 'Caveat', value: 'Caveat Variable', category: 'cursive' },
  { label: 'Source Code Pro', value: 'Source Code Pro Variable', category: 'monospace' },
] as const

export const defaultFontFamily = fontFamilies[0]

export const fontFamilyStack = ({ family }: { family: string }) => {
  const option = fontFamilies.find(({ value }) => value === family)
  return option ? `'${option.value}', ${option.category}` : undefined
}
