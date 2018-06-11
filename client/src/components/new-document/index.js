// @flow
import React from "react";
import styled from "styled-components";
import Button from "../ui/framed-button";
import FormInput from "../ui/form-input";
import { ModalButtonContainer } from "../ui/button-container";
import { ModalHeader } from "../ui/text";
import { ModalContent } from "../modal";
import { Formik } from "formik";
import { Colors } from "../../util/constants";

const NewDocumentContainer = styled(ModalContent)`
  width: 400px;
`;

const Form = styled.form`
  padding: 0 1em;
`;

const PageRadioButton = styled.input`
  &:checked,
  &:not(:checked) {
    position: absolute;
    left: -9999px;
  }
  &:not(:checked) + label {
    background-color: ${Colors.NewDocument.RadioBackground};
    border: 1px solid ${Colors.NewDocument.RadioBorder};
    box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.1);
    color: ${Colors.NewDocument.RadioText};
  }
  &:checked + label {
    border: 1px solid ${Colors.NewDocument.RadioSelectedBorder};
    box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.2),
      0 0 0 2px ${Colors.NewDocument.RadioSelectedOutline};
    background-color: ${Colors.NewDocument.RadioSelectedBackground};
    color: ${Colors.NewDocument.RadioSelectedText};
  }
`;

const PageRadioContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const PageLabel = styled.label`
  display: inline-block;
  border-radius: 2px;
`;

const PortraitLabel = styled(PageLabel)`
  width: 85px;
  height: 110px;
  margin-right: 1em;
`;

const LandscapeLabel = styled(PageLabel)`
  width: 110px;
  height: 85px;
`;

const PageLabelContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  height: inherit;
`;

const PageLabelTitle = styled.div`
  font-weight: 600;
`;

const PageLabelDimensions = styled.div`
  font-size: 0.85em;
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
    name: "",
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
        <ModalHeader>Create New Document</ModalHeader>
        <Formik
          initialValues={{
            name: "",
            orientation: "portrait",
          }}
          validate={this.validateForm}
          onSubmit={values => this.createNewDocument(values)}
          render={({ values, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormInput
                placeholder="Document Name"
                name="name"
                onChange={handleChange}
                value={values.name}
              />
              <PageRadioContainer>
                <PageRadioButton
                  name="orientation"
                  type="radio"
                  value="portrait"
                  id="orientation-portrait"
                  onChange={handleChange}
                  checked={values.orientation === "portrait"}
                />
                <PortraitLabel htmlFor="orientation-portrait">
                  <PageLabelContent>
                    <PageLabelTitle>Portrait</PageLabelTitle>
                    <PageLabelDimensions>
                      8.5&#8221; &#215; 11&#8221;
                    </PageLabelDimensions>
                  </PageLabelContent>
                </PortraitLabel>
                <PageRadioButton
                  name="orientation"
                  type="radio"
                  value="landscape"
                  id="orientation-landscape"
                  onChange={handleChange}
                  checked={values.orientation === "landscape"}
                />
                <LandscapeLabel htmlFor="orientation-landscape">
                  <PageLabelContent>
                    <PageLabelTitle>Landscape</PageLabelTitle>
                    <PageLabelDimensions>
                      11&#8221; &#215; 8.5&#8221;
                    </PageLabelDimensions>
                  </PageLabelContent>
                </LandscapeLabel>
              </PageRadioContainer>
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
