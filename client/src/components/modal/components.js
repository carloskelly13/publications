import styled from "styled-components";

export const ModalContainer = styled.div`
  bottom: 0;
  display: block;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 9005;
`;

export const ModalContent = styled.div`
  background: #fff;
  box-shadow: 0 1px 35px hsla(0, 0%, 0%, 0.35);
  border-radius: 0 0 6px 6px;
  margin: auto;
  padding: 1.5em 1.5em calc(1.5em + 50px);
  position: relative;
  overflow: hidden;
`;
