import React from "react";
import { GridLine } from "./grid-line";

const renderGridLines = ({ x, y, zoom, width, height, dpi }) => {
  return [
    x.map((mark, index) => (
      <GridLine
        key={`v-grid-${mark}`}
        major={index % 4 === 0 && index > 0}
        mX={mark - 0.5}
        mY="0"
        dX={mark - 0.5}
        dY={height * dpi * zoom}
        direction="V"
      />
    )),
    y.map((mark, index) => (
      <GridLine
        key={`h-grid-${mark}`}
        major={index % 4 === 0 && index > 0}
        mX="0"
        mY={mark - 0.5}
        dX={width * dpi * zoom}
        dY={mark - 0.5}
        direction="H"
      />
    )),
  ];
};

export class CanvasBackground extends React.PureComponent {
  render() {
    const {
      width,
      height,
      dpi,
      zoom,
      handleBackgroundClicked,
      selectable,
      gridLineRanges,
    } = this.props;
    return (
      <g onClick={selectable ? handleBackgroundClicked : null}>
        <rect
          y="0"
          x="0"
          fill="#fff"
          stroke="0"
          strokeWidth="0"
          width={width * dpi * zoom}
          height={height * dpi * zoom}
        />
        {selectable &&
          renderGridLines({ width, height, dpi, zoom, ...gridLineRanges })}
      </g>
    );
  }
}
