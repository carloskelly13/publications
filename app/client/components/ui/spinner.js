import styled from "styled-components";
import { AppColors } from "../../util/constants";

export const Spinner = styled.div`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation-name: spin;
  animation-duration: 750ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  width: ${({ size = 24 }) => `${size}px`};
  height: ${({ size = 24 }) => `${size}px`};
  display: block;
  border: 1px solid ${AppColors.MidTextGray};
  border-radius: 100%;
  border-left-color: ${AppColors.MediumGray};
  border-right-color: ${AppColors.MediumGray};
  margin: 0.5em auto;
`;
