// @flow
import React from "react"

type ArrowProps = {
  style?: Object,
  fill: string
}
export default ({ style = {}, fill }: ArrowProps) => (
  <svg
    width={9}
    height={6}
    viewBox="0 0 15 10"
    style={style}
  >
    <g
      stroke="none"
      strokeWidth={1}
      fill={fill}
      fillRule="evenodd"
    >
      <polygon
        points="7.49875 9.09090909 14.6875 1.54147727 13.07375 0.284090909 7.49875 6.25 1.92625 0.284090909 0.3125 1.54147727"
      />
    </g>
  </svg>
)
