import React from "react";
import PropTypes from "prop-types";
import LoginForm from "./login-form";
import to from "await-to-js";
import Api, { getUserFromAuth } from "../../util/api";
import { ViewContainer } from "./styles";

export default class IndexView extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    errorFetchingUser: null,
  };

  componentDidMount() {
    this.getCurrentUser();
  }

  navigateToDocuments = () => this.context.router.history.push("/documents");

  getCurrentUser = async () => {
    const [err, user] = await to(Api.GET("users/current"));
    if (!err) {
      this.props.setAppUser(user);
      this.navigateToDocuments();
    }
  };

  login = async payload => {
    const [err, response] = await to(Api.POST("users/login", payload));
    if (err) {
      this.setState({ errorFetchingUser: true });
      return;
    }
    const user = getUserFromAuth(response);
    this.props.setAppUser(user);
    this.setState({ errorFetchingUser: false });
    this.navigateToDocuments();
  };

  render() {
    return (
      <ViewContainer>
        <LoginForm handleOnSubmit={this.login} />
      </ViewContainer>
    );
  }
}
