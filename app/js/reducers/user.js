import {RECIEVE_USER, REQUEST_USER, PATCH_USER, RESET_PATCH_USER} from 'actions/user'

export default function userReducer(state = {
  userName: '',
  isAuthenticated: false,
  isTemporaryUser: false,
  isRequestingUser: false,
  isPatchingUser: false,
  failedAuthentication: false,
  failedUpdate: false
}, action) {

  switch(action.type) {
  case RECIEVE_USER:
    return {
      userName: action.userJson.name || state.userName,
      isAuthenticated: action.userJson.isAuthenticated,
      isTemporaryUser: action.userJson.temporary || state.isTemporaryUser,
      isRequestingUser: false,
      isPatchingUser: false,
      failedAuthentication: action.userJson.failedAuthentication || false,
      failedUpdate: action.userJson.failedUpdate || false
    }

  case REQUEST_USER:
    return {
      userName: '',
      isAuthenticated: false,
      isTemporaryUser: false,
      isRequestingUser: true,
      isPatchingUser: false,
      failedAuthentication: false,
      failedUpdate: false
    }

  case PATCH_USER:
    return Object.assign({}, state, {
      isPatchingUser: true,
      failedUpdate: false
    })

  case RESET_PATCH_USER:
    return Object.assign({}, state, {
      isPatchingUser: false,
      failedUpdate: false
    })

  default:
    return state
  }
}
