import React, { PropTypes } from "react"
import styled from "styled-components"
import selectable from "./selectable"

const Rectangle = props => {
  const {
    shape: {
      x, y, r, width, height, fill, stroke,
      strokeOpacity, fillOpacity, strokeWidth
    },
    zoom, dpi
  } = props
  const valueForLayout = value => value * dpi * zoom
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
  )
}

export default selectable(Rectangle)
