import {Promise} from 'es6-promise'
import fetch from 'isomorphic-fetch'

import Store from '../flux/flux.store'
import UserActions from '../actions/user.actions'

class UserStore extends Store {
  constructor() {
    super();

    let events = {};

    events[UserActions.LOGIN] = this.login;
    events[UserActions.LOGOUT] = this.logout;

    this.register(events);
    this.initState();
  }

  initState() {
    this.clearState();
  }

  clearState() {
    this.setState({
      name: '',
      temporary: false,
      authenticated: false
    });
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
      this.setState({password: '', authenticated: false})
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
