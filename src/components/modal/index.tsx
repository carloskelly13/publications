import * as React from "react";
import ReactDOM from "react-dom";
import { ModalContainer, ModalContent } from "./components";

const modalRoot = document.getElementById("modal-root");

interface Props {
  children: React.ReactNode;
  visible: boolean;
}

const DialogWrapper: React.FC<Props> = ({ children, visible }) =>
  visible &&
  modalRoot && (
    <>
      {ReactDOM.createPortal(
        <ModalContainer>{children}</ModalContainer>,
        modalRoot
      )}
    </>
  );

export default DialogWrapper;

export { ModalContent };
