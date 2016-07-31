import React, { Component } from 'react'
import uuid from 'node-uuid'
import { LoginAboutBox } from '../components/login/about'
import { LoginForm } from '../components/login/loginForm'

import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import * as UserActions from 'actions/user'
import * as ErrorsActions from 'actions/errors'

export class Login extends Component {
  state = {
    emailAddress: '',
    password: ''
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(UserActions.getUser())
  }

  @autobind
  createTestDriveAccount() {
    const { dispatch } = this.props
    dispatch(UserActions.createNewUser({
      emailAddress: `${uuid.v4()}@publicationsapp.com`,
      password: 'password',
      temporary: true
    }))
  }

  componentWillReceiveProps({ isAuthenticated }) {
    if (isAuthenticated) {
      this.props.history.push('/documents')
    }
  }

  @autobind
  loginFormValueChanged({ target }) {
    this.setState({ [target.name] : target.value })
  }

  @autobind
  logInFormSubmitted(event) {
    const { dispatch } = this.props
    event.preventDefault()

    dispatch(ErrorsActions.removeError('user_auth_error'))
    dispatch(UserActions.login({
      emailAddress: this.state.emailAddress,
      password: this.state.password
    }))
  }

  render() {
    const introText = `
      Publications includes all the tools to create documents with shapes and text.
      Shapes can have different colors, borders, opacity and size.
      Export your documents to vector PDFs that can be shared with anyone.
    `

    return <div className="index-view">
      <div className="index-container">
        <div className="index-logo"></div>
        <p className="index-intro-text">{ introText }</p>
        <LoginForm
          errors={this.props.errors}
          emailAddress={this.state.emailAddress}
          password={this.state.password}
          formSubmitted={this.logInFormSubmitted}
          formValueChanged={this.loginFormValueChanged}
          createTestDriveAccount={this.createTestDriveAccount} />
        <LoginAboutBox />
      </div>
    </div>
  }
}

export default connect(state => ({
  ...state.user, ...state.errors
}))(Login)
