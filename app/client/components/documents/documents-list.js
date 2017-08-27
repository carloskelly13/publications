import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { connect } from "react-redux"
import { DocumentItem } from "./document-item"
import SaveChanges from "./save-changes"
import isEqual from "lodash.isequal"
import {
  updateCurrentDocument as updateCurrentDocumentAction,
  removeDocument as removeDocumentAction,
  saveDocument as saveDocumentAction
} from "../../state/actions/document"
import {
  showModal as showModalAction,
  setSidePanelVisible as setSidePanelVisibleAction
} from "../../state/actions/app-ui"
import {
  allDocumentsSelector, currentDocumentSelector, sidePanelVisibleSelector, currentDocumentOriginalSelector
} from "../../state/selectors"
import {
  AppColors, sidePanelWidth
} from "../../util/constants"

export const DocumentsListContainer = styled.div`
  width: ${sidePanelWidth};
  position: fixed;
  background: ${AppColors.LightGray};
  border-left: 1px solid hsla(0, 0%, 0%, 0.25);
  z-index: 2;
  height: calc(100% - 59px);
  display: flex;
  flex-direction: column;
  right: 0;
  transition: transform 350ms ease-in-out;
  transform: translateX(${({ sidePanelVisible }) =>
    sidePanelVisible ? "0" : "100%"
  });
`

class DocumentsList extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleDocumentItemSelected = (event, id) => {
    event.stopPropagation()
    const { currentDocument, currentDocumentOriginal } = this.props
    const hasDocumentChanged = !isEqual(currentDocumentOriginal, currentDocument)

    if (currentDocument && hasDocumentChanged) {
      this.props.showModal(SaveChanges, {
        handleRouteChange: () => this.context.router.history.push(`/documents${id ? `/${id}` : ""}`)
      })
    } else if (currentDocument && !hasDocumentChanged) {
      this.context.router.history.push(`/documents${id ? `/${id}` : ""}`)
    } else if (!currentDocument && id) {
      this.context.router.history.push(`/documents/${id}`)
    } else {
      this.context.router.history.push("/documents")
    }
  }

  renderDocumentListItems() {
    const { currentDocument } = this.props
    return this.props.documents
      .sort((lhs, rhs) => rhs.lastModified - lhs.lastModified)
      .map(doc => (
        <DocumentItem
          doc={doc}
          selectedDocument={currentDocument}
          key={`doc-item-${doc.id}`}
          onClick={e => this.handleDocumentItemSelected(e, doc.id)}
        />
      ))
  }

  render() {
    const { sidePanelVisible } = this.props
    return (
      <DocumentsListContainer
        sidePanelVisible={sidePanelVisible}
      >
        { this.renderDocumentListItems() }
      </DocumentsListContainer>
    )
  }
}

const mapStateToProps = state => ({
  documents: allDocumentsSelector(state),
  currentDocument: currentDocumentSelector(state),
  sidePanelVisible: sidePanelVisibleSelector(state),
  currentDocumentOriginal: currentDocumentOriginalSelector(state)
})

const mapDispatchToProps = dispatch => ({
  clearSelectedDocument: () => dispatch(updateCurrentDocumentAction(null)),
  showModal: (component, props) => dispatch(showModalAction(component, props)),
  setSidePanelVisible: visible => dispatch(setSidePanelVisibleAction(visible)),
  removeDocument: doc => dispatch(removeDocumentAction(doc)),
  saveDocument: doc => dispatch(saveDocumentAction(doc))
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsList)
