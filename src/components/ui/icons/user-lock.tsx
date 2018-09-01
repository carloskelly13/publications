import React from "react";
import { Colors } from "../../../util/constants";

export default () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <g
      stroke={Colors.StartModal.ButtonIcon}
      strokeLinejoin="round"
      strokeMiterlimit="10"
      fill="none"
    >
      <path d="M20 20c0 .276-.224.5-.5.5s-.5-.224-.5-.5.224-.5.5-.5.5.224.5.5zM12.5 14.5v-2.875M7.5 11.688v2.812l-5.01 1.789c-1.193.426-1.99 1.558-1.99 2.825v2.386h12" />
      <ellipse cx="9.988" cy="6.5" rx="5" ry="6" />
      <path
        strokeLinecap="round"
        d="M15.5 17.5h8v6h-8zM19.5 21.5v-1M16.5 17.5v-1c0-1.657 1.343-3 3-3 1.656 0 3 1.343 3 3v1"
      />
    </g>
  </svg>
);
