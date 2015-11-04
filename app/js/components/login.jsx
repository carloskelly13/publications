import UserStore from '../stores/user.store';
import React, {Component} from 'react/addons';

import UserActions from '../actions/user.actions';

export default class Login extends Component {
  static willTransitionTo(transition) {
    if (UserStore.isAuthenticated()) {
      transition.redirect('/');
    }
  }

  constructor(props, context) {
    super(props);

    this.dataChanged = this.dataChanged.bind(this);
    this.logInFormSubmitted = this.logInFormSubmitted.bind(this);
    this.nameChanged = this.nameChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);

    this.store = UserStore;
    this.state = this.store.getState();
  }

  componentWillMount() {
    this.store.addChangeListener(this.dataChanged);
  }

  componentWillUnmount() {
    this.store.removeChangeListener(this.dataChanged);
  }

  render() {
    return (
      <form onSubmit={this.logInFormSubmitted}>
        <h3>Log In</h3>
        <input type="text" name="name" onChange={this.nameChanged} value={this.state.name} />
        <input type="password" name="password" onChange={this.passwordChanged} value={this.state.password} />
        <button type="submit">Log In</button>
      </form>
    );
  }

  nameChanged(event) {
    this.setState({name: event.target.value});
  }

  passwordChanged(event) {
    this.setState({password: event.target.value});
  }

  dataChanged() {
    this.setState(this.store.getState());

    if (this.state.authenticated) {
      this.context.router.transitionTo('documents');
    }
  }

  logInFormSubmitted(event) {
    event.preventDefault();

    UserActions.login({
      name: this.state.name,
      password: this.state.password
    });
  }
}

Login.contextTypes = {router: React.PropTypes.func.isRequired};
