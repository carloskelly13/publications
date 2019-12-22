import tinycolor from "tinycolor2";

export default (element: HTMLElement, { Style }) => {
  if (element.style.color) {
    const color = tinycolor(element.style.color).toHexString();
    // eslint-disable-next-line new-cap
    return Style(`PUB_COLOR_${color}`);
  }
  if (element.style.fontSize) {
    const { fontSize } = element.style;
    // eslint-disable-next-line new-cap
    return Style(`PUB_FONT_SIZE_${fontSize}`);
  }
  if (element.style.fontFamily) {
    const { fontFamily } = element.style;
    // eslint-disable-next-line new-cap
    return Style(`PUB_FONT_FAMILY_${fontFamily}`);
  }
  return null;
};
