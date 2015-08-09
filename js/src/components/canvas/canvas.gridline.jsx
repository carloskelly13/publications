import React, {Component} from 'react';

export default class CanvasGridline extends Component {
  render() {
    let classString = this.props.major ? 'inch-mark' : '';

    return (
      <path
        className={classString}
        d={`M${this.props.mX} ${this.props.mY} ${this.props.direction}${this.props.dX} ${this.props.dY} Z`} />
    );
  }
}
