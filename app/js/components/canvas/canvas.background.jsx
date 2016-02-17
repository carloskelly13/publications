import React, {Component} from 'react'
import {range} from 'lodash'

import CanvasGridline from './canvas.gridline'

export default class CanvasBackground extends Component {
  constructor() {
    super(...arguments)
    this.canvasSelected = this.canvasSelected.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    const widthChanged = this.props.doc.get('width') != nextProps.doc.get('width')
    const heightChanged = this.props.doc.get('height') != nextProps.doc.get('height')
    const zoomChanged = this.props.zoom != nextProps.zoom
    return (widthChanged || heightChanged || zoomChanged)
  }

  render() {
    let {
        doc,
        dpi,
        selectable,
        zoom
      } = this.props,
      xRange = range(0, doc.get('width') * dpi * zoom, 0.25 * dpi * zoom),
      yRange = range(0, doc.get('height') * dpi * zoom, 0.25 * dpi * zoom),
      gridlines = null

    if (selectable) {
      gridlines = (
        <g>
          <g id="horizontal-gridlines">
            {
              xRange.map((mark, idx) => {
                return (<CanvasGridline
                          key={`v-grid-${idx}`}
                          major={(idx % 4 === 0) && (idx > 0)}
                          mX={mark - 0.5}
                          mY="0"
                          dX={mark - 0.5}
                          dY={doc.get('height') * dpi * zoom}
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
                          dX={doc.get('width') * dpi * zoom}
                          dY={mark - 0.5}
                          direction={'H'} />);
              })
            }
          </g>
        </g>
      )
    }

    return <g id="canvas-background"
      onClick={selectable ? this.canvasSelected : null} >
      <rect
        y="0"
        x="0"
        fill="#fff"
        stroke="0"
        strokeWidth="0"
        width={doc.get('width') * dpi * zoom}
        height={doc.get('height') * dpi * zoom} />
      {gridlines}
    </g>
  }

  canvasSelected(event) {
    event.preventDefault()
    this.props.updateSelectedCanvasObject(null, null)
  }
}
