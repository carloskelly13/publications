import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, IndexRoute, Route } from 'react-router'
import { syncReduxAndRouter } from 'redux-simple-router'
import configureStore from 'stores/configureStore'
import { createHashHistory } from 'history/lib'

import BaseView from 'containers/base.view'
import Login from 'containers/login'
import Documents from 'containers/documents'
import Document from 'containers/document'

import { getUser } from 'actions/user'

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

export const startAppRouter = () => {
  syncReduxAndRouter(history, store, state => state.router)

  const routes = {
    path: '/',
    component: BaseView,
    indexRoute: { component: Login },
    childRoutes: [
      { path: 'login', component: Login },
      {
        path: 'documents',
        component: Documents,
        onEnter: requireAuth,
        childRoutes: [
          {
            path: ':id/edit',
            component: Document,
            onEnter: requireAuth
          }
        ]
      }
    ]
  }

  const router = <Provider store={ store }>
    <Router history={ history } routes={ routes } />
  </Provider>

  render(router, document.getElementById('pub-app'))
}
