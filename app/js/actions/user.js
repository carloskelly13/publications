import fetch from 'isomorphic-fetch'
import { Urls } from '../core/constants'
import { addError } from './errors'
import { setCsrfHeaders } from './security'

export const RECIEVE_USER = 'RECIEVE_USER'
export const REQUEST_USER = 'REQUEST_USER'
export const PATCH_USER = 'PATCH_USER'
export const RESET_PATCH_USER = 'RESET_PATCH_USER'

const receiveUser = userJson => ({
  type: RECIEVE_USER,
  userJson
})

export function login(data = { emailAddress: "", password: "" }) {
  return dispatch => new Promise((resolve, reject) => {
    dispatch({ type: REQUEST_USER })
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
      if (response.status === 200) {
        setCsrfHeaders(response.headers)(dispatch)
        return response.json()

      } else {
        throw new Error()
      }
    })
    .then(json => {
      const data = { ...json, isAuthenticated: true }
      dispatch(receiveUser(data))
      resolve()
    })
    .catch(() => {
      addError('user_auth_error')(dispatch)
      reject()
    })
  })
}

export function logout() {
  return dispatch => new Promise(resolve => {
    fetch(`${Urls.ApiBase}/users/logout`, {
      method: 'post',
      credentials: 'include'
    })
    .then(() => {
      dispatch(receiveUser({
        name: '',
        temporary: false,
        isAuthenticated: false
      }))
      resolve()
    })
  })
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
        setCsrfHeaders(response.headers)(dispatch)
        return response.json()
      } else {
        const error = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .then(userJson => dispatch(receiveUser({
      ...userJson,
      isAuthenticated: true
    })))
    .catch(() => dispatch(receiveUser({
      name: '',
      temporary: false,
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
        setCsrfHeaders(response.headers)(dispatch)

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
  return (dispatch, getState) => {
    const { csrfHeaders } = getState().security

    fetch(`${Urls.ApiBase}/users`, {
      method: 'put',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...csrfHeaders
      },
      body: JSON.stringify(updateJson)
    })
    .then(response => {
      if (response.status === 200) {
        setCsrfHeaders(response.headers)(dispatch)
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
