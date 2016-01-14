import React, {Component} from 'react'
import uuid from 'uuid4'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as UserActions from 'actions/user'

const mapStateToProps = state => state.user
const mapDispatchToProps = dispatch => bindActionCreators(UserActions, dispatch)

export class Login extends Component {
  constructor() {
    super(...arguments)
    this.state = {name: '', password: ''}
  }

  componentDidMount() {
    this.props.getUser()
  }

  createTestDriveAccount() {
    this.props.createNewUser({
      name: `${uuid()}@publicationsapp.com`,
      password: 'password',
      temporary: true
    })
  }

  componentWillReceiveProps(nextProps) {
    const {isAuthenticated, history} = nextProps

    if (isAuthenticated) {
      history.push('/documents')
    }
  }

  nameChanged(event) {
    this.setState({name: event.target.value});
  }

  passwordChanged(event) {
    this.setState({password: event.target.value});
  }

  logInFormSubmitted(event) {
    event.preventDefault()

    this.props.login({
      name: this.state.name,
      password: this.state.password
    })
  }

  render() {
    const loginForm = <form onSubmit={::this.logInFormSubmitted}>
        <h3>Log In</h3>
        <p>{this.props.isRequestingUser ? 'Checking Login' : ''}</p>
        <input type="text" name="name" onChange={::this.nameChanged} value={this.state.name} />
        <input type="password" name="password" onChange={::this.passwordChanged} value={this.state.password} />
        <button type="submit">Log In</button>
      </form>

    const testDriveButton = <button
      onClick={::this.createTestDriveAccount}
      role="button">
      Test Drive
    </button>

    return <div className="index-view">
      <div className="index-container">
        <div className="index-logo"></div>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
