import React, { Component } from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { newDocument as newDocumentAction } from "../../state/actions/document"
import { hideModal as hideModalAction } from "../../state/actions/app-ui"
import Button from "../ui/toolbar-button"
import { ModalButtonContainer } from "../ui/button-container"
import { Header, Message } from "../ui/text"
import { ModalContent } from "../modal"
import { FormInput, FormGroup } from "../ui/pub-input"
import { validateForm } from "../../util/validators"

const NewDocumentContainer = styled(ModalContent)`
  width: 400px;
`

class NewDocumentView extends Component {
  state = {
    name: "New Document",
    width: 8.5,
    height: 11.0,
    formValid: true
  }

  handleCreateButton = () => {
    const { width, height, name } = this.state
    const formValid = validateForm([
      { value: name, type: "name" },
      { value: height, type: "size" },
      { value: width, type: "size" }
    ])

    this.setState({ formValid })

    if (formValid) {
      this.props.newDocument({ name, width, height, shapes: [] })
    }
  }

  handleInputChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value })
  }

  render() {
    return (
      <NewDocumentContainer>
        <Header>
          Create New Document
        </Header>
        <Message>
          Specify the name, width and height of your new document.
        </Message>
        <FormGroup>
          <FormInput
            name="name"
            onChange={this.handleInputChange}
            value={this.state.name}
            displayName="Name"
          />
        </FormGroup>
        <FormGroup>
          <FormInput
            name="height"
            label="inches"
            onChange={this.handleInputChange}
            value={this.state.height}
            displayName="Height"
          />
          <FormInput
            name="width"
            label="inches"
            onChange={this.handleInputChange}
            value={this.state.width}
            displayName="Width"
          />
        </FormGroup>
        <ModalButtonContainer>
          <Button
            marginRight
            onClick={this.handleCreateButton}
          >
            Create Document
          </Button>
          <Button
            onClick={this.props.hideModal}
          >
            Close
          </Button>
        </ModalButtonContainer>
      </NewDocumentContainer>
    )
  }
}

const mapDispatchToProps = {
  newDocument: newDocumentAction,
  hideModal: hideModalAction
}

export default connect(() => ({}), mapDispatchToProps)(NewDocumentView)
