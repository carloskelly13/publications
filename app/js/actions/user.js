import fetch from 'isomorphic-fetch'
import {Urls} from '../core/constants'

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
      if (response.status === 200) {
        return response.json()
      } else {
        const error = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .then(userJson => {
      const dispatchData = Object.assign({}, userJson, {
        failedAuthentication: false,
        isAuthenticated: true
      })

      dispatch(receiveUser(dispatchData))
    })
    .catch(() => dispatch(receiveUser({
      name: '',
      temporary: false,
      failedAuthentication: true,
      isAuthenticated: false
    })))
  }
}

export function logoutUser() {
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
    .then(userJson => dispatch(receiveUser(Object.assign({}, userJson, {
      failedAuthentication: false,
      isAuthenticated: true
    }))))
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
    dispatch(requestUser())

    fetch(`${Urls.ApiBase}/users`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userJson)
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
    .then(() => {
      const loginData = {name: userJson.name, password: userJson.password}
      login(loginData)(dispatch)
    })
  }
}

export function updateUser(updateJson) {
  return dispatch => {
    const token = sessionStorage.getItem('access-token')

    if (!token) {
      return
    }

    dispatch({
      type: PATCH_USER
    })

    fetch(`${Urls.ApiBase}/users`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(updateJson)
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
    .then(userJson => {
      dispatch(receiveUser(Object.assign({}, userJson, {
        isAuthenticated: true,
        failedUpdate: false
      })))
    })
    .catch(() => {
      dispatch(receiveUser({
        isAuthenticated: true,
        failedUpdate: true
      }))
    })
  }
}

export function cancelUpdateUser() {
  return dispatch => dispatch({
    type: RESET_PATCH_USER
  })
}
