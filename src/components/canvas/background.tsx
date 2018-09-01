import React, { MouseEvent } from "react";
import { renderGridLines } from "./render-grid-lines";

interface Props {
  width: number;
  height: number;
  dpi: number;
  zoom: number;
  selectable: boolean;
  gridLineRanges?: { x: Array<number>; y: Array<number> };
  handleBackgroundClicked(event: MouseEvent<SVGGElement>): void;
}

export class CanvasBackground extends React.PureComponent<Props> {
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
      <g onClick={selectable ? handleBackgroundClicked : undefined}>
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
          gridLineRanges &&
          renderGridLines({ width, height, dpi, zoom, ...gridLineRanges })}
      </g>
    );
  }
}
