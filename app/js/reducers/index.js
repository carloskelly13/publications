import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import userReducer from './user'
import documentReducer from './document'
import errorsReducer from './errors'
import securityReducer from './security'

export default combineReducers({
  routing: routerReducer,
  user: userReducer,
  doc: documentReducer,
  errors: errorsReducer,
  security: securityReducer
})
