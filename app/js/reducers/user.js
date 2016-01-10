import {RECIEVE_USER, REQUEST_USER} from 'actions/user'

export default function userReducer(state = {
  userName: '',
  isAuthenticated: false,
  isTemporaryUser: false,
  isRequestingUser: false,
  failedAuthentication: false
}, action) {

  switch(action.type) {
  case RECIEVE_USER:
    return Object.assign({}, state, {
      userName: action.userJson.name,
      isAuthenticated: action.userJson.isAuthenticated,
      isTemporaryUser: action.userJson.temporary,
      isRequestingUser: false,
      failedAuthentication: action.userJson.failedAuthentication
    })

  case REQUEST_USER:
    return Object.assign({}, state, {
      userName: '',
      isAuthenticated: false,
      isTemporaryUser: false,
      isRequestingUser: true,
      failedAuthentication: false
    })

  default:
    return state
  }
}
