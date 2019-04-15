import React from "react";
import OpenDocumentDialog from "../open-document";
import LoginDialog from "../login";
import NewAccountDialog from "../new-account";
import NewDocumentDialog from "../new-document";
import StartModal from "../start-modal";
import Modal from "../modal";
import AboutPanel from "../about";
import { StateContext } from "../../contexts/app-state";

export default function Modals() {
  const {
    startModalVisible,
    loginModalVisible,
    newAccountModalVisible,
    newDocumentModalVisible,
    aboutModalVisible,
    openDocumentModalVisible,
  } = React.useContext(StateContext);
  return (
    <>
      <Modal visible={startModalVisible}>
        <StartModal />
      </Modal>
      <Modal visible={loginModalVisible}>
        <LoginDialog />
      </Modal>
      <Modal visible={newAccountModalVisible}>
        <NewAccountDialog />
      </Modal>
      <Modal visible={openDocumentModalVisible}>
        <OpenDocumentDialog />
      </Modal>
      <Modal visible={aboutModalVisible}>
        <AboutPanel />
      </Modal>
      <Modal visible={newDocumentModalVisible}>
        <NewDocumentDialog />
      </Modal>
    </>
  );
}
