// @flow
import React from "react";
import styled from "styled-components";
import Button from "../ui/framed-button";
import { ModalButtonContainer } from "../ui/button-container";
import { Header, Message } from "../ui/text";
import { ModalContent } from "../modal";
import { FormInput, FormGroup } from "../ui/pub-input";
import { Formik } from "formik";
import to from "await-to-js";
import Api from "../../util/api";

const NewDocumentContainer = styled(ModalContent)`
  width: 400px;
`;

type Props = {
  onDismiss: Function,
};
export default class NewDocumentDialog extends React.Component<Props> {
  state = {
    name: "New Document",
    width: 8.5,
    height: 11.0,
    formValid: true,
  };

  validateForm = () => {
    const errors = {};
    return errors;
  };

  createNewDocument = async documentAttrs => {
    const payload = { ...documentAttrs, shapes: [] };
    const [err] = await to(Api.POST("documents", payload));
    if (err) {
      return;
    }
    this.props.onDismiss();
  };

  render() {
    const { onDismiss } = this.props;
    return (
      <NewDocumentContainer>
        <Header>Create New Document</Header>
        <Message>
          Specify the name, width, and height of your new document.
        </Message>
        <Formik
          initialValues={{
            name: "New Document",
            width: 8.5,
            height: 11,
          }}
          validate={this.validateForm}
          onSubmit={values => this.createNewDocument(values)}
          render={({ values, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormInput
                  name="name"
                  onChange={handleChange}
                  value={values.name}
                  displayName="Name"
                />
              </FormGroup>
              <FormGroup>
                <FormInput
                  name="height"
                  label="inches"
                  onChange={handleChange}
                  value={values.height}
                  displayName="Height"
                />
                <FormInput
                  name="width"
                  label="inches"
                  onChange={handleChange}
                  value={values.width}
                  displayName="Width"
                />
              </FormGroup>
              <ModalButtonContainer>
                <Button marginRight type="submit">
                  Create Document
                </Button>
                <Button type="button" onClick={onDismiss}>
                  Close
                </Button>
              </ModalButtonContainer>
            </form>
          )}
        />
      </NewDocumentContainer>
    );
  }
}
