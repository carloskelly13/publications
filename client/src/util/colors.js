import tinycolor from "tinycolor2";

export const convertToRGBA = (hex, alpha) => ({
  ...tinycolor(hex).toRgb(),
  a: alpha,
});
