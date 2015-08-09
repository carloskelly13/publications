import React, {Component} from 'react';
import _ from 'lodash';

import CanvasGridline from './canvas.gridline';

export default class CanvasBackground extends Component {
  constructor(props, context) {
    super(props)
    this.canvasSelected = this.canvasSelected.bind(this);
  }

  render() {
    let
      doc = this.props.doc,
      dpi = this.props.params.dpi,
      selectable = this.props.params.selectable,
      zoom = this.props.params.zoom,
      xRange = _.range(0, doc.width * dpi * zoom, 0.25 * dpi * zoom),
      yRange = _.range(0, doc.height * dpi * zoom, 0.25 * dpi * zoom);

    return (
      <g id="canvas-background">
        <rect
          onClick={selectable ? this.canvasSelected : null}
          y="0"
          x="0"
          fill="#fff"
          stroke="0"
          strokeWidth="0"
          width={doc.width * dpi * zoom}
          height={doc.height * dpi * zoom} />
        <g id="horizontal-gridlines">
          {
            xRange.map((mark, idx) => {
              return (<CanvasGridline
                        key={`v-grid-${idx}`}
                        major={(idx % 4 === 0) && (idx > 0)}
                        mX={mark - 0.5}
                        mY="0"
                        dX={mark - 0.5}
                        dY={doc.height * dpi * zoom}
                        direction={'V'} />);
            })
          }
        </g>
        <g id="vertical-gridlines">
          {
            yRange.map((mark, idx) => {
              return (<CanvasGridline
                        key={`h-grid-${idx}`}
                        major={(idx % 4 === 0) && (idx > 0)}
                        mX="0"
                        mY={mark - 0.5}
                        dX={doc.width * dpi * zoom}
                        dY={mark - 0.5}
                        direction={'H'} />);
            })
          }
        </g>
      </g>
    );
  }

  canvasSelected(event) {
    event.preventDefault();
    this.props.params.updateSelectedCanvasObject(null, null);
  }
}
