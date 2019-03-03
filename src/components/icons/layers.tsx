import * as React from "react";
import { Colors } from "../../util/constants";

interface Props {
  active: boolean;
  size: number;
}
export default function LayersIcon(props: Props) {
  const stroke = props.active
    ? Colors.Inspector.TabIconBorderActive
    : Colors.Inspector.TabIconBorderInactive;
  return (
    <svg width={21} height={21} viewBox="0 0 24 20">
      <g fill={stroke} fillRule="nonzero">
        <path
          d="M20.5,13 C20.224,13 20,13.224 20,13.5 L20,15 L4,15 L4,5 L4.5,5 C4.776,5 5,4.776 5,4.5 C5,4.224 4.776,4 4.5,4 L3.5,4 C3.224,4 3,4.224 3,4.5 L3,15.5 C3,15.776 3.224,16 3.5,16 L20.5,16 C20.776,16 21,15.776 21,15.5 L21,13.5 C21,13.224 20.776,13 20.5,13 Z"
          id="Path"
        />
        <path
          d="M23.5,0 L6.5,0 C6.224,0 6,0.224 6,0.5 L6,11.5 C6,11.776 6.224,12 6.5,12 L23.5,12 C23.776,12 24,11.776 24,11.5 L24,0.5 C24,0.224 23.776,0 23.5,0 Z M23,11 L7,11 L7,1 L23,1 L23,11 Z"
          id="Shape"
        />
        <path
          d="M17.5,17 C17.224,17 17,17.224 17,17.5 L17,19 L1,19 L1,9 L1.5,9 C1.776,9 2,8.776 2,8.5 C2,8.224 1.776,8 1.5,8 L0.5,8 C0.224,8 0,8.224 0,8.5 L0,19.5 C0,19.776 0.224,20 0.5,20 L17.5,20 C17.776,20 18,19.776 18,19.5 L18,17.5 C18,17.224 17.776,17 17.5,17 Z"
          id="Path"
        />
      </g>
    </svg>
  );
}

LayersIcon.defaultProps = {
  size: 21,
};
