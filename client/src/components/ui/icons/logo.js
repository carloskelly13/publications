import React from "react";
import { AppColors } from "../../../util/constants";

export default () => (
  <svg width="23" height="23" viewBox="0 0 23 23">
    <defs>
      <polygon id="path-1" points="0 3 0 7 14 7 14 21 18 21 18 3" />
      <polygon id="path-2" points="20 15 6 15 6 1 2 1 2 19 20 19" />
    </defs>
    <g id="pub-logo-23x23-alt" fill="none" fillRule="evenodd">
      <g id="pub-logo-71-copy" transform="translate(1 1)">
        <polygon
          fill={AppColors.Highlight}
          transform="rotate(45 12.5 8.5)"
          points="11.0857864 -2.10660172 13.9142136 -2.10660172 13.9142136 19.1066017 11.0857864 19.1066017"
        />
        <g>
          <use fill="#263238" xlinkHref="#path-1" />
          <path
            stroke={AppColors.Highlight}
            d="M0.5,3.5 L0.5,6.5 L14.5,6.5 L14.5,20.5 L17.5,20.5 L17.5,3.5 L0.5,3.5 Z"
          />
        </g>
        <g>
          <use fill="#263238" xlinkHref="#path-2" />
          <path
            stroke={AppColors.Highlight}
            d="M19.5,15.5 L5.5,15.5 L5.5,1.5 L2.5,1.5 L2.5,18.5 L19.5,18.5 L19.5,15.5 Z"
          />
        </g>
      </g>
    </g>
  </svg>
);
