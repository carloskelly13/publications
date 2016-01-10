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

import {getUser} from 'actions/user'

const history = createHashHistory()
const store = configureStore()

const requireAuth = (nextState, replaceState, callback) => {
  store.dispatch(getUser())

  const unsubscribe = store.subscribe(() => {
    const {failedAuthentication, isAuthenticated} = store.getState().user

    if (failedAuthentication) {
      const nextPathame = nextState.location.pathname
      replaceState({nextPathame}, '/login')
      unsubscribe()
    } else if (isAuthenticated) {
      unsubscribe()
    }
    callback()
  })
}

export default class AppRouter {
  constructor() {
    syncReduxAndRouter(history, store, state => state.router)

    this.router = <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={BaseView}>
            <IndexRoute component={Login} />
            <Route path="login" component={Login} />
            <Route path="documents" component={Documents} onEnter={requireAuth} />
            <Route path="documents/:id/edit" component={Document} onEnter={requireAuth} />
          </Route>
        </Router>
    </Provider>
  }

  run() {
    ReactDOM.render(this.router, document.getElementById('pub-app'))
  }
}
