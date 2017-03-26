import React from "react"
import ReactDOM from "react-dom"
import { App } from './app'
import { AppContainer } from "react-hot-loader"
import configureStore from "./state/stores/configureStore"

const store = configureStore()
const rootEl = document.getElementById("pub-app")
const render = Component => ReactDOM.render(
  <AppContainer>
    <Component store={store} />
  </AppContainer>, rootEl)

render(App)

if (module.hot) {
  module.hot.accept("./app", () => render(App))
}
