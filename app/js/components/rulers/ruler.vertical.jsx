import React, {Component, PropTypes} from 'react'
import { range } from 'lodash'
import { autobind } from 'core-decorators'
import ReactDOM from 'react-dom'
import CanvasGridline from '../canvas/canvas.gridline'


export default class RulerVertical extends Component {
  componentDidMount() {
    const scrollContainer = document.getElementById('svg-canvas-container')
    scrollContainer.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    const scrollContainer = document.getElementById('svg-canvas-container')
    scrollContainer.removeEventListener('scroll', this.handleScroll)
  }

  shouldComponentUpdate(nextProps) {
    const widthChanged = this.props.doc.width != nextProps.doc.width
    const heightChanged = this.props.doc.height != nextProps.doc.height
    const zoomChanged = this.props.zoom != nextProps.zoom
    return (widthChanged || heightChanged || zoomChanged)
  }

  @autobind
  handleScroll(event) {
    ReactDOM
      .findDOMNode(this.refs.rulerContainer)
      .style.top = `${66 - event.target.scrollTop}px`
  }

  render() {
    const { doc, dpi, zoom } = this.props
    const yRange = range(0, doc.height * dpi * zoom, 0.25 * dpi * zoom)

    return (
      <div
        ref="rulerContainer"
        style={{
          top: '66px',
          height: `${doc.height * zoom * dpi}px`
        }}
        className="ruler ruler-vertical">
        <svg width="25"
          height={doc.height * dpi * zoom}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1">
          <g id="horizontal-gridlines">
            {
              yRange.map((mark, idx) => {

                let
                  major = (idx % 4 === 0) && (idx > 0),
                  label = null;

                if (major) {
                  label = (
                    <text
                      fill="#444"
                      fontSize="12"
                      x={5}
                      y={mark - 5}>
                      {idx / 4}
                    </text>
                  )
                }

                return (
                  <g key={`h-ruler-line-${idx}`}>
                    {label}
                    <CanvasGridline
                            mX={15}
                            mY={mark - 0.5}
                            dX={major ? 0 : 15}
                            dY={25}
                            direction={'H'} />
                  </g>
                )
              })
            }
          </g>
        </svg>
      </div>
    )
  }
}
