import { combineReducers } from "redux"
import { routerReducer } from "react-router-redux"

import userReducer from "./user"
import documentReducer from "./document"
import errorsReducer from "./errors"
import securityReducer from "./security"
import appUiReducer from "./app-ui"

export default combineReducers({
  routing: routerReducer,
  appUi: appUiReducer,
  user: userReducer,
  doc: documentReducer,
  errors: errorsReducer,
  security: securityReducer
})