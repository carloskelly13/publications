import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router, IndexRoute, Route} from 'react-router'
import {syncReduxAndRouter} from 'redux-simple-router'
import configureStore from 'stores/configureStore'
import {createHashHistory} from 'history/lib'

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
    const history = createHashHistory()
    const store = configureStore()
    syncReduxAndRouter(history, store, state => state.router)

    this.router = <Provider store={store}>
        <Router history={history}>
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
