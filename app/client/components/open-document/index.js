import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { ModalContent } from "../modal"
import Button from "../ui/toolbar-button"
import FileBrowser from "./file-browser"
import { ModalButtonConatiner } from "../ui/button-container"
import { Header } from "../ui/text"
import {
  hideModal as hideModalAction
} from "../../state/actions/app-ui"

const OpenDocumentContainer = styled(ModalContent)`
  width: 80%;
  max-width: 960px;
`

const OpenDocument = ({ hideModal }) => (
  <OpenDocumentContainer>
    <Header>
      Open Document
    </Header>
    <FileBrowser />
    <ModalButtonConatiner>
      <Button
        marginRight
        onClick={() => {}}
      >
        Open Document
      </Button>
      <Button
        onClick={hideModal}
      >
        Close
      </Button>
    </ModalButtonConatiner>
  </OpenDocumentContainer>
)

const mapDispatchToProps = {
  hideModal: hideModalAction
}

export default connect(null, mapDispatchToProps)(OpenDocument)
