import _ from 'lodash';
import React, {Component, PropTypes} from 'react';

import CanvasGridline from '../canvas/canvas.gridline';


export default class RulerHorizontal extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    let scrollContainer = document.getElementById('app-scroll-content');
    scrollContainer.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    let scrollContainer = document.getElementById('app-scroll-content');
    scrollContainer.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    React.findDOMNode(this.refs.rulerContainer)
      .style.left = `${25 - event.target.scrollLeft}px`;
  }

  render() {
    let {
      doc,
      dpi,
      zoom
    } = this.props,
    xRange = _.range(0, doc.width * dpi * zoom, 0.25 * dpi * zoom);

    return (
      <div
        ref="rulerContainer"
        style={{
          left: "25px",
          width: `${doc.width * zoom * dpi}px`
        }}
        className="ruler ruler-horizontal">
        <svg width={doc.width * dpi * zoom}
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
                      x={mark + 3}
                      y={20}>
                      {idx / 4}
                    </text>
                  );
                }

                return (
                  <g key={`v-ruler-line-${idx}`}>
                    {label}
                    <CanvasGridline
                            mX={mark - 0.5}
                            mY={10}
                            dX={25}
                            dY={major ? 0 : 10}
                            direction={'V'} />
                  </g>
                );
              })
            }
          </g>
        </svg>
      </div>
    );
  }
}
