import * as React from "react";
import ReactDOM from "react-dom";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { ModalContainer, ModalContent } from "./components";
import "./styles";

const modalRoot = document.getElementById("modal-root");

interface Props {
  children: React.ReactNode;
  visible: boolean;
}

const DialogWrapper: React.FC<Props> = ({ children, visible }) => (
  <ReactCSSTransitionGroup
    transitionName="modal-transition"
    transitionEnterTimeout={250}
    transitionLeaveTimeout={250}
  >
    {visible && modalRoot && (
      <>
        {ReactDOM.createPortal(
          <ModalContainer>{children}</ModalContainer>,
          modalRoot
        )}
      </>
    )}
  </ReactCSSTransitionGroup>
);

export default DialogWrapper;

export { ModalContent };
