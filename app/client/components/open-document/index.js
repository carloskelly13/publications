import React, { Component } from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { ModalContent } from "../modal"
import Button from "../ui/toolbar-button"
import FileBrowser from "./file-browser"
import { ModalButtonConatiner } from "../ui/button-container"
import { Header } from "../ui/text"
import { hideModal } from "../../modules/ui"
import { loadDocumentView } from "../../modules/document"

const OpenDocumentContainer = styled(ModalContent)`
  min-width: 630px;
`

export class OpenDocument extends Component {
  state = {
    selectedId: ""
  }

  handleFileClicked = id => this.setState(() => ({ selectedId: id }))

  handleOpenButtonClicked = () => this.props.loadDocumentView({ id: this.state.selectedId })

  render() {
    const {
      props: { hideModal: hideModalAction },
      state: { selectedId }
    } = this
    return (
      <OpenDocumentContainer>
        <Header>
          Open Document
        </Header>
        <FileBrowser
          selectedFileId={selectedId}
          handleFileClicked={this.handleFileClicked}
        />
        <ModalButtonConatiner>
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
        </ModalButtonConatiner>
      </OpenDocumentContainer>
    )
  }
}

export default connect(
  null, {
    hideModal,
    loadDocumentView
  })(OpenDocument)
