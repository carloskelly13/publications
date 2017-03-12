import React, { Component } from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import DocumentItem from "./document-item"
import SaveChanges from "./save-changes"
import {
  updateCurrentDocument as updateCurrentDocumentAction
} from "../../actions/document"
import {
  showModal as showModalAction,
  setSidePanelVisible as setSidePanelVisibleAction
} from "../../actions/app-ui"
import {
  allDocumentsSelector, currentDocumentSelector, sidePanelVisibleSelector
} from "../../selectors"
import { breakpointLg, leftPanelWidth } from "../../core/constants"
import Toolbar from "./toolbar"
import { AppColors, newDocument } from "../../core/constants"
import isEqual from "lodash.isequal"

export const DocumentsListContainer = styled.div`
  width: ${leftPanelWidth};
  position: fixed;
  background: ${AppColors.LightGray};
  overflow: scroll;
  border-left: 1px solid hsla(0, 0%, 0%, 0.25);
  box-shadow: -1px 0 5px hsla(0, 0%, 0%, 0.2);
  z-index: 2;
  height: calc(100% - 40px);
  right: 0;
  transition: transform 350ms ease-in-out;
  transform: translateX(${({ sidePanelVisible }) =>
    sidePanelVisible ? "0" : "100%"
  });

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background: rgba(245, 245, 245, 0.85);
  }
`

class DocumentsList extends Component {
  constructor() {
    super(...arguments)
    this.handleDocumentItemSelected = this.handleDocumentItemSelected.bind(this)
  }

  handleDocumentItemSelected(event, doc) {
    event.stopPropagation()
    const {
      setSelectedDocument, currentDocument, showModal, documents, setSidePanelVisible
    } = this.props
    const switchToNewDoc = () => {
      setSelectedDocument(doc)
      setTimeout(() => setSidePanelVisible(false), 250)
    }
    const currentDocumentOriginal = currentDocument.new ?
      newDocument :
      documents.filter(d => d.id === currentDocument.id)[0]

    if (!isEqual(currentDocumentOriginal, currentDocument)) {
      showModal(SaveChanges, { switchToNewDoc })
    } else {
      switchToNewDoc()
    }
  }

  renderDocumentListItems() {
    return this.props.documents
      .sort((lhs, rhs) => rhs.lastModified - lhs.lastModified)
      .map((doc, index) => (
        <DocumentItem
          doc={doc}
          key={`doc-item-${index}`}
          onClick={e => this.handleDocumentItemSelected(e, doc)}
        />
      ))
  }

  render() {
    const {
      documents, clearCurrentDocument, currentDocument, sidePanelVisible
    } = this.props
    return (
      <DocumentsListContainer
        sidePanelVisible={sidePanelVisible}
      >
        <div
          onClick={clearCurrentDocument}
        >
          { this.renderDocumentListItems() }
        </div>
      </DocumentsListContainer>
    )
  }
}

const mapStateToProps = state => ({
  documents: allDocumentsSelector(state),
  currentDocument: currentDocumentSelector(state),
  sidePanelVisible: sidePanelVisibleSelector(state)
})

const mapDispatchToProps = dispatch => ({
  setSelectedDocument: doc => dispatch(updateCurrentDocumentAction(doc)),
  showModal: (component, props) => dispatch(showModalAction(component, props)),
  clearCurrentDocument: () => dispatch(updateCurrentDocumentAction(null)),
  setSidePanelVisible: visible => dispatch(setSidePanelVisibleAction(visible))
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsList)
