import React, { Component } from "react"
import PropTypes from "prop-types";
import styled from "styled-components"
import Route from "react-router-dom/Route"
import { connect } from "react-redux"
import Toolbar from "../toolbar"
import EditorView from "../editor"
import MetricsBar from "../metrics-bar"
import { currentUserSelector, sidePanelVisibleSelector } from "../../state/selectors"
import { getUser as getUserAction } from "../../state/actions/user"
import { getDocuments as getDocumentsAction } from "../../state/actions/document"
import { LayersSidebar } from "../layers-sidebar/index"

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

  componentDidMount() {
    this.props.getUser()
  }

  componentWillReceiveProps(nextProps) {
    /**
     * Only attempt to get documents if the current user request is complete
     * and we have a valid authenticated user.
     */
    const { user: { isRequestingUser, isAuthenticated } } = nextProps
    if (this.props.user.isRequestingUser && !isRequestingUser && isAuthenticated) {
      this.props.getDocuments()
      /**
       * If we have requested the user and there is no valid authentication session
       * redirect to the login page.
       */
    } else if (this.props.user.isRequestingUser && !isRequestingUser && !isAuthenticated) {
      this.context.router.history.replace("/")
    }
  }

  render() {
    const {
      user: { isAuthenticated },
      sidePanelVisible
    } = this.props
    if (!isAuthenticated) { return null }
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

const mapState = state => ({
  user: currentUserSelector(state),
  sidePanelVisible: sidePanelVisibleSelector(state)
})

const mapDispatchToProps = {
  getUser: getUserAction,
  getDocuments: getDocumentsAction
}

export default connect(mapState, mapDispatchToProps)(DocumentsView)
