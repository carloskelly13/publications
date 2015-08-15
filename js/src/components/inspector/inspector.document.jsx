import React, {Component, PropTypes} from 'react';

import InputText from '../ui/input.text';

export default class InspectorDocument extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let {
      doc,
      theme
    } = this.props;

    return (
      <div className="inspector-pane inspector-pane-document">
        <div className="input-container input-container-full">
          <InputText
            displayName="Name"
            name="name"
            theme={theme}
            validator='isLength'
            validatorOptions={1}
            value={doc.name}
            valueChanged={e => this.inputValueChanged(e)} />
        </div>
        <div className="input-container input-container-half">
          <InputText
            displayName="Width"
            name="width"
            theme={theme}
            type="number"
            unit="in"
            validator='isFloat'
            validatorOptions={{step: 0.25, min: 1.0, max: 64.0}}
            value={doc.width}
            valueChanged={e => this.inputValueChanged(e)} />
        </div>
        <div className="input-container input-container-half">
          <InputText
            displayName="Height"
            name="height"
            theme={theme}
            type="number"
            unit="in"
            validator='isFloat'
            validatorOptions={{step: 0.25, min: 1.0, max: 64.0}}
            value={doc.height}
            valueChanged={e => this.inputValueChanged(e)} />
        </div>
      </div>
    );
  }

  inputValueChanged(event) {
    let {
      doc,
      updateDocument
    } = this.props;

    doc[event.target.name] = event.target.value;
    updateDocument(doc);
  }
}
