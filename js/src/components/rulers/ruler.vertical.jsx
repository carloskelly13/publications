import _ from 'lodash';
import React, {Component, PropTypes} from 'react';

import CanvasGridline from '../canvas/canvas.gridline';


export default class RulerVertical extends Component {
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
      .style.top = `${66 - event.target.scrollTop}px`;
  }

  render() {
    let {
      doc,
      dpi,
      zoom
    } = this.props,
    yRange = _.range(0, doc.height * dpi * zoom, 0.25 * dpi * zoom);

    return (
      <div
        ref="rulerContainer"
        style={{
          top: '66px',
          height: `${doc.height * zoom * dpi - 1}px`
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
                  );
                }

                return (
                  <g key={`h-ruler-line-${idx}`}>
                    {label}
                    <CanvasGridline
                            mX={15}
                            mY={mark - 1.5}
                            dX={major ? 0 : 15}
                            dY={25}
                            direction={'H'} />
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
