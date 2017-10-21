import React from "react"

class Ellipse extends React.PureComponent {
  render() {
    const {
      shape: {
        x, y, width, height, fill, stroke,
        strokeOpacity, fillOpacity, strokeWidth
      },
      zoom, dpi
    } = this.props
    return (
      <ellipse
        cx={(x * dpi * zoom) + (width / 2.0 * dpi * zoom)}
        cy={(y * dpi * zoom) + (height / 2.0 * dpi * zoom)}
        rx={width / 2.0 * dpi * zoom}
        ry={height / 2.0 * dpi * zoom}
        fill={fill}
        stroke={stroke}
        fillOpacity={fillOpacity}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth * zoom}
      />
    )
  }
}

export default Ellipse
