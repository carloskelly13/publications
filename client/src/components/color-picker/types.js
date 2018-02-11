// @flow

export type ColorPickerProps = {
  onChange: Function,
  property: string,
  hex: string,
  alpha?: number,
};

export type ColorPickerState = {
  isOpen: boolean,
};

export type ColorChangeObj = { hex: string, rgb: { a: number } };
