import React from "react";
import { Formik, FormikProps } from "formik";
import styled from "styled-components";
import { ModalContent } from "../modal";
import { ModalHeader } from "../ui/text";
import FormInput from "../ui/form-input";
import { ModalButtonContainer } from "../ui/button-container";
import Button from "../ui/framed-button";
import * as yup from "yup";
import { Colors } from "../../util/constants";
import { CreateUserMutation, RefetchCurrentUser } from "../../types/data";
import { StateContext } from "../../contexts";

export interface NewAccount {
  name: string;
  password: string;
}

interface NewAccountFormValues extends NewAccount {
  confirmPassword: string;
}

interface Props {
  onCreateAccount: CreateUserMutation;
  refetchCurrentUser: RefetchCurrentUser;
  onDismiss(): void;
}

const NewAccountModalContent = styled(ModalContent)`
  width: 400px;
`;

const Form = styled.form`
  padding: 0 1em;
`;

const Error = styled.div`
  color: ${Colors.Forms.ErrorText};
  font-size: 12px;
  font-weight: 500;
  margin: 0 2px 5px;
`;

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .email("A valid email address is required.")
    .required("A valid email address is required."),
  password: yup.string().required("Password is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match.")
    .required("Password confirmation is required."),
});

class NewAccountForm extends React.Component<Props> {
  handleOnSubmit = async (
    values: NewAccountFormValues,
    formikProps: FormikProps<NewAccountFormValues>
  ) => {
    try {
      const { createUser } = await this.props.onCreateAccount({
        name: values.name,
        password: values.password,
      });
      window.localStorage.setItem("authorization_token", createUser.token);
      formikProps.setSubmitting(false);
      this.props.onDismiss();
      return this.props.refetchCurrentUser({ skipCache: true });
    } catch (e) {
      formikProps.setErrors({ name: e });
      return;
    }
  };

  render() {
    return (
      <Formik
        initialValues={{
          name: "",
          password: "",
          confirmPassword: "",
        }}
        isInitialValid={false}
        onSubmit={this.handleOnSubmit}
        validationSchema={validationSchema}
        render={({
          handleSubmit,
          handleChange,
          errors,
          values,
          isSubmitting,
        }: FormikProps<NewAccountFormValues>) => (
          <NewAccountModalContent>
            <ModalHeader>Create a new account</ModalHeader>
            <Form onSubmit={handleSubmit}>
              {errors.name && <Error>{errors.name}</Error>}
              <FormInput
                placeholder="Email Address"
                type="email"
                name="name"
                autoComplete="email"
                onChange={handleChange}
                value={values.name}
              />
              {errors.password && <Error>{errors.password}</Error>}
              <FormInput
                placeholder="Password"
                type="password"
                name="password"
                onChange={handleChange}
                value={values.password}
              />
              {errors.confirmPassword && (
                <Error>{errors.confirmPassword}</Error>
              )}
              <FormInput
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                value={values.confirmPassword}
              />
              <ModalButtonContainer>
                <Button type="submit" marginRight disabled={isSubmitting}>
                  Create Account
                </Button>
                <Button type="button" onClick={this.props.onDismiss}>
                  Close
                </Button>
              </ModalButtonContainer>
            </Form>
          </NewAccountModalContent>
        )}
      />
    );
  }
}

export default () => (
  <StateContext.Consumer>
    {({ actions }) => (
      <NewAccountForm
        onCreateAccount={actions.createUser}
        refetchCurrentUser={actions.refetchCurrentUser}
        onDismiss={actions.hideNewAccountModal}
      />
    )}
  </StateContext.Consumer>
);
