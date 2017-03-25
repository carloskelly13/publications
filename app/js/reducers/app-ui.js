/**
 * Application-wide UI Reducer
 * Publications
 */

import {
  SHOW_MODAL,
  HIDE_MODAL,
  SET_EDIT_MODE_ACTIVE,
  SET_SIDE_PANEL_VISIBLE,
  SET_ZOOM
} from "../actions/app-ui"

const defaultState = {
  activeModal: null,
  activeModalProps: null,
  editModeActive: true,
  sidePanelVisible: true,
  zoom: 1
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
    return { ...state, activeModal: null, activeModalProps: null }

  case SET_EDIT_MODE_ACTIVE:
    return { ...state, editModeActive: action.payload }

  case SET_SIDE_PANEL_VISIBLE:
    return { ...state, sidePanelVisible: action.payload }

  case SET_ZOOM:
    return { ...state, zoom: action.payload }

  default: return state
  }
}
