import React from "react";
import BaseView from "./components/base";
import AsyncIndexView from "./components/index/async-view";
import AsyncDocumentView from "./components/documents/async-view";
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
              render={props => <AsyncIndexView {...props} {...authProps} />}
            />
            <Route
              path="/documents"
              render={props => <AsyncDocumentView {...props} {...authProps} />}
            />
          </Switch>
        </BrowserRouter>
      </BaseView>
    );
  }
}
