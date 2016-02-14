import React, {Component, PropTypes, addons} from 'react'
import InputText from '../ui/input.text'

export default class UserAccountModal extends Component {
  constructor() {
    super(...arguments)
    this.state = {emailAddress: '', password: '', temporary: false}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      temporary: nextProps.isTemporaryUser,
      emailAddress: nextProps.isTemporaryUser ? '' : nextProps.userName
    })
  }

  formValueChanged(event) {
    this.state[event.target.name] = event.target.value
    this.setState(this.state)
  }

  dismiss() {
    let clearState = {password: ''}

    if (this.state.temporary) {
      clearState.emailAddress = ''
    }

    this.setState(clearState)
    this.props.removeError('user_auth_error')
    this.props.toggleModal()
  }

  handleSubmit(event) {
    event.preventDefault()
    const {emailAddress, password} = this.state

    this.props.removeError('user_auth_error')

    this.props.updateUser({
      id: this.props.userId,
      emailAddress,
      password,
      temporary: false
    }, () => this.dismiss())
  }

  render() {
    const {temporary} = this.state

    const emailField = temporary ? <InputText
      displayName="Email Address"
      name="emailAddress"
      theme="light"
      validator='isLength'
      validatorOptions={1}
      value={this.state.emailAddress}
      valueChanged={::this.formValueChanged} /> : null

    const headerText = temporary ? 'Create Account' : 'Change Password'
    const {isPatchingUser, errors} = this.props
    const failedUpdate = errors.indexOf('user_update_error') !== -1

    const descriptionText = (temporary, failedUpdate, name = null) => {
      if (temporary && !failedUpdate) {
        return 'Create a free Publications account'
      } else if (temporary && failedUpdate) {
        return 'There was an error creating your account. Verify the email is not already in use and try again.'
      } else if (!temporary && !failedUpdate) {
        return `Update password for ${name}.`
      } else if (!temporary && failedUpdate) {
        return 'There was an error updating your account. Verify the passwords are correct and try again.'
      }
    }

    if (this.props.isOpen) {
      return (
        <div className="modal-cover">
          <div className="modal modal-new-document">
            <div className="modal-content">
              <div className="modal-header">
                <h1>{headerText}</h1>
                <h3>{descriptionText(temporary, failedUpdate, this.state.emailAddress)}</h3>
              </div>
              <div className="modal-inner-content">
                <form onSubmit={::this.handleSubmit}>
                  {emailField}
                  <InputText
                    displayName="Password"
                    name="password"
                    theme="light"
                    type="password"
                    value={this.state.password}
                    valueChanged={::this.formValueChanged} />
                  <div className="modal-form-buttons">
                    <button disabled={isPatchingUser} className="button button-full" type="submit">
                      {temporary ? 'Create Account' : 'Update'}
                    </button>
                    <button disabled={isPatchingUser} className="button button-full" type="button" onClick={::this.dismiss}>
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <div/>
    }
  }
}
