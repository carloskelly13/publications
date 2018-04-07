// @flow
import type { ToolbarProps } from "../../util/types";
import React from "react";
import ToolbarBase from "../ui/toolbar";
import FileMenu from "./file";
import NewShapeMenu from "./new-shape";
import EditMenu from "./edit";
import ZoomMenu from "./zoom";
import LayersMenu from "./layers";
import PublicationsLogo from "../ui/icons/logo";
import { ContentContainer } from "../ui/containers";
import { documentName } from "../../util/string";
import { Header, LogoContainer } from "./components";
import { ActionsContext } from "../../contexts";

export default (props: ToolbarProps) => {
  const {
    user,
    selectedObject,
    currentDocument,
    layersPanelVisible,
    clipboardContents,
    zoom,
  } = props;
  return (
    <ActionsContext.Consumer>
      {actions => (
        <ToolbarBase>
          <ContentContainer verticalAlign>
            <LogoContainer>
              <PublicationsLogo />
            </LogoContainer>
            {currentDocument &&
              currentDocument.name && (
                <Header>{documentName(currentDocument.name)}</Header>
              )}
            <FileMenu
              disabled={!user}
              currentDocument={currentDocument}
              showNewDocumentModal={actions.showNewDocumentModal}
              showOpenDocumentModal={actions.showOpenDocumentModal}
              saveDocument={actions.saveDocument}
              setZoom={actions.setZoom}
              logOut={actions.logOut}
            />
            <EditMenu
              selectedObject={selectedObject}
              deleteObject={actions.deleteObject}
              clipboardContents={clipboardContents}
              handleClipboardAction={actions.handleClipboardAction}
              disabled={!currentDocument}
            />
            <NewShapeMenu
              disabled={!currentDocument}
              addObject={actions.addObject}
            />
            <LayersMenu
              toggleLayersPanel={actions.toggleLayersPanel}
              layersPanelVisible={layersPanelVisible}
            />
            <ZoomMenu
              zoom={zoom}
              setZoom={actions.setZoom}
              disabled={!currentDocument}
            />
          </ContentContainer>
        </ToolbarBase>
      )}
    </ActionsContext.Consumer>
  );
};
