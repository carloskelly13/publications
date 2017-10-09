import { Urls, baseRequestHeaders } from "../../util/constants"
import { setCsrfHeaders } from "./security"

export const RECIEVE_USER = "RECIEVE_USER"
export const REQUEST_USER = "REQUEST_USER"
export const PATCH_USER = "PATCH_USER"
export const RESET_PATCH_USER = "RESET_PATCH_USER"

const receiveUser = userJson => ({
  type: RECIEVE_USER,
  userJson
})

export const login = (data = { emailAddress: "", password: "" }) => {
  return dispatch => new Promise((resolve, reject) => {
    dispatch({ type: REQUEST_USER })
    fetch(`${Urls.ApiBase}/users/login`, {
      method: "post",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.status === 200) {
        setCsrfHeaders(response.headers)(dispatch)
        return response.json()
      } else {
        return null
      }
    })
    .then(json => {
      if (!json) {
        reject()
        return
      }
      const user = { ...json, isAuthenticated: true }
      dispatch(receiveUser(user))
      resolve()
    })
  })
}

export const logout = () => {
  return dispatch => new Promise(resolve => {
    fetch(`${Urls.ApiBase}/users/logout`, {
      method: "post",
      credentials: "include"
    })
    .then(() => {
      dispatch(receiveUser({
        name: "",
        temporary: false,
        isAuthenticated: false
      }))
      resolve()
    })
  })
}

export const getUser = () => async dispatch => {
  dispatch({ type: REQUEST_USER })

  const response = await fetch(`${Urls.ApiBase}/users/current`, {
    method: "get",
    ...baseRequestHeaders
  })

  if (response.status !== 200) {
    return dispatch(receiveUser({
      name: "",
      temporary: false,
      isAuthenticated: false
    }))
  }

  setCsrfHeaders(response.headers)(dispatch)
  const user = await response.json()

  if (!user) {
    return dispatch(receiveUser({
      name: "",
      temporary: false,
      isAuthenticated: false
    }))
  }

  return dispatch(receiveUser({
    ...user,
    isAuthenticated: true
  }))
}

export const createNewUser = userJson => {
  return dispatch => {
    dispatch({
      type: REQUEST_USER
    })

    fetch(`${Urls.ApiBase}/users`, {
      method: "post",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
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

export const updateUser = (updateJson, completion = () => {}) => {
  return (dispatch, getState) => {
    const { csrfHeaders } = getState().security

    fetch(`${Urls.ApiBase}/users`, {
      method: "put",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...csrfHeaders
      },
      body: JSON.stringify(updateJson)
    })
    .then(response => {
      if (response.status === 200) {
        setCsrfHeaders(response.headers)(dispatch)
        return response.json()

      } else {
        return null
      }
    })
    .then(json => {
      dispatch(receiveUser({
        ...json,
        isAuthenticated: true
      }))
      completion()
    })
  }
}
