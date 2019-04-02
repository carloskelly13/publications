import * as React from "react";

interface Props {
  size: number;
  color: string;
}
export default function PasteIcon(props: Props) {
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
        <path d="M12.513 13.5h9l2 2v8h-11zM9.513 23.5h-9v-20h4M12.513 3.5h4v7" />
        <path d="M10.513 2.5c0-1.104-.895-2-2-2-1.104 0-2 .896-2 2h-2v4h8v-4h-2zM14.513 10.5v-5h-2M4.513 5.5h-2v15h7M14.513 21.5h7M14.513 19.5h7M14.513 17.5h7M14.513 15.5h5" />
      </g>
    </svg>
  );
}

PasteIcon.defaultProps = {
  size: 18,
  color: "#fff",
};
