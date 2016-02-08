export const ADD_ERROR = 'ADD_ERROR'
export const REMOVE_ERROR = 'REMOVE_ERROR'

export function addError(error = '') {
  return dispatch => dispatch({type: 'ADD_ERROR', error})
}

export function removeError(error = '') {
  return dispatch => dispatch({type: 'REMOVE_ERROR', error})
}
