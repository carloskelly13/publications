import React, {Component, PropTypes} from 'react'
import range from 'lodash.range'
import ReactDOM from 'react-dom'
import CanvasGridline from '../canvas/canvas.gridline'


export default class RulerHorizontal extends Component {
  constructor() {
    super(...arguments)
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    const scrollContainer = document.getElementById('svg-canvas-container')
    scrollContainer.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    const scrollContainer = document.getElementById('svg-canvas-container')
    scrollContainer.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll(event) {
    ReactDOM
      .findDOMNode(this.refs.rulerContainer)
      .style.left = `${-1 - event.target.scrollLeft}px`
  }

  shouldComponentUpdate(nextProps) {
    const widthChanged = this.props.doc.width != nextProps.doc.width
    const heightChanged = this.props.doc.height != nextProps.doc.height
    const zoomChanged = this.props.zoom != nextProps.zoom
    return (widthChanged || heightChanged || zoomChanged)
  }

  render() {
    const { doc, dpi, zoom } = this.props
    const xRange = range(0, doc.width * dpi * zoom, 0.25 * dpi * zoom)

    return (
      <div
        ref="rulerContainer"
        style={{
          left: '-1px',
          width: `${(doc.width * zoom * dpi) + 26}px`
        }}
        className="ruler ruler-horizontal">
        <svg width={(doc.width * dpi * zoom) + 26}
          height="25"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1">
          <g id="horizontal-gridlines">
            {
              xRange.map((mark, idx) => {

                let
                  major = (idx % 4 === 0) && (idx > 0),
                  label = null;

                if (major) {
                  label = (
                    <text
                      fill="#444"
                      fontSize="12"
                      x={mark + 27}
                      y={12}>
                      {idx / 4}
                    </text>
                  )
                }

                return (
                  <g key={`v-ruler-line-${idx}`}>
                    {label}
                    <CanvasGridline
                      mX={mark + 25.5}
                      mY={15}
                      dX={25}
                      dY={major ? 0 : 15}
                      direction={'V'} />
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
