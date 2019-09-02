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
import UserBadgeIcon from "../ui/icons/user-badge";

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

const LoginForm: React.FC = () => {
  const [errorLoggingIn, setErrorLoggingIn] = React.useState(false);
  const { actions } = React.useContext(StateContext);

  const login = React.useCallback(
    async (payload: LoginFormValues) => {
      const {
        data: { login },
      } = await actions.login(payload);
      if (login && login.token) {
        setErrorLoggingIn(false);
        window.localStorage.setItem("authorization_token", login.token);
      } else {
        setErrorLoggingIn(true);
      }
      actions.setLoginModalVisible(false);
      return Promise.all([
        actions.refetchCurrentUser({ skipCache: true }),
        actions.refreshDocsData({ skipCache: true }),
      ]);
    },
    [actions]
  );

  const validateForm = React.useCallback(values => {
    const errors: LoginFormErrors = {};
    if (!values.name) {
      errors.name = true;
    }
    if (!values.password) {
      errors.password = true;
    }
    return errors;
  }, []);

  return (
    <Formik
      initialValues={{
        name: "",
        password: "",
      }}
      validate={validateForm}
      onSubmit={(values: LoginFormValues, { setSubmitting }) => {
        login(values);
        setSubmitting(false);
      }}
      render={({
        values,
        handleChange,
        handleSubmit,
        isSubmitting,
      }: FormikProps<LoginFormValues>) => (
        <LoginModalContent>
          <ModalHeader>
            <UserBadgeIcon size={24} />
            <span>Log In</span>
          </ModalHeader>
          {errorLoggingIn && <div>oops!</div>}
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
              <Button
                type="button"
                onClick={() => actions.setLoginModalVisible(false)}
              >
                Close
              </Button>
            </ModalButtonContainer>
          </Form>
        </LoginModalContent>
      )}
    />
  );
};

export default LoginForm;
