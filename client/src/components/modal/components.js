import styled from "styled-components";
import { AppColors } from "../../util/constants";

export const ModalContainer = styled.div`
  bottom: 0;
  display: flex;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 9005;
  align-items: center;
  justify-content: center;
  background: hsla(0, 0%, 0%, 0.2);
`;

export const ModalContent = styled.div`
  background: ${AppColors.BrightWarmWhite};
  box-shadow: 0 1px 35px hsla(0, 0%, 0%, 0.35);
  border-radius: 4px;
  margin: auto;
  padding: 0 0 calc(1.5em + 50px);
  position: relative;
  overflow: hidden;
`;
