import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Route from "react-router-dom/Route";
import { connect } from "react-redux";
import Toolbar from "../toolbar";
import EditorView from "../editor";
import LoadingView from "./loading";
import AsyncViewContent from "../async-content";
import MetricsBar from "../metrics-bar";
import LayersSidebar from "../layers-sidebar/index";
import {
  fetchDocuments,
  sortedDocumentsSelector,
  errorFetchingDocumentsSelector,
} from "../../modules/document";
import { sidePanelVisibleSelector } from "../../modules/ui";
import {
  currentUserSelector,
  fetchCurrentUser,
  currentUserRequestFailedSelector,
} from "../../modules/session";

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ViewContent = styled.div`
  display: flex;
  flex: 1 0 calc(100% - 85px);
`;

class DocumentsView extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUserRequestFailed || !nextProps.user) {
      this.context.router.history.replace("/");
    }
  }

  render() {
    const { sidePanelVisible } = this.props;
    return (
      <ViewContainer>
        <Toolbar />
        <MetricsBar />
        <ViewContent>
          <AsyncViewContent
            waitFor={this.props.user}
            renderLoading={<LoadingView />}
            renderContent={
              <div>
                <LayersSidebar visible={sidePanelVisible} />
                <Route path="/documents/:id" component={EditorView} />
              </div>
            }
          />
        </ViewContent>
      </ViewContainer>
    );
  }
}

export default connect(
  state => ({
    user: currentUserSelector(state),
    documents: sortedDocumentsSelector(state),
    errorFetching: errorFetchingDocumentsSelector(state),
    sidePanelVisible: sidePanelVisibleSelector(state),
    currentUserRequestFailed: currentUserRequestFailedSelector(state),
  }),
  {
    fetchCurrentUser,
    fetchDocuments,
  }
)(DocumentsView);
