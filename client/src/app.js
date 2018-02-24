import React from "react";
import BaseView from "./components/base";
import IndexView from "./components/index";
import DocumentsView from "./components/documents";

import { BrowserRouter } from "react-router-dom";
import Switch from "react-router-dom/Switch";
import Route from "react-router-dom/Route";

export const App = () => (
  <BaseView>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={IndexView} />
        <Route path="/documents" component={DocumentsView} />
      </Switch>
    </BrowserRouter>
  </BaseView>
);
