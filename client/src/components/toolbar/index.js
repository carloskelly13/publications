// @flow
import type { PubUser, PubShape } from "../../util/types";
import React from "react";
import ToolbarBase from "../ui/toolbar";
import FileMenu from "./file";
import NewShapeMenu from "./new-shape";
import EditMenu from "./edit";
import ZoomMenu from "./zoom";
import UserMenu from "./user-menu";
import { ContentContainer } from "../ui/containers";
import { documentName } from "../../util/string";
import { Header } from "./components";
import { StateContext } from "../../contexts";

type Props = {
  user: ?PubUser,
  selectedObject: ?Object,
  currentDocument: ?Object,
  clipboardContents: ?Object,
  zoom: number,
  addObject: (object: PubShape) => void,
  deleteObject: () => void,
  showNewDocumentModal: () => void,
  showOpenDocumentModal: () => void,
  handleClipboardAction: (action: string) => void,
  saveDocument: () => Promise<any>,
  setZoom: (zoom: number) => void,
  showLoginModal: () => void,
  logOut: () => Promise<any>,
};

export const Toolbar = (props: Props) => (
  <ToolbarBase>
    <ContentContainer verticalAlign>
      <Header>
        {props.currentDocument && props.currentDocument.name
          ? documentName(props.currentDocument.name)
          : "Publications"}
      </Header>
      <FileMenu
        loggedIn={!!props.user}
        currentDocument={props.currentDocument}
        showNewDocumentModal={props.showNewDocumentModal}
        showOpenDocumentModal={props.showOpenDocumentModal}
        saveDocument={props.saveDocument}
        setZoom={props.setZoom}
      />
      <EditMenu
        selectedObject={props.selectedObject}
        deleteObject={props.deleteObject}
        clipboardContents={props.clipboardContents}
        handleClipboardAction={props.handleClipboardAction}
        disabled={!props.currentDocument}
      />
      <NewShapeMenu
        disabled={!props.currentDocument}
        addObject={props.addObject}
      />
      <ZoomMenu
        zoom={props.zoom}
        setZoom={props.setZoom}
        disabled={!props.currentDocument}
      />
    </ContentContainer>
    <ContentContainer>
      <UserMenu
        logOut={props.logOut}
        user={props.user}
        showLoginDialog={props.showLoginModal}
      />
    </ContentContainer>
  </ToolbarBase>
);

export default () => (
  <StateContext.Consumer>
    {({
      actions,
      currentDocument,
      clipboardContents,
      user,
      zoom,
      selectedObject,
    }) => (
      <Toolbar
        currentDocument={currentDocument}
        addObject={actions.addObject}
        deleteObject={actions.deleteObject}
        handleClipboardAction={actions.handleClipboardAction}
        saveDocument={actions.saveDocument}
        logOut={actions.logOut}
        showNewDocumentModal={actions.showNewAccountModal}
        showOpenDocumentModal={actions.showOpenDocumentModal}
        showLoginModal={actions.showLoginModal}
        setZoom={actions.setZoom}
        clipboardContents={clipboardContents}
        user={user}
        zoom={zoom}
        selectedObject={selectedObject}
      />
    )}
  </StateContext.Consumer>
);
