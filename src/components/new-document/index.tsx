import React from "react";
import styled from "styled-components";
import Button from "../ui/framed-button";
import FormInput from "../ui/form-input";
import { ModalButtonContainer } from "../ui/button-container";
import { ModalHeader } from "../ui/text";
import { ModalContent } from "../modal";
import { Formik, FormikProps } from "formik";
import { PubNewDocument } from "../../types/pub-objects";
import { StateContext } from "../../contexts";

const NewDocumentContainer = styled(ModalContent)`
  width: 400px;
`;

const Form = styled.form`
  padding: 0 1em;
`;

interface Props {
  onDismiss: () => void;
  didCreateDocument: (
    sender: {
      name: string;
      width: number;
      height: number;
    }
  ) => Promise<void>;
}

interface State {
  name: string;
  width: number;
  height: number;
  formValid: boolean;
}

export class NewDocumentDialog extends React.Component<Props, State> {
  state = {
    name: "",
    width: 8.5,
    height: 11.0,
    formValid: true,
  };

  validateForm = () => {
    const errors = {};
    return errors;
  };

  createNewDocument = async (sender: {
    name: string;
    width: number;
    height: number;
  }) => {
    await this.props.didCreateDocument(sender);
    this.props.onDismiss();
  };

  render() {
    const { onDismiss } = this.props;
    return (
      <NewDocumentContainer>
        <ModalHeader>Create New Document</ModalHeader>
        <Formik
          initialValues={{
            name: "",
            width: 8.5,
            height: 11,
          }}
          validate={this.validateForm}
          onSubmit={(values: PubNewDocument) => this.createNewDocument(values)}
          render={({
            values,
            handleChange,
            handleSubmit,
          }: FormikProps<PubNewDocument>) => (
            <Form onSubmit={handleSubmit}>
              <FormInput
                placeholder="Document Name"
                name="name"
                onChange={handleChange}
                value={values.name}
              />
              <FormInput
                placeholder="Width"
                name="width"
                onChange={handleChange}
                value={values.width}
              />
              <FormInput
                placeholder="Height"
                name="height"
                onChange={handleChange}
                value={values.height}
              />
              <ModalButtonContainer>
                <Button marginRight type="submit">
                  Create Document
                </Button>
                <Button type="button" onClick={onDismiss}>
                  Close
                </Button>
              </ModalButtonContainer>
            </Form>
          )}
        />
      </NewDocumentContainer>
    );
  }
}

export default () => (
  <StateContext.Consumer>
    {({ actions }) => (
      <NewDocumentDialog
        onDismiss={() => actions.setNewDocumentModalVisible(false)}
        didCreateDocument={actions.handleCreateNewDocument}
      />
    )}
  </StateContext.Consumer>
);
