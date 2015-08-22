import dispatcher from '../flux/flux.dispatcher';

const UserActions = {
  LOGIN: 'LOGIN_USER',
  LOGOUT: 'LOGOUT_USER',

  login(data) {
    dispatcher.handleViewAction({
      actionType: UserActions.LOGIN,
      data: data
    });
  },

  logout(data) {
    dispatcher.handleViewAction({
      actionType: UserActions.LOGOUT
    });
  }
};

export default UserActions;
