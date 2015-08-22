import _ from 'lodash';
import axios from 'axios';
import {Promise} from 'es6-promise';

import Store from '../flux/flux.store';
import UserActions from '../actions/user.actions';

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
    let request = axios({
      url: `http://api.publicationsapp.com/login`,
      method: 'post',
      data: payload.action.data
    });

    request.then(responseObj => {
      let userData = responseObj.data;

      this.setState({
        password: '',
        temporary: userData.temporary,
        authenticated: true
      });

      sessionStorage.setItem('access-token', responseObj.data.token);
    });

    request.catch(error => {
      this.setState({
        password: '',
        authenticated: false
      });
    });

    return request;
  }

  logout(payload) {
    return new Promise(resolve => {
      this.clearState();
      sessionStorage.removeItem('access-token');
      resolve();
    });
  }

  isAuthenticated() {
    return !!sessionStorage.getItem('access-token');
  }
}

export default new UserStore();
