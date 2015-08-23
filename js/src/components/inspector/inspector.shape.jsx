import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import InspectorShapeBorder from './inspector.shape.border';
import InspectorShapeColor from './inspector.shape.color';
import InspectorShapeMetrics from './inspector.shape.metrics';
import InspectorShapeText from './inspector.shape.text';

export default class InspectorShape extends Component {
  render() {
    let panels = '';

    if (this.props.shape.type === 'text') {
      panels = (
        <InspectorShapeText
          inputValueChanged={e => this.inputValueChanged(e)}
          {...this.props} />
      );
    } else {
      panels = (
        <div>
          <InspectorShapeColor
            inputValueChanged={e => this.inputValueChanged(e)}
            {...this.props} />
          <InspectorShapeBorder
            inputValueChanged={e => this.inputValueChanged(e)}
            {...this.props} />
        </div>
      );
    }

    return (
      <div className="inspector-pane inspector-pane-document">
        <InspectorShapeMetrics
          inputValueChanged={e => this.inputValueChanged(e)}
          {...this.props} />
        {panels}
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
