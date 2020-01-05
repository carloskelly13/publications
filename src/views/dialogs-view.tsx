import * as React from "react";
import DialogWrapper from "../components/modal";
import LoginForm from "../components/login";
import AboutPanel from "../components/about";
import SaveDialog from "../components/save-dialog";
import NewAccountForm from "../components/new-account";
import { useAppStateContext } from "../contexts/app-state-provider";

const DialogsView: React.FC = () => {
  const {
    loginModalVisible,
    aboutModalVisible,
    saveDialogVisible,
    newAccountModalVisible,
  } = useAppStateContext();
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
    </>
  );
};

export default DialogsView;
