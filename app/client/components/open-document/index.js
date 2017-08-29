import React from "react"
import styled from "styled-components"
import { ModalContent } from "../modal"

const OpenDocumentContainer = styled(ModalContent)`
  width: 80%;
  max-width: 960px;
`

const OpenDocument = () => (
  <OpenDocumentContainer>
    Hello
  </OpenDocumentContainer>
)

export default OpenDocument
