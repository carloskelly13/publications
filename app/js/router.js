import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { Router, hashHistory } from "react-router"
import { syncHistoryWithStore } from "react-router-redux"
import configureStore from "stores/configureStore"

import BaseView from "containers/base.view"
import Login from "containers/login"

import { getUser } from "actions/user"

export const startAppRouter = () => {

  const getRoutes = store => {

    const requireAuth = (nextState, replace, callback) => {
      store.dispatch(getUser())

      const unsubscribe = store.subscribe(() => {
        const { user } = store.getState()

        if (!user.isRequestingUser && !user.isAuthenticated) {
          unsubscribe()
          replace("/")
          callback()

        } else {
          unsubscribe()
          callback()
        }
      })
    }

    return {
      path: "/",
      component: BaseView,
      indexRoute: { component: Login },
      childRoutes: [
        { path: "login", component: Login },
        {
          path: "documents",
          getComponent: (nextState, callback) => {
            System
              .import("containers/documents")
              .then(({ default: component }) => callback(null, component))
          },
          onEnter: requireAuth,
          childRoutes: [
            {
              path: ":id/edit",
              getComponent: (nextState, callback) => {
                System
                  .import("containers/document")
                  .then(({ default: component }) => callback(null, component))
              },
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
    <Router history={hashHistory}>
      { getRoutes(store) }
    </Router>
  </Provider>

  render(router, document.getElementById("pub-app"))
}
