import React from "react";
import { Formik } from "formik";
import styled from "styled-components";
import { ModalContent } from "../modal";
import { ModalHeader } from "../ui/text";
import FormInput from "../ui/form-input";
import { ModalButtonContainer } from "../ui/button-container";
import Button from "../ui/framed-button";

export type NewAccount = {
  emailAddress: string,
  password: string,
};

type Props = {
  onCreateAccount: (account: NewAccount) => void,
  onDismiss: () => void,
};

const NewAccountModalContent = styled(ModalContent)`
  width: 400px;
`;

const Form = styled.form`
  padding: 0 1em;
`;

const validateForm = values => {
  const errors = {};
  if (!values.emailAddress) {
    errors.emailAddress = "Email address is not valid";
  }
  if (!values.password) {
    errors.password = "Password is missing";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Password confirmation is missing";
  }
  if (values.password !== values.confirmPassword) {
    errors.password = "Passwords do not match.";
  }
  return errors;
};

export default (props: Props) => (
  <Formik
    initialValues={{
      emailAddress: "",
      password: "",
      confirmPassword: "",
    }}
    isInitialValid={false}
    onSubmit={(values, { setSubmitting }) => {
      props.onCreateAccount({
        emailAddress: values.emailAddress,
        password: values.password,
      });
      setSubmitting(false);
    }}
    validateForm={validateForm}
    render={({ values, handleChange, handleSubmit, isSubmitting }) => (
      <NewAccountModalContent>
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
            onChange={handleChange}
            marginBottom="1em"
            value={values.password}
          />
          <FormInput
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            marginBottom="1em"
            value={values.confirmPassword}
          />
          <ModalButtonContainer>
            <Button type="submit" marginRight disabled={isSubmitting}>
              Log In
            </Button>
            <Button type="button" onClick={props.onDismiss}>
              Close
            </Button>
          </ModalButtonContainer>
        </Form>
      </NewAccountModalContent>
    )}
  />
);
