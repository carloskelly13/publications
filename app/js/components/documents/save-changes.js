import React, { Component, PropTypes } from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import {
  updateSelectedShape as setSelectedShapeAction,
  saveDocument as saveDocumentAction
} from "../../actions/document"
import {
  currentDocumentSelector
} from "../../selectors"
import { hideModal as hideModalAction } from "../../actions/app-ui"
import { FramedButton } from "../ui/pub-button"
import { autobind } from "core-decorators"
import { ModalButtonConatiner } from "../ui/button-container"
import { Header, Message } from "../ui/text"
import { ModalContent } from "../modal"

const SaveChangesContainer = styled(ModalContent)`
  width: 400px;
`

class SaveChanges extends Component {
  static propTypes = {
    switchToNewDoc: PropTypes.func.isRequired,
    currentDocument: PropTypes.object.isRequired
  }

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
      switchToNewDoc,
      setSelectedShape,
      saveDocument
    } = this.props
    return (
      <SaveChangesContainer>
        { currentDocument.new ?
          this.renderNewDocumentContent() : this.renderExistingDocumentContent()
        }
        <ModalButtonConatiner>
          <FramedButton
            primary
            margin
            onClick={() => {
              saveDocument(currentDocument)
              switchToNewDoc()
              hideModal()
              setSelectedShape(null)
            }}
          >
            Save{ currentDocument.new ? "" : " Changes" }
          </FramedButton>
          <FramedButton
            margin
            onClick={() => {
              switchToNewDoc()
              hideModal()
              setSelectedShape(null)
            }}
          >
            Discard{ currentDocument.new ? "" : " Changes" }
          </FramedButton>
          <FramedButton
            margin
            onClick={hideModal}
          >
            Cancel
          </FramedButton>
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
  setSelectedShape: setSelectedShapeAction,
  saveDocument: saveDocumentAction
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveChanges)
