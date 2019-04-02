import * as React from "react";

interface Props {
  size: number;
  color: string;
}
export default function DownloadIcon(props: Props) {
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
        <path d="M10.5 21.5h-10v-21h11l5 5.002v3.998" />
        <path strokeLinecap="round" d="M11.5.5v5h5" />
        <circle cx="17.5" cy="17.5" r="6" />
        <path
          strokeLinecap="round"
          d="M17.5 20.226v-5.455M15.318 18.046l2.182 2.182 2.182-2.182"
        />
      </g>
    </svg>
  );
}

DownloadIcon.defaultProps = {
  size: 18,
  color: "#fff",
};
