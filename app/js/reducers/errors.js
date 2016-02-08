import {ADD_ERROR, REMOVE_ERROR} from 'actions/errors'

export default function errorsReducer(state = {errors: []}, action) {
  switch (action.type) {
    case ADD_ERROR:
    return {errors: [...state.errors, action.error]}

    case REMOVE_ERROR:
    return {errors: state.errors.filter(error => action.error !== error)}

    default:
    return state
  }
}
