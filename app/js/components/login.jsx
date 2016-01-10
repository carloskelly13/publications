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
    // UserActions.post({
    //   name: `${uuid()}@publicationsapp.com`,
    //   password: 'password',
    //   temporary: true
    // })
  }

  componentWillReceiveProps(nextProps) {
    const {isAuthenticated, history} = nextProps

    console.log(this.props)

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
    return (
      <div>
        <form onSubmit={::this.logInFormSubmitted}>
          <h3>Log In</h3>
          <p>{this.props.isRequestingUser ? 'Checking Login' : ''}</p>
          <input type="text" name="name" onChange={::this.nameChanged} value={this.state.name} />
          <input type="password" name="password" onChange={::this.passwordChanged} value={this.state.password} />
          <button type="submit">Log In</button>
        </form>
        <button
          onClick={::this.createTestDriveAccount}
          role="button">
          Test Drive
        </button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
