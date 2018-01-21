import type { Node } from "react";
import React from "react";
import styled, { injectGlobal } from "styled-components";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  .modal-transition-enter {
    transform: translateY(-100%);
  }

  .modal-transition-enter.modal-transition-enter-active {
    transform: translateY(0);
    transition: transform 600ms ease-in-out;
  }

  .modal-transition-leave {
    transform: translateY(0);
  }

  .modal-transition-leave.modal-transition-leave-active {
    transform: translateY(-100%);
    transition: transform 600ms ease-in-out;
  }
`;

const ModalContainer = styled.div`
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

type Props = {
  renderContent: Node,
  visible: boolean,
};
const Modal = ({ renderContent, visible }: Props) => (
  <ReactCSSTransitionGroup
    transitionName="modal-transition"
    transitionEnterTimeout={600}
    transitionLeaveTimeout={600}
  >
    {visible && <ModalContainer>{renderContent}</ModalContainer>}
  </ReactCSSTransitionGroup>
);

export default Modal;
