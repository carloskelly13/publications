// @flow
import React from "react";
import styled from "styled-components";
import Button from "../ui/framed-button";
import { ModalButtonContainer } from "../ui/button-container";
import { Header, Message } from "../ui/text";
import { ModalContent } from "../modal";
import { FormInput, FormGroup, RadioFormGroup } from "../ui/pub-input";
import { Formik } from "formik";

const NewDocumentContainer = styled(ModalContent)`
  width: 400px;
`;

type Props = {
  onDismiss: () => void,
  didCreateDocument: (sender: {
    name: string,
    orientation: string,
  }) => Promise<void>,
};

type State = {
  name: string,
  width: number,
  height: number,
  formValid: boolean,
};

export default class NewDocumentDialog extends React.Component<Props, State> {
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

  createNewDocument = async (sender: { name: string, orientation: string }) => {
    this.props.didCreateDocument(sender);
    this.props.onDismiss();
  };

  render() {
    const { onDismiss } = this.props;
    return (
      <NewDocumentContainer>
        <Header>Create New Document</Header>
        <Message>
          Specify the name and orientation of your new document.
        </Message>
        <Formik
          initialValues={{
            name: "New Document",
            orientation: "portrait",
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
                />
              </FormGroup>
              <RadioFormGroup>
                <input
                  name="orientation"
                  type="radio"
                  value="portrait"
                  id="orientation-portrait"
                  onChange={handleChange}
                  checked={values.orientation === "portrait"}
                />
                <label htmlFor="orientation-portrait">
                  Portrait (8.5&#8221; &#215; 11&#8221;)
                </label>
              </RadioFormGroup>
              <RadioFormGroup>
                <input
                  name="orientation"
                  type="radio"
                  value="landscape"
                  id="orientation-landscape"
                  onChange={handleChange}
                  checked={values.orientation === "landscape"}
                />
                <label htmlFor="orientation-landscape">
                  Landscape (11&#8221; &#215; 8.5&#8221;)
                </label>
              </RadioFormGroup>
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
