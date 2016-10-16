import React, {Component, PropTypes, addons} from 'react'
import {autobind} from 'core-decorators'
import InputText from '../ui/input.text'
import InputFloat from 'components/ui/input.float'

export default class NewDocumentModal extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      form: {
        name: 'New Document',
        width: 6.0,
        height: 4.0
      }
    }
  }

  render() {
    if (this.props.isOpen) {
      return <div className="modal-cover">
        <div className="modal modal-new-document">
          <div className="modal-content">
            <div className="modal-header">
              <h1>Create New Document</h1>
              <h3>Specify the name, width and height of your new document.</h3>
            </div>
            <div className="modal-inner-content">
              <form onSubmit={this.handleSubmit}>
                <InputText
                  displayName="Name"
                  name="name"
                  style="full"
                  validator='isLength'
                  validatorOptions={1}
                  value={this.state.form.name}
                  valueChanged={this.formValueChanged} />
                <InputFloat
                  displayName="Width"
                  property="width"
                  style="half left"
                  unit="in"
                  validatorOptions={{step: 0.05, min: -2.0, max: 64.0}}
                  value={parseFloat(this.state.form.width)}
                  valueChanged={this.formValueChanged} />
                <InputFloat
                  displayName="Height"
                  property="height"
                  style="half right"
                  unit="in"
                  validatorOptions={{step: 0.05, min: -2.0, max: 64.0}}
                  value={parseFloat(this.state.form.height)}
                  valueChanged={this.formValueChanged} />
                <div className="modal-form-buttons">
                  <button className="btn" type="submit">
                    Create
                  </button>
                  <button className="btn" type="button" onClick={this.props.toggleNewDocumentModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    } else {
      return <div/>
    }
  }

  @autobind
  formValueChanged(event) {
    this.state.form[event.target.name] = event.target.value
    this.setState({form: this.state.form})
  }

  @autobind
  handleSubmit(event) {
    event.preventDefault()

    const width = parseFloat(this.state.form.width)
    const height = parseFloat(this.state.form.height)

    this.props.createNewDocument({
      name: this.state.form.name,
      width: width,
      height: height,
      shapes: []
    })
  }
}
