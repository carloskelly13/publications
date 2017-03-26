/**
 * Application-wide UI Selectors
 * Publications
 */

export const activeModalSelector = state =>
  state.appUi.activeModal

export const activeModalPropsSelector = state =>
  state.appUi.activeModalProps

export const editModeActiveSelector = state =>
  state.appUi.editModeActive

export const sidePanelVisibleSelector = state =>
  state.appUi.sidePanelVisible

export const zoomSelector = state =>
  state.appUi.zoom
