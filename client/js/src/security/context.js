(function() {
  'use strict';

  var pub = angular.module('pub.security.context', []);

  pub.factory('securityContext', [
    '$q',
    function($q) {

      var securityContext = {
        user: {},
        authenticated: false,

        reset: function() {
          securityContext.user = {},
          securityContext.authenticated = false;
          return securityContext;
        },

        setAuthentication: function(user) {
          securityContext.user = user || {};
          securityContext.authenticated = _.isObject(user);
          return securityContext;
        }
      };

      return securityContext;
    }
  ]);
}());