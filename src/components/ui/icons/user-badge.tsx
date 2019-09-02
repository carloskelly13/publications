import React from "react";

interface Props {
  size?: number;
  color?: string;
}
const UserBadgeIcon: React.FC<Props> = props => (
  <svg
    width={props.size}
    height={props.size}
    viewBox="0 1 24 24"
    fill={props.color}
  >
    <path d="M23.5,6H15V4.5c0-1.654-1.346-3-3-3s-3,1.346-3,3V6H0.5C0.224,6,0,6.224,0,6.5v17C0,23.776,0.224,24,0.5,24h23 c0.276,0,0.5-0.224,0.5-0.5v-17C24,6.224,23.776,6,23.5,6z M10,4.5c0-1.103,0.897-2,2-2s2,0.897,2,2V8h-4V4.5z M9,7v1.5 C9,8.776,9.224,9,9.5,9h5C14.776,9,15,8.776,15,8.5V7h8v3H1V7H9z M1,23V11h22v12H1z" />
    <path d="M8.745,17.285C9.21,16.831,9.5,16.199,9.5,15.5C9.5,14.121,8.379,13,7,13s-2.5,1.121-2.5,2.5 c0,0.699,0.29,1.331,0.755,1.785C3.629,17.867,3,19.26,3,20.5C3,20.776,3.224,21,3.5,21h7c0.276,0,0.5-0.224,0.5-0.5 C11,19.26,10.371,17.867,8.745,17.285z M5.5,15.5C5.5,14.673,6.173,14,7,14s1.5,0.673,1.5,1.5S7.827,17,7,17S5.5,16.327,5.5,15.5z M4.048,20C4.196,19.209,4.787,18,7,18s2.804,1.209,2.952,2H4.048z" />
    <rect x="13" y="19" width="8" height="1" />
    <rect x="13" y="17" width="8" height="1" />
    <rect x="13" y="15" width="8" height="1" />
    <rect x="13" y="13" width="4" height="1" />
    <circle cx="12" cy="4.495" r="1" />
  </svg>
);

UserBadgeIcon.defaultProps = {
  color: "#fff",
  size: 18,
};

export default UserBadgeIcon;
