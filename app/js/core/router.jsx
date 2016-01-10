import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router, IndexRoute, Route, hashHistory} from 'react-router'
import configureStore from 'stores/configureStore'

import BaseView from '../components/base.view'
import Login from '../components/login'
import Documents from '../components/documents/documents'
import Document from '../components/document/document'
import UserStore from 'stores/user.store'

const requireAuth = (nextState, replaceState) => {
  // replaceState(null, '/login')
}

export default class AppRouter {
  constructor() {
    const store = configureStore()

    this.router = <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={BaseView}>
              <IndexRoute component={Login} />
              <Route path="login" component={Login} />
              <Route path="documents" component={Documents} onEnter={requireAuth} />
              <Route path="documents/:id/edit" component={Document} />
            </Route>
        </Router>
    </Provider>
  }

  run() {
    ReactDOM.render(this.router, document.getElementById('pub-app'))
  }
}
