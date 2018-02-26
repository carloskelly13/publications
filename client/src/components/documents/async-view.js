import React from "react";

export default class extends React.Component {
  state = {
    documentsViewComponent: null,
  };

  componentDidMount() {
    this.loadDocumentsViewModule();
  }

  loadDocumentsViewModule = async () => {
    if (this.state.documentsViewComponent) {
      return;
    }
    const documentsViewComponent = await import(/* webpackChunkName: "docView" */ "./");
    this.setState({ documentsViewComponent: documentsViewComponent.default });
  };

  render() {
    if (this.state.documentsViewComponent) {
      const Component = this.state.documentsViewComponent;
      return <Component {...this.props} />;
    }
    return <div />;
  }
}
