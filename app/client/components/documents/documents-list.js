import React, { Component } from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import DocumentItem from "./document-item"
import SaveChanges from "./save-changes"
import {
  updateCurrentDocument as updateCurrentDocumentAction,
  removeDocument as removeDocumentAction
} from "../../state/actions/document"
import {
  showModal as showModalAction,
  setSidePanelVisible as setSidePanelVisibleAction
} from "../../state/actions/app-ui"
import {
  allDocumentsSelector, currentDocumentSelector, sidePanelVisibleSelector
} from "../../state/selectors"
import {
  AppColors, newDocument, sidePanelWidth
} from "../../util/constants"
import { MediumText } from "../ui/text"
import isEqual from "lodash.isequal"

export const DocumentsListContainer = styled.div`
  width: ${sidePanelWidth};
  position: fixed;
  background: ${AppColors.LightGray};
  overflow: scroll;
  border-left: 1px solid hsla(0, 0%, 0%, 0.25);
  z-index: 2;
  height: calc(100% - 85px);
  right: 0;
  transition: transform 350ms ease-in-out;
  transform: translateX(${({ sidePanelVisible }) =>
    sidePanelVisible ? "0" : "100%"
  });
`

const SidebarHeader = styled.div`
  position: sticky;
  top: 0;
  background: ${AppColors.Gray};
  padding: 0.75em 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.25);
`

class DocumentsList extends Component {
  constructor() {
    super(...arguments)
    this.handleDocumentItemSelected = this.handleDocumentItemSelected.bind(this)
  }

  handleDocumentItemSelected(event, doc) {
    event.stopPropagation()
    const {
      setSelectedDocument, currentDocument, showModal, documents
    } = this.props
    if (!currentDocument) {
      setSelectedDocument(doc)
      return
    }
    const currentDocumentOriginal = currentDocument.new ?
      newDocument :
      documents.filter(d => d.id === currentDocument.id)[0]

    if (!isEqual(currentDocumentOriginal, currentDocument)) {
      showModal(SaveChanges, {
        switchToNewDoc: () => setSelectedDocument(doc)
      })
    } else {
      setSelectedDocument(doc)
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
      sidePanelVisible
    } = this.props
    return (
      <DocumentsListContainer
        sidePanelVisible={sidePanelVisible}
      >
        <SidebarHeader>
          <MediumText
            uppercase
            size="0.8em"
          >
            Documents
          </MediumText>
        </SidebarHeader>
        { this.renderDocumentListItems() }
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
  setSidePanelVisible: visible => dispatch(setSidePanelVisibleAction(visible)),
  removeDocument: doc => dispatch(removeDocumentAction(doc))
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsList)
