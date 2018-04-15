// @flow
import type { Node } from "react";
import * as React from "react";
import ReactDOM from "react-dom";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { ModalContainer, ModalContent } from "./components";
import "./styles";

const modalRoot = document.getElementById("modal-root");

type Props = {
  renderContent: Node,
  visible: boolean,
};
export default ({ renderContent, visible }: Props) => (
  <ReactCSSTransitionGroup
    transitionName="modal-transition"
    transitionEnterTimeout={250}
    transitionLeaveTimeout={250}
  >
    {visible &&
      modalRoot && (
        <>
          {ReactDOM.createPortal(
            <ModalContainer>{renderContent}</ModalContainer>,
            modalRoot
          )}
        </>
      )}
  </ReactCSSTransitionGroup>
);

export { ModalContent };
