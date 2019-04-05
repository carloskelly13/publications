import * as React from "react";
import { Colors } from "../../util/constants";

interface Props {
  size: number;
}
export default function PublicationsIcon(props: Props) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 21 21">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <polygon
          fill="#fff"
          transform="translate(12.5, 8.5) rotate(-315) translate(-12.5, -8.5) "
          points="11.0857864 -2.10660172 13.9142136 -2.10660172 13.9142136 19.1066017 11.0857864 19.1066017"
        />
        <path
          d="M0.5,3.5 L0.5,6.5 L14.5,6.5 L14.5,20.5 L17.5,20.5 L17.5,3.5 L0.5,3.5 Z"
          stroke={Colors.TitleBar.Background}
          fill="#fff"
        />
        <path
          d="M19.5,15.5 L5.5,15.5 L5.5,1.5 L2.5,1.5 L2.5,18.5 L19.5,18.5 L19.5,15.5 Z"
          stroke={Colors.TitleBar.Background}
          fill="#fff"
        />
      </g>
    </svg>
  );
}

PublicationsIcon.defaultProps = {
  size: 21,
};
