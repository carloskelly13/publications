import React from "react";
import styled from "styled-components";
import flowRight from "lodash/fp/flowRight";
import Button from "../ui/framed-button";
import FormInput from "../ui/form-input";
import { ModalButtonContainer } from "../ui/button-container";
import { ModalHeader } from "../ui/text";
import { ModalContent } from "../modal";
import { Formik, FormikProps } from "formik";
import { PubNewDocument } from "../../types/pub-objects";
import { StateContext } from "../../contexts/documents-provider";
import { navigate } from "@reach/router";
import { addEditorStateToDocument } from "../../util/documents";

const NewDocumentContainer = styled(ModalContent)`
  width: 400px;
`;

const Form = styled.form`
  padding: 0 1em;
`;

interface NewDocument {
  name: string;
  width: number;
  height: number;
}

const NewDocumentForm: React.FC = () => {
  const { actions, user, userFetching } = React.useContext(StateContext);

  const validateForm = React.useCallback(() => {}, []);
  const hasValidUserAuthenticated = !userFetching && !!user;

  const handleCreateNewDocumentSubmit = React.useCallback(
    async (sender: NewDocument) => {
      const newDocumentBase = {
        height: parseFloat(sender.height.toString()),
        name: sender.name,
        width: parseFloat(sender.width.toString()),
      };
      if (hasValidUserAuthenticated) {
        actions.setNewDocumentModalVisible(false);
        try {
          const doc = await actions.handleCreateNewDocument(newDocumentBase);
          return navigate(`/edit/${doc.id}`);
        } catch (e) {
          // TODO: Error Handling
        }
      } else {
        const constructedDocument = {
          name: newDocumentBase.name,
          pages: [
            {
              shapes: [],
              height: newDocumentBase.height,
              width: newDocumentBase.width,
              pageNumber: 1,
            },
          ],
        };
        flowRight(
          actions.setCurrentDocument,
          addEditorStateToDocument
        )(constructedDocument);
        actions.setNewDocumentModalVisible(false);
        navigate("/edit/0");
      }
    },
    [actions, hasValidUserAuthenticated]
  );

  return (
    <NewDocumentContainer>
      <ModalHeader>Create New Document</ModalHeader>
      <Formik
        initialValues={{
          name: "",
          width: 8.5,
          height: 11,
        }}
        validate={validateForm}
        onSubmit={handleCreateNewDocumentSubmit}
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
              <Button
                type="button"
                onClick={() => actions.setNewDocumentModalVisible(false)}
              >
                Close
              </Button>
            </ModalButtonContainer>
          </Form>
        )}
      />
    </NewDocumentContainer>
  );
};

export default NewDocumentForm;
