import {Promise} from 'es6-promise'
import fetch from 'isomorphic-fetch'

import Store from '../flux/flux.store'
import UserActions from '../actions/user.actions'

class UserStore extends Store {
  constructor() {
    super()

    let events = {}

    events[UserActions.LOGIN] = this.login
    events[UserActions.LOGOUT] = this.logout
    events[UserActions.PATCH] = this.patch
    events[UserActions.GET] = this.get
    events[UserActions.POST] = this.post

    this.register(events)
    this.initState()
  }

  initState() {
    this.clearState()
  }

  clearState() {
    this.setState({
      name: '',
      temporary: false,
      authenticated: false,
      password: '',
      currentPassword: ''
    })
  }

  get() {
    const token = sessionStorage.getItem('access-token') || ''

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
        let error = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .then(userJson => {
      let updatedState = {
        name: userJson.name,
        temporary: userJson.temporary,
        authenticated: true,
        password: '',
        currentPassword: ''
      }

      if (userJson.temporary) {
        updatedState.name = ''
      }

      this.setState(updatedState)
    })
  }

  post(payload) {
    const {data} = payload.action

    return fetch(`http://api.publicationsapp.com/users`, {
      method: 'POST',
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
        let error = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .then(userJson => {
      const payload = {action: {data: {
        name: data.name,
        password: data.password
      }}}

      return this.login(payload)
    })
  }

  patch(payload) {
    const
      {data} = payload.action,
      token = sessionStorage.getItem('access-token') || ''

    return fetch(`http://api.publicationsapp.com/users`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        let error = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .then(userJson => {
      this.setState({
        name: userJson.name,
        temporary: userJson.temporary,
        authenticated: true,
        password: '',
        currentPassword: ''
      })
    })
  }

  login(payload) {
    const loginData = payload.action.data

    return fetch('http://api.publicationsapp.com/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        let error = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .then(json => {
      this.setState({
        password: '',
        temporary: json.temporary,
        authenticated: true
      })

      sessionStorage.setItem('access-token', json.token)
    })
    .catch(error => {
      this.setState({password: '', authenticated: false, currentPassword: ''})
    })
  }

  logout(payload) {
    return new Promise(resolve => {
      this.clearState()
      sessionStorage.removeItem('access-token')
      resolve()
    });
  }

  isAuthenticated() {
    return !!sessionStorage.getItem('access-token')
  }
}

export default new UserStore()
