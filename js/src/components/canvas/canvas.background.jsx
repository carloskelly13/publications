import React, {Component} from 'react';

import CanvasGridline from './canvas.gridline';

export default class CanvasBackground extends Component {
  constructor(props, context) {
    super(props)
    this.canvasSelected = this.canvasSelected.bind(this);
  }

  render() {
    let doc = this.props.doc;
    let dpi = this.props.params.dpi;
    let zoom = this.props.params.zoom;
    let selectable = this.props.params.selectable;

    return (
      <g>
        <rect
          onClick={selectable ? this.canvasSelected : null}
          y="0" x="0" fill="#fff" stroke="0" strokeWidth="0"
          width={doc.width * dpi * zoom} height={doc.height * dpi * zoom}
        />
      </g>
    );
  }

  canvasSelected(event) {
    event.preventDefault();
    this.props.params.updateSelectedCanvasObject(null, null);
  }
}
