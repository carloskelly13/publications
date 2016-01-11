import React, {Component, PropTypes, addons} from 'react'
import InputText from '../ui/input.text'

export default class UserAccountModal extends Component {
  constructor() {
    super(...arguments)
    this.state = {name: '', password: '', currrentPassword: '', temporary: false}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      temporary: nextProps.isTemporaryUser,
      name: nextProps.isTemporaryUser ? '' : nextProps.userName
    })
  }

  render() {
    const {temporary} = this.state

    const emailField = temporary ? <InputText
      displayName="Email Address"
      name="name"
      theme="light"
      validator='isLength'
      validatorOptions={1}
      value={this.state.name}
      valueChanged={::this.formValueChanged}
    /> : null

    const currentPasswordField = !temporary ? <InputText
      displayName="Current Password"
      name="currentPassword"
      theme="light"
      value={this.state.currentPassword}
      valueChanged={::this.formValueChanged}
    /> : null

    const headerText = temporary ? 'Create Account' : 'Change Password'
    const descriptionText = temporary ? 'Create a free Publications account.' : `Update password for ${this.state.name}.`

    if (this.props.isOpen) {
      return (
        <div className="modal-cover">
          <div className="modal modal-new-document">
            <div className="modal-content">
              <div className="modal-header">
                <h1>{headerText}</h1>
                <h3>{descriptionText}</h3>
              </div>
              <div className="modal-inner-content">
                <form onSubmit={::this.handleSubmit}>
                  {emailField}
                  {currentPasswordField}
                  <InputText
                    displayName="New Password"
                    name="password"
                    theme="light"
                    value={this.state.password}
                    valueChanged={::this.formValueChanged}
                  />
                  <div className="modal-form-buttons">
                    <button className="button button-full" type="submit">
                      {temporary ? 'Create Account' : 'Update'}
                    </button>
                    <button className="button button-full" type="button" onClick={::this.dismiss}>
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
      return (<div/>)
    }
  }

  formValueChanged(event) {
    this.state[event.target.name] = event.target.value
    this.setState(this.state)
  }

  dismiss() {
    let clearState = {currentPassword: '', password: ''}

    if (this.state.temporary) {
      clearState.name = ''
    }

    this.setState(clearState)
    this.props.toggleModal()
  }

  handleSubmit(event) {
    event.preventDefault()

    const {currentPassword, password} = this.state
    let patchData = {password}

    if (this.state.temporary) {
      patchData.name = this.state.name
      patchData.currentPassword = 'password'
      patchData.temporary = false
    } else {
      patchData.currentPassword = currentPassword
    }
  }
}
