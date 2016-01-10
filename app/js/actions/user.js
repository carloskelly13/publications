import fetch from 'isomorphic-fetch'

export const RECIEVE_USER = 'RECIEVE_USER'
export const REQUEST_USER = 'REQUEST_USER'

const receiveUser = userJson => ({
  type: RECIEVE_USER,
  userJson
})

const requestUser = () => ({
  type: REQUEST_USER
})

export function login(data = {name: '', password: ''}) {
  return dispatch => {
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

    return fetch(`http://api.publicationsapp.com/users/current`, {
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
