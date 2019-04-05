import * as React from "react";

interface Props {
  size: number;
  color: string;
}
export default function CopyIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
    >
      <path
        d="M20.5 20.5h-14v-20h8l6 6zM14.5.5v6h6M17.5 20.5v3h-14v-20h3"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
      />
    </svg>
  );
}

CopyIcon.defaultProps = {
  size: 18,
  color: "#fff",
};
