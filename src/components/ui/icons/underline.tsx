import React from "react";

interface IconProps {
  color?: string;
}
export default ({ color }: IconProps) => (
  <svg
    width={15}
    height={16}
    viewBox="0 1.5 20 20"
    fillRule="nonzero"
    style={{ position: "absolute" }}
  >
    <path
      fill={color || "black"}
      d="M5 20h14v2H5zM16 2v10c0 2.134-1.866 4-4 4s-4-1.866-4-4V2H5.045v10.045a6.955 6.955 0 0 0 13.91 0L19 2h-3z"
    />
  </svg>
);
