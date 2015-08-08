(function() {
  angular.module('pub.security.context', [])
    .factory('securityContext', securityContext);

  function securityContext($window) {
    var securityContextObject = {
      user: {},

      authenticated: () => {
        return !!securityContextObject.token;
      },

      token: () => {
        return $window.sessionStorage.getItem('access-token');
      },

      setToken: (newToken) => {
        if (!newToken) { return; }
        $window.sessionStorage.setItem('access-token', newToken);
      },

      reset: () => {
        securityContextObject.user = {};
        securityContextObject.securityContextObject = null;
        $window.sessionStorage.removeItem('access-token');
        return securityContextObject;
      },

      setAuthentication: (user) => {
        securityContextObject.user = user || {};
        securityContextObject.setToken(user.token);
        securityContextObject.authenticated = _.isObject(user);
        return securityContextObject;
      }
    };

    return securityContextObject;
  }

}());
