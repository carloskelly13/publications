import React, {Component, PropTypes} from 'react/addons';
import validator from 'validator';

export default class InputBase extends Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value, previousValue: props.value};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value, previousValue: nextProps.value});
  }

  valueChanged(event) {
    this.setState({value: event.target.value});

    if (this.validate(event)) {
      this.props.valueChanged(event);
    }
  }

  onComponentDefocus(event) {
    if (!this.validate(event)) {
      this.setState({value: this.state.previousValue});
    }
  }

  validate(event) {
    let validatorMethod = this.props.validator;

    if (!validatorMethod) {
      return true;
    } else {
      if (validator[validatorMethod].apply(validator, [
        event.target.value,
        this.props.validatorOptions
      ])) {
        return true;
      } else {
        return false;
      }
    }
  }
}
