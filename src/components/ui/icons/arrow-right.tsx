import * as React from "react";

interface Props {
  color?: string;
  size?: number;
}
export default function ArrowRight(props: Props) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24">
      <path
        fill={props.color}
        d="M23.852,11.145L13.703,1.096c-0.96-0.96-2.678-0.924-3.68,0.075C8.987,2.206,8.953,3.857,9.955,4.86l4.321,4.144H2.03
	c-1.271,0-2.03,1.271-2.03,2.5c0,0.617,0.167,1.207,0.472,1.659c0.369,0.549,0.913,0.851,1.53,0.851h12.276l-4.156,4.16
	c-0.456,0.454-0.708,1.07-0.708,1.734c0,0.708,0.293,1.409,0.807,1.922c0.512,0.512,1.211,0.806,1.919,0.806
	c0.664,0,1.28-0.251,1.739-0.708l9.977-10.076C24.05,11.655,24.048,11.339,23.852,11.145z"
      />
    </svg>
  );
}

ArrowRight.defaultProps = {
  color: "#fff",
  size: 17,
};
