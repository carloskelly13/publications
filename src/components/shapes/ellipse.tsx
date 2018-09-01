import React from "react";
import { PubShape } from "../../types/pub-objects";

interface IProps {
  shape: PubShape;
  zoom: number;
  dpi: number;
}

const Ellipse: React.StatelessComponent<IProps> = ({
  shape: {
    x,
    y,
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
}) => (
  <ellipse
    cx={x * dpi * zoom + (width / 2.0) * dpi * zoom}
    cy={y * dpi * zoom + (height / 2.0) * dpi * zoom}
    rx={(width / 2.0) * dpi * zoom}
    ry={(height / 2.0) * dpi * zoom}
    fill={fill}
    stroke={stroke}
    fillOpacity={fillOpacity}
    strokeOpacity={strokeOpacity}
    strokeWidth={strokeWidth * zoom}
  />
);

export default Ellipse;
