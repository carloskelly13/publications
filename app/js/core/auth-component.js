import React, {Component} from 'react';
import UserStore from '../stores/user.store';

export default class AuthComponent extends Component {
  static willTransitionTo(transition) {
    console.log('hi')
    if (!UserStore.isAuthenticated()) {
      transition.redirect('login');
    }
  }
}
