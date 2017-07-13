import React from "react"
import { Provider } from "react-redux"
import configureStore from "./state/stores/configure-store"

import BaseView from "./components/base"
import IndexView from "./components/index"
import DocumentsView from "./components/documents"

import Router from "react-router-dom/BrowserRouter"
import Switch from "react-router-dom/Switch"
import Route from "react-router-dom/Route"

const store = configureStore()

export const App = () => (
  <Provider store={store}>
    <BaseView>
      <Router>
        <Switch>
          <Route exact path="/" component={IndexView} />
          <Route exact path="/documents" component={DocumentsView} />
        </Switch>
      </Router>
    </BaseView>
  </Provider>
)
