import React, {Component} from 'react';

import CanvasBackground from './canvas.background';
import ShapeRect from './shape.rect';
import ShapeEllipse from './shape.ellipse';

export default class Canvas extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let doc = this.props.doc;

    let params = {
      dpi: this.props.dpi,
      zoom: this.props.zoom,
      selectable: this.props.selectable,
      selectedShape: this.props.selectedShape,
      updateSelectedCanvasObject: this.props.updateSelectedCanvasObject,
      updateShape: this.props.updateShape
    };

    return (
      <div className="canvas-container">
        <svg width={doc.width * params.dpi * params.zoom}
          height={doc.height * params.dpi * params.zoom}
          className="canvas-svg"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1">
          <g>
            <CanvasBackground doc={doc} params={params} />
          </g>
          <g>
            {
              doc.shapes.map((shape, idx) => {
                switch (shape.type) {
                  case 'rect':
                  return <ShapeRect key={idx} shape={shape} params={params} />;

                  case 'ellipse':
                  return <ShapeEllipse key={idx} shape={shape} params={params} />;

                  default:
                  return <g key={idx} />;
                }
              })
            }
          </g>
        </svg>
      </div>
    );
  }
}
