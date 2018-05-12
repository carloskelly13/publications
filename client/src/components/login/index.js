import React from "react";
import styled from "styled-components";
import Button from "../ui/framed-button";
import { Formik } from "formik";
import FormInput from "../ui/form-input";
import Api, { getUserFromAuth } from "../../util/api";
import to from "await-to-js";
import { ModalHeader } from "../ui/text";
import { ModalContent } from "../modal";
import { ModalButtonContainer } from "../ui/button-container";
import type { PubUser } from "../../util/types";

const LoginModalContent = styled(ModalContent)`
  width: 400px;
`;

const Form = styled.form`
  padding: 0 1em;
`;

type Props = {
  onLogin: PubUser => void,
  onDismiss: () => void,
};
export default class extends React.Component<Props> {
  state = {
    errorLoggingIn: false,
  };

  login = async payload => {
    const [err, response] = await to(Api.POST("users/login", payload));
    if (err) {
      this.setState({ errorLoggingIn: true });
      return;
    }
    const user = getUserFromAuth(response);
    this.props.onLogin(user);
    this.props.onDismiss();
    this.setState({ errorLoggingIn: false });
  };

  validateForm = values => {
    const errors = {};
    if (!values.emailAddress) {
      errors.emailAddress = true;
    }
    if (!values.password) {
      errors.password = true;
    }
    return errors;
  };

  render() {
    return (
      <Formik
        initialValues={{
          emailAddress: "",
          password: "",
        }}
        validate={this.validateForm}
        onSubmit={(values, { setSubmitting }) => {
          this.login(values);
          setSubmitting(false);
        }}
        render={({ values, handleChange, handleSubmit, isSubmitting }) => (
          <LoginModalContent>
            <ModalHeader>Log In</ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormInput
                placeholder="Email Address"
                type="email"
                name="emailAddress"
                autoComplete="email"
                onChange={handleChange}
                marginBottom="1em"
                value={values.emailAddress}
              />
              <FormInput
                placeholder="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                onChange={handleChange}
                marginBottom="1em"
                value={values.password}
              />
              <ModalButtonContainer>
                <Button type="submit" marginRight disabled={isSubmitting}>
                  Log In
                </Button>
                <Button type="button" onClick={this.props.onDismiss}>
                  Close
                </Button>
              </ModalButtonContainer>
            </Form>
          </LoginModalContent>
        )}
      />
    );
  }
}
