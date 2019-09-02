import styled from "styled-components";
import { Colors } from "../../util/constants";

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
  background: ${Colors.Modal.ModalBackground};
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.05),
    0 1px 35px hsla(0, 0%, 0%, 0.35);
  border-radius: 6px;
  margin: auto;
  padding: 0 0 calc(1.5em + 50px);
  position: relative;
  overflow: hidden;
`;
