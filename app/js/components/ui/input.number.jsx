import React, {Component, PropTypes} from 'react'
import {autobind} from 'core-decorators'

export default class InputNumber extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    valueChanged: PropTypes.func.isRequired
  }

  constructor() {
    super(...arguments)
  }

  @autobind
  yolo() {

  }

  render() {
    return <div>
      <input type="text" value={this.props.value} onChange={yolo} />
    </div>
  }
}