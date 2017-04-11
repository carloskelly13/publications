import { SET_CSRF_HEADERS } from "../actions/security"

const defaultState = {
  csrfHeaders: {}
}

export default function securityReducer(state = defaultState, action) {
  switch (action.type) {
  case SET_CSRF_HEADERS:
    return { ...state, csrfHeaders: action.csrfHeaders }

  default:
    return state
  }
}
