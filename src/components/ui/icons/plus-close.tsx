import * as React from "react";
import posed from "react-pose";
import styled from "styled-components";

const Container = posed(styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`)({
  showAsClose: {
    transform: "rotate(135deg)",
  },
  showAsPlus: {
    transform: "rotate(0deg)",
  },
});

interface Props {
  showAsClose: boolean;
}
export default function PlusCloseIcon(props: Props) {
  return (
    <Container pose={props.showAsClose ? "showAsClose" : "showAsPlus"}>
      <svg width="20" height="20" viewBox="0 0 20 20">
        <g fillRule="evenodd">
          <path
            d="M11.6666667,8.33333333 L19,8.33333333 C19.5522847,8.33333333 20,8.78104858 20,9.33333333 L20,10.6666667 C20,11.2189514 19.5522847,11.6666667 19,11.6666667 L11.6666667,11.6666667 L11.6666667,19 C11.6666667,19.5522847 11.2189514,20 10.6666667,20 L9.33333333,20 C8.78104858,20 8.33333333,19.5522847 8.33333333,19 L8.33333333,11.6666667 L1,11.6666667 C0.44771525,11.6666667 0,11.2189514 0,10.6666667 L0,9.33333333 C0,8.78104858 0.44771525,8.33333333 1,8.33333333 L8.33333333,8.33333333 L8.33333333,1 C8.33333333,0.44771525 8.78104858,1.01453063e-16 9.33333333,0 L10.6666667,0 C11.2189514,-1.01453063e-16 11.6666667,0.44771525 11.6666667,1 L11.6666667,8.33333333 Z"
            fill="#fff"
          />
        </g>
      </svg>
    </Container>
  );
}
