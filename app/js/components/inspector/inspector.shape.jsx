import React, {Component, PropTypes} from 'react';
import {omit} from 'lodash';

import InspectorShapeBorder from './inspector.shape.border';
import InspectorShapeColor from './inspector.shape.color';
import InspectorShapeMetrics from './inspector.shape.metrics';
import InspectorShapeText from './inspector.shape.text';
import InspectorShapeLayer from './inspector.shape.layer';

export default class InspectorShape extends Component {
  render() {
    return (
      <div className="inspector-pane inspector-pane-document">
        <InspectorShapeMetrics
          inputValueChanged={e => this.inputValueChanged(e)}
          {...this.props} />
        { (() => {
          if (this.props.shape.type === 'text') {
            return (
              <InspectorShapeText
                inputValueChanged={e => this.inputValueChanged(e)}
                {...this.props} />
            );
          } else {
            return (
              <div>
                <InspectorShapeColor
                  inputValueChanged={e => this.inputValueChanged(e)}
                  {...omit(this.props, ['updateDocument', 'doc'])} />
                <InspectorShapeBorder
                  inputValueChanged={e => this.inputValueChanged(e)}
                  {...omit(this.props, ['updateDocument', 'doc'])} />
                <InspectorShapeLayer
                  inputValueChanged={e => this.inputValueChanged(e)}
                  {...this.props} />
              </div>
            );
          }
        })() }
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
