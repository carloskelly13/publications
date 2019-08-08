import * as React from "react";
import { StateContext } from "../contexts/app-state";
import DialogWrapper from "../components/modal";
import LoginForm from "../components/login";
import AboutPanel from "../components/about";
import SaveDialog from "../components/save-dialog";

const DialogsView: React.FC = () => {
  const {
    loginModalVisible,
    aboutModalVisible,
    saveDialogVisible,
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
    </>
  );
};

export default DialogsView;
