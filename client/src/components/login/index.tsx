import React from "react";
import styled from "styled-components";
import Button from "../ui/framed-button";
import { Formik, FormikProps } from "formik";
import FormInput from "../ui/form-input";
import {
  apiRequest,
  getUserFromSpringResponse,
  RestMethod,
  SpringAuthResponse,
} from "../../util/api";
import to from "await-to-js";
import { ModalHeader } from "../ui/text";
import { ModalContent } from "../modal";
import { ModalButtonContainer } from "../ui/button-container";
import { PubUser } from "../../types/pub-objects";

const LoginModalContent = styled(ModalContent)`
  width: 400px;
`;

const Form = styled.form`
  padding: 0 1em;
`;

interface Props {
  onLogin(user: PubUser): void;
  onDismiss(): void;
}

interface LoginFormValues {
  emailAddress: string;
  password: string;
}

interface LoginFormErrors {
  emailAddress?: boolean;
  password?: boolean;
}

export default class extends React.Component<Props> {
  state = {
    errorLoggingIn: false,
  };

  login = async payload => {
    const [err, response] = await to<SpringAuthResponse | null>(
      apiRequest(RestMethod.POST, "users/login", payload)
    );
    if (err || !response) {
      this.setState({ errorLoggingIn: true });
      return;
    }
    const user = getUserFromSpringResponse(response);
    if (!user) {
      this.setState({ errorLoggingIn: true });
      return;
    }
    this.props.onLogin(user);
    this.props.onDismiss();
    this.setState({ errorLoggingIn: false });
  };

  validateForm = values => {
    const errors: LoginFormErrors = {};
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
        onSubmit={(values: LoginFormValues, { setSubmitting }) => {
          this.login(values);
          setSubmitting(false);
        }}
        render={({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
        }: FormikProps<LoginFormValues>) => (
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
