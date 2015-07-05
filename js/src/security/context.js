(function() {
  'use strict';

  var pub = angular.module('pub.security.context', []);

  pub.factory('securityContext', [
    '$window',
    function($window) {

      var securityContext = {
        user: {},

        authenticated: function() {
          return !!securityContext.token;
        },

        token: function() {
          return $window.sessionStorage.getItem('access-token');
        },

        setToken: function(newToken) {
          if (!newToken) { return; }
          $window.sessionStorage.setItem('access-token', newToken);
        },

        reset: function() {
          securityContext.user = {};
          securityContext.authenticated = false;
          $window.sessionStorage.removeItem('access-token');
          return securityContext;
        },

        setAuthentication: function(user) {
          securityContext.user = user || {};
          securityContext.setToken(user.token);
          securityContext.authenticated = _.isObject(user);
          return securityContext;
        }
      };

      return securityContext;
    }
  ]);
}());
