import React from "react";
import { Formik } from "formik";
import { FormInput } from "../ui/pub-input";
import Button from "../ui/framed-button";
import styled from "styled-components";
import { AppColors } from "../../util/constants";

const Form = styled.form`
  width: 300px;
  margin: 3em auto 1em;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 0.25em;
`;

const Message = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 1.5em;
`;

const Flag = styled.span`
  border: 2px solid ${AppColors.DarkGray};
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  padding: 1px 4px;
  margin: 0 4px;
`;

const validateForm = values => {
  const errors = {};
  if (!values.emailAddress) {
    errors.emailAddress = true;
  }
  if (!values.password) {
    errors.password = true;
  }
  return errors;
};

type Props = {
  handleOnSubmit: Function,
};
export default (props: Props) => (
  <Formik
    initialValues={{
      emailAddress: "",
      password: "",
    }}
    validate={validateForm}
    onSubmit={(values, { setSubmitting }) => {
      props.handleOnSubmit(values);
      setSubmitting(false);
    }}
    render={({ values, handleChange, handleSubmit, isSubmitting }) => (
      <Form onSubmit={handleSubmit}>
        <Title>
          Publications <Flag>Beta</Flag>
        </Title>
        <Message>A web app for print design and layout.</Message>
        <FormInput
          displayName="Email Address"
          type="email"
          name="emailAddress"
          autoComplete="email"
          onChange={handleChange}
          marginBottom="1em"
          value={values.emailAddress}
        />
        <FormInput
          displayName="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          onChange={handleChange}
          marginBottom="1em"
          value={values.password}
        />
        <Button type="submit" disabled={isSubmitting}>
          Log In
        </Button>
      </Form>
    )}
  />
);
