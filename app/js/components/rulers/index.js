import React, {Component, PropTypes} from 'react'
import range from 'lodash.range'
import ReactDOM from 'react-dom'
import { GridLine } from "../../components/canvas/grid-line"
import styled from "styled-components"
import ReactOutsideEvent from "react-outside-event"
import { sidePanelWidth } from "../../core/constants"
import { connect } from "react-redux"
import { zoomSelector } from "../../selectors"

const RulerContainer = styled.div`
  background: #f4f4f4;
  position: fixed;
  left: 25vw;
  height: 25px;
  z-index: 1;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;

  path {
    fill: none;
    stroke: #ccc;
    stroke-width: 1;
    shape-rendering: crispEdges;
  }
`

const isMajor = index => index % 4 === 0 && index > 0

class Ruler extends Component {
  static defaultProps = {
    dpi: 72
  }

  renderRulerMarks(range, direction) {
    return range.map((mark, index) => {
      const major = isMajor(index)
      return (
        <g key={`${direction}${index}`}>
          { major && this.renderMajorLabel(index, mark, direction) }
          <GridLine
            mX={direction === "V" ? mark + 24.5 : 15}
            mY={direction === "V" ? 15 : mark + 0.5}
            dX={direction === "V" ? 25 : (major ? 0 : 15)}
            dY={direction === "V" ? (major ? 0 : 15) : 25}
            direction={direction}
          />
        </g>
      )
    })
  }

  renderMajorLabel(index, mark, direction) {
    return (
      <text
        fill="#444"
        fontSize="12"
        x={direction === "V" ? mark + 27 : 4}
        y={direction === "V" ? 12 : mark - 2}
      >
        {index / 4}
      </text>
    )
  }

  render() {
    const { doc, dpi, zoom, showDetail } = this.props
    const xRange = range(0, doc.width * dpi * zoom, 0.25 * dpi * zoom)
    const yRange = range(0, doc.height * dpi * zoom, 0.25 * dpi * zoom)
    return (
      <div>
        <RulerContainer
          style={{
            width: `${(doc.width * zoom * dpi) + 25}px`,
            left: `${-this.props.scrollOffset.scrollLeft}px`
          }}
        >
          <svg
            width={(doc.width * dpi * zoom) + 26}
            height="25"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
          >
            { showDetail && this.renderRulerMarks(xRange, "V") }
          </svg>
        </RulerContainer>
        <RulerContainer
          style={{
            top: `${80 - this.props.scrollOffset.scrollTop}px`,
            height: `${(doc.height * zoom * dpi) + 1}px`,
            zIndex: 0,
            left: 0
          }}
        >
          <svg
            width="24"
            height={doc.height * dpi * zoom}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
          >
            { showDetail && this.renderRulerMarks(yRange, "H") }
          </svg>
        </RulerContainer>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  zoom: zoomSelector(state)
})

export default connect(mapStateToProps)(Ruler)
