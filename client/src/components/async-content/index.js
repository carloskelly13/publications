// @flow
import type { Node } from "react";
import React from "react";

type Props = {
  waitFor: ?Object | boolean,
  renderLoading: Node,
  renderContent: Node,
};
type State = {
  isLoading: boolean,
};
export default class LoadingView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isLoading: !props.waitFor };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.waitFor) {
      this.setState(() => ({ isLoading: false }));
    }
  }

  render() {
    return this.state.isLoading
      ? this.props.renderLoading
      : this.props.renderContent;
  }
}
