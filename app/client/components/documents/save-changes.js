import React, { Component } from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import {
  saveDocument as saveDocumentAction
} from "../../state/actions/document"
import {
  currentDocumentSelector
} from "../../state/selectors"
import { hideModal as hideModalAction } from "../../state/actions/app-ui"
import ToolbarButton from "../ui/toolbar-button"
import { ModalButtonConatiner } from "../ui/button-container"
import { Header, Message } from "../ui/text"
import { ModalContent } from "../modal"

const SaveChangesContainer = styled(ModalContent)`
  width: 400px;
`

class SaveChanges extends Component {
  renderNewDocumentContent() {
    return (
      <div>
        <Header>
          Save
        </Header>
        <Message>
          Do you want to save changes to your new document?
        </Message>
      </div>
    )
  }

  renderExistingDocumentContent() {
    const { currentDocument } = this.props
    return (
      <div>
        <Header>
          Save Changes
        </Header>
        <Message>
          Do you want to save changes to {currentDocument.name}?
        </Message>
      </div>
    )
  }

  render() {
    const {
      currentDocument,
      hideModal,
      handleRouteChange,
      saveDocument
    } = this.props
    return (
      <SaveChangesContainer>
        { currentDocument.new ?
          this.renderNewDocumentContent() : this.renderExistingDocumentContent()
        }
        <ModalButtonConatiner>
          <ToolbarButton
            primary
            marginRight
            onClick={() => {
              saveDocument(currentDocument)
              hideModal()
              setTimeout(() => handleRouteChange(), 400)
            }}
          >
            Save{ currentDocument.new ? "" : " Changes" }
          </ToolbarButton>
          <ToolbarButton
            marginRight
            onClick={() => {
              hideModal()
              setTimeout(() => handleRouteChange(), 400)
            }}
          >
            Discard{ currentDocument.new ? "" : " Changes" }
          </ToolbarButton>
          <ToolbarButton
            onClick={hideModal}
          >
            Cancel
          </ToolbarButton>
        </ModalButtonConatiner>
      </SaveChangesContainer>
    )
  }
}

const mapStateToProps = state => ({
  currentDocument: currentDocumentSelector(state)
})

const mapDispatchToProps = {
  hideModal: hideModalAction,
  saveDocument: saveDocumentAction
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveChanges)
