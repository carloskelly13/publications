import React from "react";
import BaseView from "./components/base";
import DocumentView from "./components/documents";
import { PubUser } from "./types/pub-objects";

interface State {
  user: PubUser | null;
}
export default class extends React.Component<{}, State> {
  state = {
    user: null,
  };

  setAppUser = (user: PubUser | null) => this.setState({ user });

  render() {
    const authProps = { user: this.state.user, setAppUser: this.setAppUser };
    return (
      <BaseView>
        <DocumentView {...authProps} />
      </BaseView>
    );
  }
}
