import * as React from "react";

interface Props {
  size: number;
  color: string;
}
export default function ZoomOutIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
    >
      <g
        stroke={props.color}
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
      >
        <circle cx="8.5" cy="8.5" r="8" />
        <path strokeLinecap="round" d="M14.156 14.156l9.344 9.344M5 8.5h7" />
      </g>
    </svg>
  );
}

ZoomOutIcon.defaultProps = {
  size: 18,
  color: "#fff",
};
