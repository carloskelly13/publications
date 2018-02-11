// @flow
import type { PubShape } from "../../util/types";
import React from "react";

type Props = {
  shape: PubShape,
  zoom: number,
  dpi: number,
};
class Rectangle extends React.PureComponent<Props> {
  render() {
    const {
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
    } = this.props;
    const valueForLayout = value => value * dpi * zoom;
    return (
      <rect
        x={valueForLayout(x)}
        y={valueForLayout(y)}
        rx={r * zoom}
        ry={r * zoom}
        width={valueForLayout(width)}
        height={valueForLayout(height)}
        fill={fill}
        stroke={stroke}
        fillOpacity={fillOpacity}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth * zoom}
      />
    );
  }
}

export default Rectangle;
