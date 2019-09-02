import * as React from "react";

interface Props {
  size: number;
  color: string;
}
export default function GarbageIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
    >
      <g fill={props.color}>
        <path
          d="M23.016,3h-3.5h-3.5V0.5c0-0.276-0.224-0.5-0.5-0.5h-8c-0.276,0-0.5,0.224-0.5,0.5V3h-3.5h-2.5c-0.276,0-0.5,0.224-0.5,0.5
		S0.739,4,1.016,4h2v19.5c0,0.276,0.224,0.5,0.5,0.5h16c0.276,0,0.5-0.224,0.5-0.5V4h3c0.276,0,0.5-0.224,0.5-0.5S23.292,3,23.016,3
		z M8.016,1h7v2h-7V1z M19.016,23h-15V4h3.5h8h3.5V23z"
        />
        <path
          d="M7.516,6.5c-0.276,0-0.5,0.224-0.5,0.5v12c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5V7C8.016,6.724,7.792,6.5,7.516,6.5
		z"
        />
        <path
          d="M11.516,6.5c-0.276,0-0.5,0.224-0.5,0.5v12c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5V7
		C12.016,6.724,11.792,6.5,11.516,6.5z"
        />
        <path d="M15.016,7v12c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5V7c0-0.276-0.224-0.5-0.5-0.5S15.016,6.724,15.016,7z" />
      </g>
    </svg>
  );
}
GarbageIcon.defaultProps = {
  size: 18,
  color: "#fff",
};
