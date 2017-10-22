import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { Toolbar as ToolbarBase } from "../ui/toolbar"
import FileMenu from "./file"
import NewShapeMenu from "./new-shape"
import EditMenu from "./edit"
import ZoomMenu from "./zoom"
import FramedButton from "../ui/framed-button"
import { ContentContainer } from "../ui/containers"
import { currentDocumentSelector, selectedShapeSelector } from "../../modules/document"
import { currentUserSelector } from "../../modules/session"
import { sidePanelVisibleSelector, toggleSidePanel } from "../../modules/ui"

const Toolbar = props => {
  const {
    user,
    currentDocument,
    sidePanelVisible,
    toggleSidePanel
  } = props
  return (
    <ToolbarBase>
      <ContentContainer>
        <FileMenu disabled={!user} />
        <EditMenu disabled={!currentDocument} />
        <NewShapeMenu disabled={!currentDocument} />
        <ZoomMenu disabled={!currentDocument} />
      </ContentContainer>
      <ContentContainer>
        <FramedButton
          disabled={!currentDocument}
          active={sidePanelVisible}
          onClick={toggleSidePanel}
        >
          Layers
        </FramedButton>
      </ContentContainer>
    </ToolbarBase>
  )
}

Toolbar.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(
  state => ({
    user: currentUserSelector(state),
    currentDocument: currentDocumentSelector(state),
    selectedShape: selectedShapeSelector(state),
    sidePanelVisible: sidePanelVisibleSelector(state)
  }), {
    toggleSidePanel
  })(Toolbar)
