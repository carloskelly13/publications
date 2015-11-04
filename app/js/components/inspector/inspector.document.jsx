import React, {Component, PropTypes} from 'react';

import InspectorDocumentProperties from './inspector.document.properties';
import InspectorDocumentLayers from './inspector.document.layers';

export default class InspectorDocument extends Component {
  render() {

    return (
      <div className="inspector-pane inspector-pane-document">
        <InspectorDocumentProperties
          inputValueChanged={e => this.inputValueChanged(e)}
          {...this.props} />
        <InspectorDocumentLayers
          inputValueChanged={e => this.inputValueChanged(e)}
          {...this.props} />
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
