import React from "react";
import { GridLine } from "./grid-line";

type RenderGridLinesFn = (
  options: {
    x: Array<number>;
    y: Array<number>;
    zoom: number;
    width: number;
    height: number;
    dpi: number;
  }
) => Array<React.ReactNode>;

export const renderGridLines: RenderGridLinesFn = options => {
  const { x, y, zoom, width, height, dpi } = options;
  return [
    x.map((mark, index) => (
      <GridLine
        key={`v-grid-${mark}`}
        major={index % 4 === 0 && index > 0}
        mX={mark - 0.5}
        mY={0}
        dX={mark - 0.5}
        dY={height * dpi * zoom}
        direction="V"
      />
    )),
    y.map((mark, index) => (
      <GridLine
        key={`h-grid-${mark}`}
        major={index % 4 === 0 && index > 0}
        mX={0}
        mY={mark - 0.5}
        dX={width * dpi * zoom}
        dY={mark - 0.5}
        direction="H"
      />
    )),
  ];
};
