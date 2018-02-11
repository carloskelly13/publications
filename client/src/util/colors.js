import hexRgb from "hex-rgb";

export const convertToRGBA = (hex, alpha) => {
  const rgb = hexRgb(hex);
  return { r: rgb.red, g: rgb.green, b: rgb.blue, a: alpha };
};
