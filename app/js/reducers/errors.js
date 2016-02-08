import {ADD_ERROR, REMOVE_ERROR} from 'actions/errors'

export default function errorsReducer(state = [], action) {
  switch (action.type) {
    case ADD_ERROR:
    return [...state, action.error]

    case REMOVE_ERROR:
    return state.filter(error => action.error !== error)

    default:
    return state
  }
}
