import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import InspectorShapeBorder from './inspector.shape.border';
import InspectorShapeColor from './inspector.shape.color';
import InspectorShapeMetrics from './inspector.shape.metrics';

export default class InspectorShape extends Component {
  render() {
    let {
      shape,
      theme
    } = this.props;

    return (
      <div className="inspector-pane inspector-pane-document">
        <InspectorShapeMetrics
          inputValueChanged={e => this.inputValueChanged(e)}
          shape={shape}
          theme={theme} />
        <InspectorShapeColor
          inputValueChanged={e => this.inputValueChanged(e)}
          shape={shape}
          theme={theme} />
        <InspectorShapeBorder
          inputValueChanged={e => this.inputValueChanged(e)}
          shape={shape}
          theme={theme} />
      </div>
    );
  }

  inputValueChanged(event) {
    let {
      shape,
      updateShape
    } = this.props;

    let updatedValue = event.target.value;

    if (!isNaN(updatedValue)) {
      updatedValue = parseFloat(updatedValue);
    }

    shape[event.target.name] = updatedValue;
    updateShape(shape);
  }
}
