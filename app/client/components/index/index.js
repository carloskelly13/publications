import React, { Component } from "react";
import PropTypes from "prop-types";
import LoginForm from "./login-form";
import { connect } from "react-redux";
import {
  fetchCurrentUser,
  currentUserSelector,
  logOut,
  fetchUser,
} from "../../modules/session";

class IndexView extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.props.fetchCurrentUser();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.context.router.history.replace("/documents");
    }
  }

  render() {
    return (
      <div>
        <LoginForm handleOnSubmit={this.props.fetchUser} />
      </div>
    );
  }
}

export default connect(
  state => ({
    user: currentUserSelector(state),
  }),
  {
    fetchUser,
    fetchCurrentUser,
    logOut,
  }
)(IndexView);
