// @flow
import React from "react";
import { Formik } from "formik";

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
    onSubmit={values => props.handleOnSubmit(values)}
    render={({ values, handleChange, handleSubmit, isSubmitting }) => (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="emailAddress"
          onChange={handleChange}
          value={values.emailAddress}
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={values.password}
        />
        <button type="submit" disabled={isSubmitting}>
          Log In
        </button>
      </form>
    )}
  />
);
