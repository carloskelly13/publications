import React, { Component } from "react";
import PropTypes from "prop-types";
import LoginForm from "./login-form";
import to from "await-to-js";
import Api from "../../util/api";

export default class IndexView extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    user: null,
    errorFetchingUser: null,
  };

  componentWillMount() {
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
    const [err, user] = await to(Api.POST("users/login", payload));
    if (err) {
      this.setState({ errorFetchingUser: true, user: null });
      return;
    }
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
