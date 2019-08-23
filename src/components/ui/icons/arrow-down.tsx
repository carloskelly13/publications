import React from "react";

interface IconProps {
  size?: number;
  color?: string;
}
const ArrowDownIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    width={size || 10}
    height={size || 6}
    viewBox="0 0 9 5"
    fillRule="nonzero"
  >
    <polyline
      id="Line"
      fill={color}
      strokeLinecap="square"
      points="1 1 4.5 4 8 1"
    />
  </svg>
);

ArrowDownIcon.defaultProps = {
  color: "#fff",
};

export default ArrowDownIcon;
