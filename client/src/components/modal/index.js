// @flow
import type { Node } from "react";
import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { ModalContainer, ModalContent } from "./components";
import "./styles";

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
    {visible && <ModalContainer>{renderContent}</ModalContainer>}
  </ReactCSSTransitionGroup>
);

export { ModalContent };
