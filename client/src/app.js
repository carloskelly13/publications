import React from "react";
import BaseView from "./components/base";
import DocumentView from "./components/documents";

export default class extends React.Component {
  state = {
    user: null,
  };

  setAppUser = user => this.setState({ user });

  render() {
    const authProps = { user: this.state.user, setAppUser: this.setAppUser };
    return (
      <BaseView>
        <DocumentView {...authProps} />
      </BaseView>
    );
  }
}
