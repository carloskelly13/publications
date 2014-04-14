(function() {
  'use strict';

  var pub = angular.module('pub.security.authentication', []);

  pub.factory('authentication', [
    '$q',
    '$http',
    'securityContext',
    'Restangular',
    function($q, $http, securityContext, Restangular) {

      var authentication = {
        requestSecurityContext: function() {
          if (securityContext.authenticated) {
            return $q.when(securityContext);
          } else {
            return Restangular.all('users').current().then(function(user) {
              return securityContext.setAuthentication(user);
            });
          }
        },

        login: function(user, success) {
          Restangular.all('users').login(user).then(function(user) {
            success(user);
            securityContext.setAuthentication(user);
          });
        },

        logout: function(success, error) {
          securityContext.reset();
          $http.get('/logout').success(success).error(error);
        }
      };

      return authentication;
    }
  ]);
}());