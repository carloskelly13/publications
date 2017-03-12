/**
 * Application-wide UI actions
 * Publications
 */

export const SHOW_MODAL = "SHOW_MODAL"
export const HIDE_MODAL = "HIDE_MODAL"
export const SET_EDIT_MODE_ACTIVE = "EDIT_MODE_ACTIVE"
export const SET_SIDE_PANEL_VISIBLE = "SET_SIDE_PANEL_VISIBLE"

export const showModal = (component, props) => ({
  type: SHOW_MODAL,
  payload: { component, props }
})

export const hideModal = () => ({
  type: HIDE_MODAL
})

export const setEditModeActive = active => ({
  type: SET_EDIT_MODE_ACTIVE,
  payload: active
})

export const setSidePanelVisible = visible => ({
  type: SET_SIDE_PANEL_VISIBLE,
  payload: visible
})
