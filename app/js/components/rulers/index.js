import React, {Component, PropTypes} from 'react'
import range from 'lodash.range'
import ReactDOM from 'react-dom'
import { GridLine } from "../../components/canvas/grid-line"
import styled from "styled-components"
import ReactOutsideEvent from "react-outside-event"

const RulerContainer = styled.div`
  background: #f4f4f4;
  position: fixed;
  left: 25vw;
  border-bottom: 1px solid #aaa;
  border-right: 1px solid #aaa;
  height: 25px;
  z-index: 1;
`

export default class Ruler extends Component {
  static defaultProps = {
    dpi: 72,
    zoom: 1.0
  }

  render() {
    const { doc, dpi, zoom } = this.props
    const xRange = range(0, doc.width * dpi * zoom, 0.25 * dpi * zoom)

    return (
      <RulerContainer
        style={{
          width: `${(doc.width * zoom * dpi) + 26}px`,
          left: `calc(25vw - ${this.props.scrollOffset.scrollLeft}px)`
        }}
      >
        <svg
          width={(doc.width * dpi * zoom) + 26}
          height="25"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
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
                    <GridLine
                      mX={mark + 25.5}
                      mY={15}
                      dX={25}
                      dY={major ? 0 : 15}
                      direction={'V'}
                    />
                  </g>
                )
              })
            }
          </g>
        </svg>
      </RulerContainer>
    )
  }
}
