import React, {Component, PropTypes, addons} from 'react';
import _ from 'lodash';
import InputText from '../ui/input.text';

export default class NewDocumentModal extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      form: {
        name:  'New Document',
        width: 6.0,
        height: 4.0
      }
    };
  }

  render() {
    if (this.props.isOpen) {
      return (
        <div className="modal-cover">
          <div className="modal modal-new-document">
            <div className="modal-content">
              <div className="modal-header">
                <h1>Create New Document</h1>
                <h3>Specify the name, width and height of your new document.</h3>
              </div>
              <div className="modal-inner-content">
                <form onSubmit={::this.handleSubmit}>
                  <InputText
                    displayName="Name"
                    name="name"
                    theme="light"
                    validator='isLength'
                    validatorOptions={1}
                    value={this.state.form.name}
                    valueChanged={::this.formValueChanged} />
                  <div className="input-container input-container-half">
                    <InputText
                      displayName="Width"
                      name="width"
                      theme="light"
                      type="number"
                      unit="in"
                      validator='isFloat'
                      validatorOptions={{step: 0.05, min: 2.0, max: 64.0}}
                      value={this.state.form.width}
                      valueChanged={::this.formValueChanged} />
                  </div>
                  <div className="input-container input-container-half">
                    <InputText
                      displayName="Height"
                      name="height"
                      theme="light"
                      type="number"
                      unit="in"
                      validator='isFloat'
                      validatorOptions={{step: 0.05, min: 2.0, max: 64.0}}
                      value={this.state.form.height}
                      valueChanged={::this.formValueChanged} />
                  </div>
                  <div className="modal-form-buttons">
                    <button className="button" type="submit">
                      Create
                    </button>
                    <button className="button button-destructive" type="button" onClick={this.props.toggleNewDocumentModal}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (<div/>);
    }
  }

  formValueChanged(event) {
    this.state.form[event.target.name] = event.target.value;
    this.setState({form: this.state.form});
  }

  handleSubmit(event) {
    event.preventDefault();

    let
      width = parseFloat(this.state.form.width),
      height = parseFloat(this.state.form.height);

    this.props.createNewDocument({
      name: this.state.form.name,
      width: width,
      height: height
    });
  }
}
