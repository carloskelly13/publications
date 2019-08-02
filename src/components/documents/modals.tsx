// import React from "react";
// import OpenDocumentDialog from "../open-document";
// import LoginDialog from "../login";
// import NewAccountDialog from "../new-account";
// import NewDocumentDialog from "../new-document";
// import StartModal from "../start-modal";
// import DialogWrapper from "../modal";
// import AboutPanel from "../about";
// import { StateContext } from "../../contexts/app-state";

// export default function Modals() {
//   const {
//     startModalVisible,
//     loginModalVisible,
//     newAccountModalVisible,
//     newDocumentModalVisible,
//     aboutModalVisible,
//     openDocumentModalVisible,
//   } = React.useContext(StateContext);
//   return (
//     <>
//       <DialogWrapper visible={startModalVisible}>
//         <StartModal />
//       </DialogWrapper>
//       <DialogWrapper visible={loginModalVisible}>
//         <LoginDialog />
//       </DialogWrapper>
//       <DialogWrapper visible={newAccountModalVisible}>
//         <NewAccountDialog />
//       </DialogWrapper>
//       <DialogWrapper visible={openDocumentModalVisible}>
//         <OpenDocumentDialog />
//       </DialogWrapper>
//       <DialogWrapper visible={aboutModalVisible}>
//         <AboutPanel />
//       </DialogWrapper>
//       <DialogWrapper visible={newDocumentModalVisible}>
//         <NewDocumentDialog />
//       </DialogWrapper>
//     </>
//   );
// }
