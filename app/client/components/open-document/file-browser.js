import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import {
  sortedDocumentsSelector
} from "../../state/selectors"
import { AppColors } from "../../util/constants"
import { FileItem } from "./file-item"

const FileBrowserContainer = styled.div`
  width: 100%;
  height: 300px;
  border: 1px solid ${AppColors.Border};
  border-radius: 6px;
  overflow: scroll;
  background: ${AppColors.White};
  margin: 15px 0 0;
`

export const FileBrowser = ({ documents }) => (
  <FileBrowserContainer>
    { documents.map(doc => (
        <FileItem
          key={doc.id}
          doc={doc}
        />
    )) }
  </FileBrowserContainer>
)

export default connect(
  state => ({
    documents: sortedDocumentsSelector(state)
  }),
  null
)(FileBrowser)
