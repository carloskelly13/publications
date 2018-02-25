import React from "react";
import BaseView from "./components/base";
import IndexView from "./components/index";
import DocumentsView from "./components/documents";

import { BrowserRouter } from "react-router-dom";
import Switch from "react-router-dom/Switch";
import Route from "react-router-dom/Route";

export default class extends React.Component {
  state = {
    user: null,
  };

  setAppUser = user => this.setState({ user });

  render() {
    const authProps = { user: this.state.user, setAppUser: this.setAppUser };

    return (
      <BaseView>
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={props => <IndexView {...props} {...authProps} />}
            />
            <Route
              path="/documents"
              render={props => <DocumentsView {...props} {...authProps} />}
            />
          </Switch>
        </BrowserRouter>
      </BaseView>
    );
  }
}
