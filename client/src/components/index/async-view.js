import React from "react";

export default class extends React.Component {
  state = {
    indexViewComponent: null,
  };

  componentDidMount() {
    this.loadIndexViewModule();
  }

  loadIndexViewModule = async () => {
    if (this.state.indexViewComponent) {
      return;
    }
    const indexViewComponent = await import(/* webpackChunkName: "indexView" */ "./");
    this.setState({ indexViewComponent: indexViewComponent.default });
  };

  render() {
    if (this.state.indexViewComponent) {
      const Component = this.state.indexViewComponent;
      return <Component {...this.props} />;
    }
    return <div />;
  }
}
