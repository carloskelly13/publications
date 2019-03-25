import * as React from "react";

interface Props {
  size: number;
  color: string;
}
export default function VectorShapeIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
    >
      <g
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
      >
        <path d="M21.5 6v12M6.5 2.5h11M2.5 18v-12M17.5 21.5h-11" />
        <circle cx="21.5" cy="2.5" r="2" />
        <circle cx="2.5" cy="2.5" r="2" />
        <circle cx="21.5" cy="21.5" r="2" />
        <circle cx="2.5" cy="21.5" r="2" />
      </g>
    </svg>
  );
}

VectorShapeIcon.defaultProps = {
  size: 24,
  color: "#fff",
};
