import React from "react"
import InputText from "components/ui/input.text"
import { FramedButton, TextButton } from "components/ui/pub-button"

export const LoginForm = ({
  errors,
  emailAddress,
  password,
  formValueChanged,
  formSubmitted,
  createTestDriveAccount
}) => {
  const errorMessage = errors.includes('user_auth_error') ?
    <div className="error-msg">The password or email address was incorrect. Please try again.</div> : undefined

  return <form
    onSubmit={formSubmitted}>
    { errorMessage }
    <div>
      <InputText
        placeholder="Email Address"
        name="emailAddress"
        style="half left"
        type="text"
        value={emailAddress}
        valueChanged={formValueChanged} />
      <InputText
        placeholder="Password"
        name="password"
        style="half right"
        type="password"
        value={password}
        valueChanged={formValueChanged} />
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
        onClick={createTestDriveAccount}
      >
        or test drive Publications without an account
      </TextButton>
    </div>
  </form>
}
