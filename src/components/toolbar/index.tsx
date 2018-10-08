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
import { StateContext } from "../../contexts/app-state";
import { PubShape, PubDocument, PubUser } from "../../types/pub-objects";
import { ClipboardAction } from "../documents/editor-actions";

interface Props {
  user: PubUser | null;
  selectedObject: PubShape | null;
  currentDocument: PubDocument | null;
  clipboardContents: PubShape | null;
  zoom: number;
  addObject(object: PubShape): void;
  deleteObject(): void;
  showNewDocumentModal(): void;
  showOpenDocumentModal(): void;
  showNewAccountModal(): void;
  handleClipboardAction(action: ClipboardAction): void;
  saveDocument(): Promise<any>;
  setZoom(zoom: number): void;
  showLoginModal(): void;
  showAboutModal(): void;
  logOut(): Promise<any>;
}

export const Toolbar: React.SFC<Props> = props => (
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
        showAboutModal={props.showAboutModal}
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
        showLoginModal={props.showLoginModal}
        showNewAccountModal={props.showNewAccountModal}
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
        showNewAccountModal={actions.showNewAccountModal}
        saveDocument={actions.saveDocument}
        logOut={actions.logout}
        showNewDocumentModal={actions.showNewDocumentModal}
        showOpenDocumentModal={actions.showOpenDocumentModal}
        showLoginModal={actions.showLoginModal}
        showAboutModal={actions.showAboutModal}
        setZoom={actions.setZoom}
        clipboardContents={clipboardContents}
        user={user}
        zoom={zoom}
        selectedObject={selectedObject}
      />
    )}
  </StateContext.Consumer>
);
