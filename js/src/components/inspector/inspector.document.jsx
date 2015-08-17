import React, {Component, PropTypes} from 'react';

import InspectorDocumentProperties from './inspector.document.properties';

export default class InspectorDocument extends Component {
  render() {
    let {
      doc,
      theme
    } = this.props;

    return (
      <div className="inspector-pane inspector-pane-document">
        <InspectorDocumentProperties
          inputValueChanged={e => this.inputValueChanged(e)}
          doc={doc}
          theme={theme} />
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
