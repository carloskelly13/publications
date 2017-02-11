import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { TransitionMotion, spring } from "react-motion"
import NProgress from "nprogress"
import configureStore from "stores/configureStore"

import "../../node_modules/nprogress/nprogress.css"
import "../css/_style.less"

import IndexView from "./containers/index-view"
import DocumentsView from "./containers/documents-view"
import DocumentView from "./containers/document-view"

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom"

const store = configureStore()

const willLeave = () => ({ zIndex: 1, opacity: spring(0) })

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
NProgress.configure({ showSpinner: false })
console.debug(`Starting Publications with React ${React.version}.`)
