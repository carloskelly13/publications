/**
 * Application-wide UI actions
 * Publications
 */

export const SHOW_MODAL = "SHOW_MODAL"
export const HIDE_MODAL = "HIDE_MODAL"

export const showModal = (component, props) => ({
  type: SHOW_MODAL,
  payload: { component, props }
})

export const hideModal = () => ({
  type: HIDE_MODAL
})
