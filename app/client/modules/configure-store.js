import { createStore, applyMiddleware } from "redux"
import createHistory from "history/createBrowserHistory"
import createSagaMiddleware from "redux-saga"
import { routerMiddleware } from "react-router-redux"
import rootSaga, { rootReducer } from "./"

export const history = createHistory()
const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware, routerMiddleware(history))
)

sagaMiddleware.run(rootSaga)
