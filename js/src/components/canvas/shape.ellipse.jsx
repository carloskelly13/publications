import React, {Component} from 'react';

import ShapeFrame from './shape.frame';
import ShapeBase from './shape.base';

export default class ShapeEllipse extends ShapeBase {
  render() {
    let shape = this.props.shape;
    let dpi = this.props.params.dpi;
    let zoom = this.props.params.zoom;
    let selectable = this.props.params.selectable;
    var shapeFrame;

    if (super.isShapeSelected()) {
      shapeFrame = (
        <ShapeFrame
          shape={shape}
          dpi={dpi}
          zoom={zoom}
          updateShape={this.props.params.updateShape} />
      );
    }

    return (
      <g>
        <ellipse
          onClick={selectable ? this.shapeSelected : null}
          cx={(shape.x * dpi * zoom) + (shape.width / 2.0 * dpi * zoom)}
          cy={(shape.y * dpi * zoom) + (shape.height / 2.0 * dpi * zoom)}
          rx={shape.width / 2.0 * dpi * zoom} ry={shape.height / 2.0 * dpi * zoom}
          fill={shape.fill} stroke={shape.stroke}
          fillOpacity={shape.fillOpacity} strokeOpacity={shape.strokeOpacity}
          strokeWidth={shape.strokeWidth * zoom}
        />
        {shapeFrame}
      </g>
    );
  }
}
