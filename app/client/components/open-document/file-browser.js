import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import {
  sortedDocumentsSelector
} from "../../state/selectors"
import { AppColors } from "../../util/constants"
import { FileItem } from "./file-item"

const FileBrowserContainer = styled.div`
  width: calc(100% - 20px);
  height: 370px;
  border: 1px solid ${AppColors.Border};
  border-radius: 6px;
  overflow: scroll;
  background: ${AppColors.White};
  margin: 15px 0 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  padding: 10px;
`

export const FileBrowser = ({ documents, handleFileClicked, selectedFileId }) => (
  <FileBrowserContainer>
    {documents.map(doc => (
      <FileItem
        selected={selectedFileId === doc.id}
        handleClick={() => handleFileClicked(doc.id)}
        key={doc.id}
        doc={doc}
      />
    ))}
  </FileBrowserContainer>
)

export default connect(
  state => ({
    documents: sortedDocumentsSelector(state)
  }),
  null
)(FileBrowser)
