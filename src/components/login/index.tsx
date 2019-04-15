import React from "react";
import styled from "styled-components";
import Button from "../ui/framed-button";
import { Formik, FormikProps } from "formik";
import FormInput from "../ui/form-input";
import { ModalHeader } from "../ui/text";
import { ModalContent } from "../modal";
import { ModalButtonContainer } from "../ui/button-container";
import {
  LoginMutation,
  LoginMutationResponse,
  RefetchCurrentUser,
} from "../../types/data";
import { StateContext } from "../../contexts/app-state";
import { OperationResult } from "urql";

const LoginModalContent = styled(ModalContent)`
  width: 400px;
`;

const Form = styled.form`
  padding: 0 1em;
`;

interface Props {
  refetchCurrentUser: RefetchCurrentUser;
  login(opts: LoginMutation): Promise<OperationResult<LoginMutationResponse>>;
  onDismiss(): void;
}

interface LoginFormValues {
  name: string;
  password: string;
}

interface LoginFormErrors {
  name?: boolean;
  password?: boolean;
}

export class LoginDialog extends React.Component<Props> {
  state = {
    errorLoggingIn: false,
  };

  login = async (payload: LoginFormValues) => {
    const {
      data: { login },
    } = await this.props.login(payload);
    if (login && login.token) {
      window.localStorage.setItem("authorization_token", login.token);
    } else {
      this.setState({ errorLoggingIn: false });
    }
    this.props.onDismiss();
    return this.props.refetchCurrentUser({ skipCache: true });
  };

  validateForm = values => {
    const errors: LoginFormErrors = {};
    if (!values.name) {
      errors.name = true;
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
          name: "",
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
                name="name"
                autoComplete="email"
                onChange={handleChange}
                value={values.name}
              />
              <FormInput
                placeholder="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                onChange={handleChange}
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

export default () => (
  <StateContext.Consumer>
    {({ actions }) => (
      <LoginDialog
        login={actions.login}
        refetchCurrentUser={actions.refetchCurrentUser}
        onDismiss={() => actions.setLoginModalVisible(false)}
      />
    )}
  </StateContext.Consumer>
);
