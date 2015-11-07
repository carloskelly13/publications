import React, {Component, PropTypes} from 'react';

import InspectorDocumentProperties from './inspector.document.properties';
import InspectorDocumentLayers from './inspector.document.layers';

export default class InspectorDocument extends Component {
  render() {

    return (
      <div className="inspector-pane inspector-pane-document">
        <InspectorDocumentProperties
          inputValueChanged={::this.inputValueChanged}
          {...this.props} />
        <InspectorDocumentLayers
          inputValueChanged={::this.inputValueChanged}
          updateSelectedCanvasObject={this.props.updateSelectedCanvasObject}
          {...this.props} />
      </div>
    );
  }

  inputValueChanged(event) {
    let {
      doc,
      updateDocument
    } = this.props;

    updateDocument(doc.set(event.target.name, event.target.value));
  }
}
