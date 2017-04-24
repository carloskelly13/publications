import React, { Component } from "react"
import { PubInput } from "../ui/pub-input"
import { FramedButton, TextButton } from "../ui/pub-button"

class LoginForm extends Component {
  constructor() {
    super(...arguments)
    this.createTestDriveAccount = this.createTestDriveAccount.bind(this)
    this.submitLoginForm = this.submitLoginForm.bind(this)
    this.formValueChanged = this.formValueChanged.bind(this)
  }

  state = {
    emailAddress: "",
    password: ""
  }

  createTestDriveAccount() {

  }

  submitLoginForm(event) {
    event.preventDefault()
    const { emailAddress, password } = this.state
    this.props.authenticateUser({ emailAddress, password })
  }

  formValueChanged({ target }) {
    this.setState({ [target.name]: target.value })
  }

  render() {
    const { emailAddress, password } = this.state
    return (
      <form
        onSubmit={this.submitLoginForm}
      >
        <div>
          <PubInput
            placeholder="Email Address"
            name="emailAddress"
            type="text"
            value={emailAddress}
            onChange={this.formValueChanged}
          />
          <PubInput
            placeholder="Password"
            name="password"
            type="password"
            value={password}
            onChange={this.formValueChanged}
          />
        </div>
        <div className="buttons">
          <FramedButton
            big
            type="submit"
          >
            Log In
          </FramedButton>
          <TextButton
            type="button"
            onClick={this.createTestDriveAccount}
          >
            or test drive Publications without an account
          </TextButton>
        </div>
      </form>
    )
  }
}

export { LoginForm }
