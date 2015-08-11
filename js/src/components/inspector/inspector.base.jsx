import React, {Component, PropTypes} from 'react';

import InspectorDocument from './inspector.document';

export default class InspectorBase extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let
      currentPane = '',
      showInspector = this.props.showInspector;

    if (!!this.props.selectedShape) {

    } else {
      currentPane = (
        <InspectorDocument
          />
      );
    }

    return (
      <div className={`inspector-container ${showInspector ? 'inspector-container-visible' : ''}`}>
        {currentPane}
      </div>
    );
  }
}
