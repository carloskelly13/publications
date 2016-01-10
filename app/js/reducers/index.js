import {combineReducers} from 'redux'
import {routeReducer} from 'redux-simple-router'

import userReducer from './user'
import documentReducer from './document'

export default combineReducers({
    router: routeReducer,
    user: userReducer,
    doc: documentReducer
})
