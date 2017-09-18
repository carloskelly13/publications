import React from "react"
import { Provider } from "react-redux"
import configureStore, { history } from "./state/stores/configure-store"

import BaseView from "./components/base"
import IndexView from "./components/index"
import DocumentsView from "./components/documents"

import { ConnectedRouter } from "react-router-redux"
import Switch from "react-router-dom/Switch"
import Route from "react-router-dom/Route"

const store = configureStore()

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
)

// eslint-disable-next-line no-console
console.debug(`Publications running on React ${React.version}.`)
