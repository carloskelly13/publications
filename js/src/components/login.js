import UserAuth from '../core/user-auth';
import React, {Component} from 'react/addons';

export default class Login extends Component {
  static willTransitionTo(transition) {
    if (UserAuth.isLoggedIn()) {
      transition.redirect('/');
    }
  }

  constructor(props, context) {
    super(props);
    this.state = {name: '', password: ''};
    this.logInFormSubmitted = this.logInFormSubmitted.bind(this);
    this.nameChanged = this.nameChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
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

  logInFormSubmitted(event) {
    event.preventDefault();

    UserAuth.logIn({
      name: this.state.name,
      password: this.state.password,
      success: () => {
        this.setState({name: '', password: ''});
        this.context.router.transitionTo('documents');
      },
      failure: () => {
        this.setState({password: ''});
      }
    });
  }
}

Login.contextTypes = {router: React.PropTypes.func.isRequired};