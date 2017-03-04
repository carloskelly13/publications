import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import DocumentItem from "./document-item"
import { updateCurrentDocument as updateCurrentDocumentAction } from "../../actions/document"
import { allDocumentsSelector } from "../../selectors"
import { breakpointLg } from "../../core/constants"
import Toolbar from "./toolbar"

export const DocumentsListContainer = styled.div`
  width: 25vw;
  flex: 1 1 auto;
  overflow: scroll;
  border-right: 1px solid #ccc;
  z-index: 2;
  background: #fff;
`

const renderDocumentListItems = documents => documents
  .sort((lhs, rhs) => rhs.lastModified - lhs.lastModified)
  .map((doc, index) => <DocumentItem doc={doc} key={`doc-item-${index}`} />)

const DocumentsList = ({ documents, clearCurrentDocument }) => (
  <DocumentsListContainer>
    <div
      onClick={clearCurrentDocument}
    >
      { renderDocumentListItems(documents) }
    </div>
  </DocumentsListContainer>
)

const mapStateToProps = state => ({
  documents: allDocumentsSelector(state)
})

const mapDispatchToProps = dispatch => ({
  clearCurrentDocument: () => dispatch(updateCurrentDocumentAction(null))
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsList)
