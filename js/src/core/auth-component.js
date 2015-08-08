import React, {Component} from 'react';
import UserAuth from './user-auth';

export default class AuthComponent extends Component {
  static willTransitionTo(transition) {
    if (!UserAuth.isLoggedIn()) {
      transition.redirect('login');
    }
  }
}
