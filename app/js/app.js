import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import configureStore from "stores/configureStore"

import "../css/_style.less"

import IndexView from "./components/index"
import DocumentsView from "./components/documents"
import DocumentView from "./components/document"

import Router from "react-router-dom/BrowserRouter"
import Switch from "react-router-dom/Switch"
import Route from "react-router-dom/Route"

const store = configureStore()

const App = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={IndexView} />
        <Route exact path="/documents" component={DocumentsView} />
        <Route path="/documents/:uuid" component={DocumentView} />
      </Switch>
    </Router>
  </Provider>
)

render(<App />, document.getElementById("pub-app"))
console.debug(`Starting Publications with React ${React.version}.`)
