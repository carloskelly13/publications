import * as React from "react";

interface Props {
  size: number;
  color: string;
}
export default function UserIcon(props: Props) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24">
      <g
        stroke={props.color}
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
      >
        <path d="M7.5,16.5 L7.5,18 L4.5,18.948 M10.5,16.5 L10.5,18 L13.5,18.948" />
        <ellipse id="Oval" cx="9" cy="13.771" rx="3" ry="3.271" />
        <path
          d="M11.5,4.5 L17.5,4.5 L17.5,23.5 L0.5,23.5 L0.5,4.5 L6.5,4.5 M11.5,6.5 L15.5,6.5 L15.5,21.5 L2.5,21.5 L2.5,6.5 L6.5,6.5"
          id="Shape"
        />
        <path
          d="M11.5,8 L6.5,8 L6.5,3 C6.5,1.625 7.625,0.5 9,0.5 C10.375,0.5 11.5,1.625 11.5,3 L11.5,8 Z M9.5,2.995 C9.5,3.271 9.276,3.495 9,3.495 C8.724,3.495 8.5,3.271 8.5,2.995 C8.5,2.719 8.724,2.495 9,2.495 C9.276,2.495 9.5,2.719 9.5,2.995 Z"
          id="Shape"
        />
      </g>
    </svg>
  );
}

UserIcon.defaultProps = {
  size: 18,
  color: "#fff",
};
