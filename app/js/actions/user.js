import fetch from 'isomorphic-fetch'
import { Urls } from '../core/constants'
import { addError } from './errors'

export const RECIEVE_USER = 'RECIEVE_USER'
export const REQUEST_USER = 'REQUEST_USER'
export const PATCH_USER = 'PATCH_USER'
export const RESET_PATCH_USER = 'RESET_PATCH_USER'

const receiveUser = userJson => ({
  type: RECIEVE_USER,
  userJson
})

export function login(data = {emailAddress: '', password: ''}) {
  return dispatch => {
    dispatch({
      type: REQUEST_USER
    })

    fetch(`${Urls.ApiBase}/users/login`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(response => {
      console.debug(response)
      if (response.status === 200) {
        return response.json()

      } else {
        throw new Error()
      }
    })
    .then(json => {
      const data = {
        ...json,
        failedAuthentication: false,
        isAuthenticated: true
      }

      dispatch(receiveUser(data))
    })
    .catch(() => addError('user_auth_error')(dispatch))
  }
}

export function logoutUser(completion = () => {}) {
  return dispatch => {
    fetch(`${Urls.ApiBase}/users/logout`, {
      method: 'post',
      credentials: 'include'
    })
    .then(() => {
      dispatch(receiveUser({
        name: '',
        temporary: false,
        failedAuthentication: false,
        isAuthenticated: false
      }))

      completion()
    })
  }
}

export function getUser() {
  return dispatch => {
    dispatch({
      type: REQUEST_USER
    })

    fetch(`${Urls.ApiBase}/users/current`, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        const error = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .then(userJson => dispatch(receiveUser({
      ...userJson,
      failedAuthentication: false,
      isAuthenticated: true
    })))
    .catch(() => dispatch(receiveUser({
      name: '',
      temporary: false,
      failedAuthentication: true,
      isAuthenticated: false
    })))
  }
}

export function createNewUser(userJson) {
  return dispatch => {
    dispatch({
      type: REQUEST_USER
    })

    fetch(`${Urls.ApiBase}/users`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userJson)
    })
    .then(response => {
      if (response.status === 200) {
        const loginData = {
          emailAddress: userJson.emailAddress,
          password: userJson.password
        }

        login(loginData)(dispatch)
      }
    })
  }
}

export function updateUser(updateJson, completion = () => {}) {
  return dispatch => {
    fetch(`${Urls.ApiBase}/users`, {
      method: 'put',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateJson)
    })
    .then(response => {
      if (response.status === 200) {
        return response.json()

      } else {
        throw new Error()
      }
    })
    .then(json => {
      dispatch(receiveUser({
        ...json,
        isAuthenticated: true
      }))

      completion()
    })
    .catch(() => addError('user_update_error')(dispatch))
  }
}
