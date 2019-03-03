import React from "react";

interface IconProps {
  size?: number;
  color?: string;
}
export default ({ size, color }: IconProps) => (
  <svg
    width={size || 16}
    height={size || 16}
    viewBox="0 0 16 16"
    fillRule="nonzero"
  >
    <polygon
      fill={color || "black"}
      points="8 16 6.5 14.5 12 9 0 9 0 7 12 7 6.5 1.5 8 0 16 8"
    />
  </svg>
);
