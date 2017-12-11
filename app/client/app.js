import React from "react";
import { Provider } from "react-redux";
import { history, store } from "./modules/configure-store";

import BaseView from "./components/base";
import IndexView from "./components/index";
import DocumentsView from "./components/documents";

import { ConnectedRouter } from "react-router-redux";
import Switch from "react-router-dom/Switch";
import Route from "react-router-dom/Route";

export const App = () => (
  <Provider store={store}>
    <BaseView>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={IndexView} />
          <Route path="/documents" component={DocumentsView} />
        </Switch>
      </ConnectedRouter>
    </BaseView>
  </Provider>
);
