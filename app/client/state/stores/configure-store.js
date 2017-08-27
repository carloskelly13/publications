import { createStore, applyMiddleware } from "redux"
import createHistory from "history/createBrowserHistory"
import thunkMiddleware from "redux-thunk"
import rootReducers from "../reducers/index"
import { routerMiddleware } from "react-router-redux"

export const history = createHistory()

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  routerMiddleware(history)
)(createStore)

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducers, initialState)
  return store
}
