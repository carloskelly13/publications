import fetch from 'isomorphic-fetch'

export const RECIEVE_USER = 'RECIEVE_USER'
export const REQUEST_USER = 'REQUEST_USER'
export const PATCH_USER = 'PATCH_USER'
export const RESET_PATCH_USER = 'RESET_PATCH_USER'

const receiveUser = userJson => ({
  type: RECIEVE_USER,
  userJson
})

const requestUser = () => ({
  type: REQUEST_USER
})

const patchUser = () => ({
  type: PATCH_USER
})

const resetPatchUser = () => ({
  type: RESET_PATCH_USER
})

export function login(data = {name: '', password: ''}) {
  return dispatch => {
    dispatch(requestUser())

    fetch('http://api.publicationsapp.com/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
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
      sessionStorage.setItem('access-token', userJson.token)

      dispatch(receiveUser(Object.assign({}, userJson, {
        failedAuthentication: false,
        isAuthenticated: true
      })))
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
    sessionStorage.removeItem('access-token')

    dispatch(receiveUser({
      name: '',
      temporary: false,
      failedAuthentication: false,
      isAuthenticated: false
    }))
  }
}

export function getUser() {
  return dispatch => {
    const token = sessionStorage.getItem('access-token')

    if (!token) {
      dispatch(receiveUser({
        name: '',
        temporary: false,
        failedAuthentication: true,
        isAuthenticated: false
      }))

      return
    }

    dispatch(requestUser())

    fetch(`http://api.publicationsapp.com/users/current`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
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

    fetch(`http://api.publicationsapp.com/users`, {
      method: 'POST',
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

    dispatch(patchUser())

    fetch(`http://api.publicationsapp.com/users`, {
      method: 'PATCH',
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
  return dispatch => dispatch(resetPatchUser())
}
