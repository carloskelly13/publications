import React, {Component, PropTypes} from 'react';

export default class InspectorDocumentLayers extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let {
      doc,
      inputValueChanged,
      theme
    } = this.props;

    return (
      <div className="inspector-content-section">
        <h1>Layers</h1>
        
      </div>
    );
  }
}
