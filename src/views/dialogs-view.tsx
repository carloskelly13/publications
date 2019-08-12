import * as React from "react";
import { StateContext } from "../contexts/app-state";
import DialogWrapper from "../components/modal";
import LoginForm from "../components/login";
import AboutPanel from "../components/about";
import SaveDialog from "../components/save-dialog";
import NewAccountForm from "../components/new-account";
import NewDocumentForm from "../components/new-document";

const DialogsView: React.FC = () => {
  const {
    loginModalVisible,
    aboutModalVisible,
    saveDialogVisible,
    newAccountModalVisible,
    newDocumentModalVisible,
  } = React.useContext(StateContext);
  return (
    <>
      <DialogWrapper visible={loginModalVisible}>
        <LoginForm />
      </DialogWrapper>
      <DialogWrapper visible={aboutModalVisible}>
        <AboutPanel />
      </DialogWrapper>
      <DialogWrapper visible={saveDialogVisible}>
        <SaveDialog />
      </DialogWrapper>
      <DialogWrapper visible={newAccountModalVisible}>
        <NewAccountForm />
      </DialogWrapper>
      <DialogWrapper visible={newDocumentModalVisible}>
        <NewDocumentForm />
      </DialogWrapper>
    </>
  );
};

export default DialogsView;
