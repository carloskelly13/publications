import Api from './api';

export default class UserAuth {
  static logIn(options) {
    Api.post({
      path: '/login',
      data: {name: options.name, password: options.password},
      success: (responseObj) => {
        if (responseObj.token) {
          options.success();
          sessionStorage.setItem('access-token', responseObj.token);
        }
      },
      failure: (error) => {
        options.failure();
        console.log(error);
      }
    });
  }

  static logOut(callback) {
    sessionStorage.removeItem('access-token');
    callback();
  }

  static isLoggedIn() {
    return !!sessionStorage.getItem('access-token');
  }
}
