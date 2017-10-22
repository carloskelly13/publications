import React, { Component } from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { ModalContent } from "../modal"
import Button from "../ui/framed-button"
import FileBrowser, { FileBrowserLoadingContainer } from "./file-browser"
import AsyncViewContent from "../async-content"
import { ModalButtonContainer } from "../ui/button-container"
import { hideModal } from "../../modules/ui"
import {
  loadDocumentView, fetchDocuments, sortedDocumentsSelector
} from "../../modules/document"
import { Spinner } from "../ui/spinner"

const OpenDocumentContainer = styled(ModalContent)`
  min-width: 630px;
  padding: 0 0 40px;
`

export class OpenDocument extends Component {
  state = {
    selectedId: ""
  }

  componentDidMount() {
    this.props.fetchDocuments()
  }

  handleFileClicked = id => this.setState(() => ({ selectedId: id }))

  handleOpenButtonClicked = () => this.props.loadDocumentView({ id: this.state.selectedId })

  render() {
    const {
      props: { hideModal: hideModalAction, documents },
      state: { selectedId }
    } = this
    return (
      <OpenDocumentContainer>
        <AsyncViewContent
          waitFor={documents}
          renderLoading={(
            <FileBrowserLoadingContainer>
              <Spinner />
            </FileBrowserLoadingContainer>
          )}
          renderContent={(
            <FileBrowser
              selectedFileId={selectedId}
              handleFileClicked={this.handleFileClicked}
            />
          )}
        />
        <ModalButtonContainer>
          <Button
            marginRight
            disabled={selectedId === ""}
            onClick={this.handleOpenButtonClicked}
          >
            Open Document
          </Button>
          <Button
            onClick={hideModalAction}
          >
            Close
          </Button>
        </ModalButtonContainer>
      </OpenDocumentContainer>
    )
  }
}

export default connect(
  state => ({
    documents: sortedDocumentsSelector(state)
  }), {
    hideModal,
    loadDocumentView,
    fetchDocuments
  })(OpenDocument)
