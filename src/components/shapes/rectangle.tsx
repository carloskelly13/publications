import React from "react";
import { PubShape } from "../../types/pub-objects";

interface IProps {
  shape: PubShape;
  zoom: number;
  dpi: number;
}

const Rectangle: React.StatelessComponent<IProps> = ({
  shape: {
    x,
    y,
    r,
    width,
    height,
    fill,
    stroke,
    strokeOpacity,
    fillOpacity,
    strokeWidth,
  },
  zoom,
  dpi,
}) => {
  return (
    <rect
      x={x * dpi * zoom}
      y={y * dpi * zoom}
      rx={r * zoom}
      ry={r * zoom}
      width={width * dpi * zoom}
      height={height * dpi * zoom}
      fill={fill}
      stroke={stroke}
      fillOpacity={fillOpacity}
      strokeOpacity={strokeOpacity}
      strokeWidth={strokeWidth * zoom}
    />
  );
};

export default Rectangle;
