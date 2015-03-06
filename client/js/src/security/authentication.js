(function() {
  'use strict';

  angular.module('pub.security.authentication', [])

    .factory('authentication', [
      '$q',
      '$http',
      'securityContext',
      function($q, $http, securityContext) {

        var authentication = {
          requestSecurityContext: function() {
            if (securityContext.authenticated) {
              return $q.when(securityContext);

            } else {
              var deferred = $q.defer();
              $http.get('/users/current', null).success(function(user) {
                deferred.resolve(securityContext.setAuthentication(user));
              })

              return deferred.promise;
            }
          },

          login: function(user, success, error) {
            $http.post('/login', user, null)
              .success(function(user) {
                success(user);
                securityContext.setAuthentication(user);
              })
              .error(error);
          },

          logout: function(success, error) {
            securityContext.reset();
            $http.get('/logout').success(success).error(error);
          }
        }

        return authentication;
      }
    ]);
}());
