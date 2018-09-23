import React from "react";
import OpenDocumentDialog from "../open-document";
import LoginDialog from "../login";
import NewAccountDialog from "../new-account";
import NewDocumentDialog from "../new-document";
import StartModal from "../start-modal";
import Modal from "../modal";
import AboutPanel from "../about";
import { StateContext } from "../../contexts";

function Modals() {
  return (
    <StateContext.Consumer>
      {({
        startModalVisible,
        loginModalVisible,
        newAccountModalVisible,
        newDocumentModalVisible,
        aboutModalVisible,
        openDocumentModalVisible,
      }) => (
        <>
          <Modal renderContent={<StartModal />} visible={startModalVisible} />
          <Modal renderContent={<LoginDialog />} visible={loginModalVisible} />
          <Modal
            renderContent={<NewAccountDialog />}
            visible={newAccountModalVisible}
          />
          <Modal
            renderContent={<OpenDocumentDialog />}
            visible={openDocumentModalVisible}
          />
          <Modal renderContent={<AboutPanel />} visible={aboutModalVisible} />
          <Modal
            renderContent={<NewDocumentDialog />}
            visible={newDocumentModalVisible}
          />
        </>
      )}
    </StateContext.Consumer>
  );
}

export default Modals;
