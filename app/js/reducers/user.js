import {
  RECIEVE_USER,
  REQUEST_USER,
  PATCH_USER
} from 'actions/user'

export default function userReducer(state = {
  userId: null,
  userName: '',
  isAuthenticated: false,
  isTemporaryUser: false,
  isRequestingUser: false,
  failedAuthentication: false
}, action) {

  switch(action.type) {
  case RECIEVE_USER:
    return Object.assign({}, state, {
      userId: action.userJson.id,
      userName: action.userJson.emailAddress,
      isAuthenticated: action.userJson.isAuthenticated,
      isTemporaryUser: action.userJson.temporary,
      isRequestingUser: false,
      failedAuthentication: action.userJson.failedAuthentication || false
    })

  case REQUEST_USER:
    return {
      userId: null,
      userName: '',
      isAuthenticated: false,
      isTemporaryUser: false,
      isRequestingUser: true,
      failedAuthentication: false
    }

  default:
    return state
  }
}
