/**
 * Application-wide UI Reducer
 * Publications
 */

import {
  SHOW_MODAL,
  HIDE_MODAL
} from "../actions/app-ui"

const defaultState = {
  activeModal: null,
  activeModalProps: null
}

export default function appUiReducer(state = defaultState, action) {
  switch (action.type) {
  case SHOW_MODAL:
    return {
      ...state,
      activeModal: action.payload.component,
      activeModalProps: action.payload.props
    }

  case HIDE_MODAL:
    return {
      ...state,
      activeModal: null,
      activeModalProps: null
    }

  default: return state
  }
}
