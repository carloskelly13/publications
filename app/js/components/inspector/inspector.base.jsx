import React, {Component, PropTypes} from 'react';

import InspectorDocument from './inspector.document';
import InspectorShape from './inspector.shape';

export default class InspectorBase extends Component {
  constructor(props, context) {
    super(props);
    this.state = {theme: 'light'};
  }

  render() {
    let
      currentPane = '',
      {
        doc,
        selectedShape,
        showInspector,
        updateDocument,
        updateShape
      } = this.props,
      documentLoaded = !_.isEmpty(doc.get('_id'));

    if (documentLoaded && !!selectedShape) {
      currentPane = (
        <InspectorShape
          shape={selectedShape}
          theme={this.state.theme}
          updateShape={updateShape}
          />
      );

    } else if (documentLoaded & !selectedShape) {
      currentPane = (
        <InspectorDocument
          doc={doc}
          theme={this.state.theme}
          updateDocument={updateDocument}
          />
      );
    }

    return (
      <div className={`inspector-container ${showInspector ? 'inspector-container-visible' : ''} ${this.state.theme}`}>
        {currentPane}
      </div>
    );
  }
}
