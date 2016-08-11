import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from 'stores/configureStore'

import BaseView from 'containers/base.view'
import Login from 'containers/login'
import Documents from 'containers/documents'
import Document from 'containers/document'

import { getUser } from 'actions/user'


export const startAppRouter = () => {
  const getRoutes = store => {

    const requireAuth = (nextState, replace, callback) => {
      store.dispatch(getUser())

      const unsubscribe = store.subscribe(() => {
        const { user } = store.getState()

        if (!user.isRequestingUser && !user.isAuthenticated) {
          unsubscribe()
          replace('/login')

        } else {
          unsubscribe()
          callback()
        }
      })
    }

    return {
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
  }

  const store = configureStore()
  const history = syncHistoryWithStore(hashHistory, store)

  const router = <Provider store={store}>
    <Router history={history}>
      { getRoutes(store) }
    </Router>
  </Provider>

  render(router, document.getElementById('pub-app'))
}
