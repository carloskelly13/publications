import React, { Component, PropTypes } from 'react'
import styled from "styled-components"
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import Toolbar from "../toolbar"
import NewDocument from "./new-document"
import DocumentItem from './document-item'
import DocumentsList from "./documents-list"
import EditorView from "../editor"
import MetricsBar from "../metrics-bar"
import Footer from "../footer"
import { currentUserSelector } from "../../state/selectors"
import { getUser as getUserAction } from "../../state/actions/user"
import { getDocuments as getDocumentsAction } from "../../state/actions/document"

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ViewContent = styled.div`
  display: flex;
  flex: 1 0 calc(100% - 115px);
`

class DocumentsView extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.getUser()
  }

  componentWillReceiveProps(nextProps, nextState) {
    /**
     * Only attempt to get documents if the current user request is complete
     * and we have a valid authenticated user.
     */
    const { user: { isRequestingUser, isAuthenticated } } = nextProps
    if (this.props.user.isRequestingUser && !isRequestingUser && isAuthenticated) {
      this.props.getDocuments()
    }
    /**
     * If we have requested the user and there is no valid authentication session
     * redirect to the login page.
     */
    else if (this.props.user.isRequestingUser && !isRequestingUser && !isAuthenticated) {
      this.context.router.history.replace("/")
    }
  }

  render() {
    const { isAuthenticated } = this.props.user
    if (isAuthenticated) {
      return (
        <ViewContainer>
          <Toolbar />
          <MetricsBar />
          <ViewContent>
            <DocumentsList />
            <EditorView />
          </ViewContent>
          <Footer />
        </ViewContainer>
      )
    }
    return null
  }
}

const mapState = state => ({
  user: currentUserSelector(state)
})

const mapDispatchToProps = {
  getUser: getUserAction,
  getDocuments: getDocumentsAction
}

export default connect(mapState, mapDispatchToProps)(DocumentsView)
