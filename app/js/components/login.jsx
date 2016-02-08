import React, {Component} from 'react'
import uuid from 'uuid4'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as UserActions from 'actions/user'
import * as ErrorsActions from 'actions/errors'

import InputText from './ui/input.text'

const mapStateToProps = state => Object.assign({}, state.user, {errors: state.errors})
const mapDispatchToProps = dispatch => bindActionCreators(Object.assign(
  {}, UserActions, ErrorsActions), dispatch)

export class Login extends Component {
  constructor() {
    super(...arguments)
    this.state = {emailAddress: '', password: ''}
  }

  componentDidMount() {
    this.props.getUser()
  }

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

  nameChanged(event) {
    this.setState({emailAddress: event.target.value});
  }

  passwordChanged(event) {
    this.setState({password: event.target.value});
  }

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
        onSubmit={::this.logInFormSubmitted}>
        {errorMessage}
        <div>
          <div className="input-container input-container-half">
            <InputText
              placeholder="Email address"
              name="emailAddress"
              theme="light"
              type="text"
              value={this.state.emailAddress}
              valueChanged={::this.nameChanged} />
          </div>
          <div className="input-container input-container-half">
            <InputText
              placeholder="Password"
              name="password"
              theme="light"
              type="password"
              value={this.state.password}
              valueChanged={::this.passwordChanged} />
          </div>
        </div>
        <button
          type="submit"
          className="button button-full button-full-width">
          Log In
        </button>
        <div className="buttons">
          <button
            className="button"
            onClick={::this.createTestDriveAccount}
            role="button">
            or test drive Publications without an account
          </button>
        </div>
      </form>

    return <div className="index-view">
      <div className="index-container">
        <div className="index-logo"></div>
        {loginForm}
      </div>
      {/*<p className="index-intro-text">{introText}</p>*/}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
