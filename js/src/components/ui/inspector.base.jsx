import React, {Component, PropTypes} from 'react';

export default class InspectorBase extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let
      inspectorContainerClasses = '';

    if (this.props.showInspector) {
      inspectorContainerClasses = 'inspector-container inspector-container-visible';
    } else {
      inspectorContainerClasses = 'inspector-container';
    }

    return (
      <div className={inspectorContainerClasses}>
        Inspector
      </div>
    );
  }
}
