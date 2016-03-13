import React, { Component } from 'react'
import uuid from 'uuid4'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { autobind } from 'core-decorators'
import * as UserActions from 'actions/user'
import * as ErrorsActions from 'actions/errors'

import InputText from 'components/ui/input.text'

export class Login extends Component {
  constructor() {
    super(...arguments)
    this.state = {emailAddress: '', password: ''}
  }

  componentDidMount() {
    this.props.getUser()
  }

  @autobind
  createTestDriveAccount() {
    this.props.createNewUser({
      emailAddress: `${uuid()}@publicationsapp.com`,
      password: 'password',
      temporary: true
    })
  }

  componentWillReceiveProps(nextProps) {
    const {isAuthenticated, history, errors} = nextProps
    this.setState({userAuthError: errors.indexOf('user_auth_error') !== -1})

    if (isAuthenticated) {
      history.push('/documents')
    }
  }

  @autobind
  loginFormValueChanged(event) {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  @autobind
  logInFormSubmitted(event) {
    event.preventDefault()

    this.props.removeError('user_auth_error')

    this.props.login({
      emailAddress: this.state.emailAddress,
      password: this.state.password
    })
  }

  render() {
    const introText = `
      Publications includes all the tools to create documents with shapes and text.
      Shapes can have different colors, borders, opacity and size.
      Export your documents to vector PDFs that can be shared with anyone.
    `

    const errorMessage = this.state.userAuthError ?
      <div className="error-msg">The password or email address was incorrect. Please try again.</div> : null

    const loginForm = <form
        className=""
        onSubmit={this.logInFormSubmitted}>
        {errorMessage}
        <div>
          <InputText
            placeholder="Email Address"
            name="emailAddress"
            style="half left"
            type="text"
            value={this.state.emailAddress}
            valueChanged={this.loginFormValueChanged} />
          <InputText
            placeholder="Password"
            name="password"
            style="half right"
            type="password"
            value={this.state.password}
            valueChanged={this.loginFormValueChanged} />
        </div>
        <div className="buttons">
          <button
            type="submit"
            className="btn big">
            Log In
          </button>
          <button
            type="button"
            className="button test-drive-btn"
            onClick={this.createTestDriveAccount}
            role="button">
            or test drive Publications without an account
          </button>
        </div>
      </form>

    return <div className="index-view">
      <div className="index-container">
        <div className="index-logo"></div>
        <p className="index-intro-text">{introText}</p>
        {loginForm}
      </div>
    </div>
  }
}

const mapStateToProps = state => Object.assign({},
  state.user, state.errors)

const mapDispatchToProps = dispatch => bindActionCreators(
  Object.assign({}, UserActions, ErrorsActions),
  dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)
