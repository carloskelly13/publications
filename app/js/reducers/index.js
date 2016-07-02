import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

import userReducer from './user'
import documentReducer from './document'
import errorsReducer from './errors'

export default combineReducers({
    router: routeReducer,
    user: userReducer,
    doc: documentReducer,
    errors: errorsReducer
})
