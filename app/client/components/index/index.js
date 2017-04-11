import React, { Component } from "react"
import PropTypes from "prop-types";
import { connect } from "react-redux"
import { LoginForm } from "./login-form"

import * as UserActions from "../../state/actions/user"

class IndexView extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor() {
    super(...arguments)
    this.authenticateUser = this.authenticateUser.bind(this)
  }

  componentWillMount() {
    this.props.dispatch(UserActions.getUser())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.isAuthenticated) {
      this.context.router.history.replace("/documents")
    }
  }

  authenticateUser({ emailAddress, password }) {
    const { dispatch } = this.props
    dispatch(UserActions.login({ emailAddress, password }))
  }

  render() {
    const { errors } = this.props
    return (
      <div>
        <h2>Index View</h2>
        <LoginForm
          authenticateUser={this.authenticateUser}
          errors={errors}
        />
      </div>
    )
  }
}

const mapState = ({ user, errors }) => ({ user, errors: errors.errors })
export default connect(mapState)(IndexView)
