import React, {Component} from 'react';

import ShapeFrame from './shape.frame';
import ShapeBase from './shape.base';

export default class ShapeText extends ShapeBase {
  render() {
    let {
      dpi,
      selectable,
      shape,
      updateShape,
      zoom
    } = this.props,
    shapeFrame;

    if (super.isShapeSelected()) {
      shapeFrame = (
        <ShapeFrame {...this.props} />
      );
    }

    return (
      <g>
        <foreignObject
          onClick={selectable ? this.shapeSelected : null}
          x={shape.x * dpi * zoom} y={shape.y * dpi * zoom}
          width={shape.width * dpi * zoom} height={shape.height * dpi * zoom}>

          <p
            className="embedded-shape-text"
            style={{
              color: shape.color,
              fontFamily: shape.fontFamily,
              fontStyle: shape.fontStyle,
              fontSize: `${shape.fontSize * zoom}px`,
              fontWeight: shape.fontWeight,
              textAlign: shape.textAlign
            }}>
            {shape.text}
          </p>

        </foreignObject>
        {shapeFrame}
      </g>
    );
  }
}
