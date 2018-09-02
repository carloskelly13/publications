import tinycolor, { ColorFormats } from "tinycolor2";

type ConvertToRGBA = (hex: string, alpha?: number) => ColorFormats.RGBA;

export const convertToRGBA: ConvertToRGBA = (hex, alpha) => ({
  ...tinycolor(hex).toRgb(),
  a: alpha || 1,
});
