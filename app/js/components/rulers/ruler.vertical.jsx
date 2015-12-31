import {eq, range} from 'lodash';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import CanvasGridline from '../canvas/canvas.gridline';


export default class RulerVertical extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    let scrollContainer = document.getElementById('svg-canvas-container');
    scrollContainer.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    let scrollContainer = document.getElementById('svg-canvas-container');
    scrollContainer.removeEventListener('scroll', this.handleScroll);
  }

  shouldComponentUpdate(nextProps) {
    let widthChanged = this.props.doc.get('width') != nextProps.doc.get('width');
    let heightChanged = this.props.doc.get('height') != nextProps.doc.get('height');
    let zoomChanged = this.props.zoom != nextProps.zoom;
    return (widthChanged || heightChanged || zoomChanged);
  }

  handleScroll(event) {
    ReactDOM.findDOMNode(this.refs.rulerContainer)
      .style.top = `${66 - event.target.scrollTop}px`;
  }

  render() {
    let {
      doc,
      dpi,
      zoom
    } = this.props,
    yRange = range(0, doc.get('height') * dpi * zoom, 0.25 * dpi * zoom);

    return (
      <div
        ref="rulerContainer"
        style={{
          top: '66px',
          height: `${doc.get('height') * zoom * dpi}px`
        }}
        className="ruler ruler-vertical">
        <svg width="25"
          height={doc.get('height') * dpi * zoom}
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
                            mY={mark - 0.5}
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
