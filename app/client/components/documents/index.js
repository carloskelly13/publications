import React, { Component } from "react"
import PropTypes from "prop-types";
import styled from "styled-components"
import Route from "react-router-dom/Route"
import { connect } from "react-redux"
import Toolbar from "../toolbar"
import EditorView from "../editor"
import MetricsBar from "../metrics-bar"
import LayersSidebar from "../layers-sidebar/index"
import {
  fetchDocuments,
  sortedDocumentsSelector,
  errorFetchingDocumentsSelector
} from "../../modules/document"

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ViewContent = styled.div`
  display: flex;
  flex: 1 0 calc(100% - 85px);
`

class DocumentsView extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  render() {
    const {
      sidePanelVisible = false
    } = this.props
    return (
      <ViewContainer>
        <Toolbar />
        <MetricsBar />
        <ViewContent>
          <LayersSidebar visible={sidePanelVisible} />
          <Route path="/documents/:id" component={EditorView} />
        </ViewContent>
      </ViewContainer>
    )
  }
}

export default connect(
  state => ({
    documents: sortedDocumentsSelector(state),
    errorFetching: errorFetchingDocumentsSelector(state)
  }), {
    fetchDocuments
  })(DocumentsView)
