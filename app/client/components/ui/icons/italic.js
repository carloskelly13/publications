// @flow
import React from "react"

type IconProps = {
  size?: number,
  color?: string
}
export default ({ size, color }: IconProps) => (
  <svg
    width={size || 16}
    height={size || 16}
    viewBox="0 0 16 16"
    fillRule="nonzero"
  >
    <path
      fill={color || "black"}
      d="M14.5 2V0H5.521L5.5 2h3l-4 12h-3v2h8.979l.021-2h-3l4-12z"
    />
  </svg>
)
