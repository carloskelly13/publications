import hexRgb from "hex-rgb"

export const convertToRGBA = (hex, alpha) => {
  const [ r, g, b ] = hexRgb(hex)
  return { r, g, b, a: alpha }
}
