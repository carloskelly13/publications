// @flow
import React from "react";
import BaseView from "./components/base";
import DocumentView from "./components/documents";
import type { PubUser } from "./util/types";

type State = {
  user: ?PubUser,
};
export default class extends React.Component<{}, State> {
  state = {
    user: null,
  };

  setAppUser = (user: ?PubUser) => this.setState({ user });

  render() {
    const authProps = { user: this.state.user, setAppUser: this.setAppUser };
    return (
      <BaseView>
        <DocumentView {...authProps} />
      </BaseView>
    );
  }
}
