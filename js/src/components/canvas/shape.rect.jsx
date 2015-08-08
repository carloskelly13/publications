import React, {Component} from 'react';

import ShapeFrame from './shape.frame';
import ShapeBase from './shape.base';

export default class ShapeRect extends ShapeBase {
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
        <rect
          onClick={selectable ? this.shapeSelected : null}
          x={shape.x * dpi * zoom} y={shape.y * dpi * zoom}
          rx={shape.r * zoom} ry={shape.r * zoom}
          width={shape.width * dpi * zoom} height={shape.height * dpi * zoom}
          fill={shape.fill} stroke={shape.stroke}
          fillOpacity={shape.fillOpacity} strokeOpacity={shape.strokeOpacity}
          strokeWidth={shape.strokeWidth * zoom}
        />
        {shapeFrame}
      </g>
    );
  }
}
