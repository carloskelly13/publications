// @flow
import type { ToolbarProps } from "../../util/types";
import React from "react";
import PropTypes from "prop-types";
import ToolbarBase from "../ui/toolbar";
import FileMenu from "./file";
import NewShapeMenu from "./new-shape";
import EditMenu from "./edit";
import ZoomMenu from "./zoom";
import TextButton from "../ui/text-button";
import { ContentContainer } from "../ui/containers";
import { documentName } from "../../util/string";
import { Header } from "./components";

export default class extends React.PureComponent<ToolbarProps> {
  static contextTypes = {
    actions: PropTypes.object,
  };

  render() {
    const {
      user,
      selectedObject,
      currentDocument,
      layersPanelVisible,
      clipboardContents,
      zoom,
    } = this.props;

    const { actions } = this.context;

    return (
      <ToolbarBase>
        <ContentContainer verticalAlign>
          <Header>
            {currentDocument && currentDocument.name
              ? documentName(currentDocument.name)
              : "Publications"}
          </Header>
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
          <ZoomMenu
            zoom={zoom}
            setZoom={actions.setZoom}
            disabled={!currentDocument}
          />
        </ContentContainer>
        <ContentContainer>
          <TextButton
            disabled={!currentDocument}
            onClick={actions.toggleLayersPanel}
          >
            {layersPanelVisible ? "Hide" : "Show"}&nbsp;Layers
          </TextButton>
        </ContentContainer>
      </ToolbarBase>
    );
  }
}
