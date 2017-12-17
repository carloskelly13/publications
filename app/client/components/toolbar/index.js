import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Toolbar as ToolbarBase } from "../ui/toolbar";
import FileMenu from "./file";
import NewShapeMenu from "./new-shape";
import EditMenu from "./edit";
import ZoomMenu from "./zoom";
import TextButton from "../ui/text-button";
import { ContentContainer } from "../ui/containers";
import { AppColors } from "../../util/constants";

const Header = styled.span`
  color: ${AppColors.Highlight};
  font-weight: 600;
  font-size: 0.95em;
  margin: 0 0.65em 0 0;
`;

const Toolbar = props => {
  const {
    user,
    selectedObject,
    currentDocument,
    layersPanelVisible,
    toggleLayersPanel,
    addObject,
    deleteObject,
    showNewDocumentModal,
    showOpenDocumentModal,
  } = props;
  return (
    <ToolbarBase>
      <ContentContainer verticalAlign>
        <Header>Publications</Header>
        <FileMenu
          disabled={!user}
          currentDocument={currentDocument}
          showNewDocumentModal={showNewDocumentModal}
          showOpenDocumentModal={showOpenDocumentModal}
        />
        <EditMenu
          selectedObject={selectedObject}
          deleteObject={deleteObject}
          disabled={!currentDocument}
        />
        <NewShapeMenu disabled={!currentDocument} addObject={addObject} />
        <ZoomMenu disabled={!currentDocument} />
      </ContentContainer>
      <ContentContainer>
        <TextButton disabled={!currentDocument} onClick={toggleLayersPanel}>
          {layersPanelVisible ? "Hide" : "Show"}&nbsp;Layers
        </TextButton>
      </ContentContainer>
    </ToolbarBase>
  );
};

Toolbar.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Toolbar;
