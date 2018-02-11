import React from "react";
import PropTypes from "prop-types";
import LoginForm from "./login-form";
import to from "await-to-js";
import Api, { getUserFromAuth } from "../../util/api";

export default class IndexView extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    user: null,
    errorFetchingUser: null,
  };

  componentDidMount() {
    this.getCurrentUser();
  }

  navigateToDocuments = () => this.context.router.history.replace("/documents");

  getCurrentUser = async () => {
    const [err, user] = await to(Api.GET("users/current"));
    if (!err) {
      this.setState({ user });
      this.navigateToDocuments();
    }
  };

  login = async payload => {
    const [err, response] = await to(Api.POST("users/login", payload));
    if (err) {
      this.setState({ errorFetchingUser: true, user: null });
      return;
    }
    const user = getUserFromAuth(response);
    this.setState({ errorFetchingUser: false, user });
    this.navigateToDocuments();
  };

  render() {
    return (
      <div>
        <LoginForm handleOnSubmit={this.login} />
      </div>
    );
  }
}
