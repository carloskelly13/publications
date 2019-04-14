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
export default ({ children, visible }: Props) => (
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

export { ModalContent };
