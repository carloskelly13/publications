import dispatcher from '../flux/flux.dispatcher'

const UserActions = {
  LOGIN: 'LOGIN_USER',
  LOGOUT: 'LOGOUT_USER',
  PATCH: 'PATCH_USER',
  GET: 'GET_USER',
  POST: 'POST_USER',

  login(data) {
    dispatcher.handleViewAction({
      actionType: UserActions.LOGIN,
      data
    })
  },

  logout(data) {
    dispatcher.handleViewAction({
      actionType: UserActions.LOGOUT
    })
  },

  patch(data) {
    dispatcher.handleViewAction({
      actionType: UserActions.PATCH,
      data
    })
  },

  get(data) {
    dispatcher.handleViewAction({
      actionType: UserActions.GET
    })
  },

  post(data) {
    dispatcher.handleViewAction({
      actionType: UserActions.POST,
      data
    })
  }
}

export default UserActions
