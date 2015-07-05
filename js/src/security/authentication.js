(function() {
  'use strict';

  angular.module('pub.security.authentication', [])

    .factory('authentication', [
      '$q',
      '$http',
      'appConfig',
      'securityContext',
      'Restangular',
      function($q, $http, appConfig, securityContext, Restangular) {

        var authentication = {
          requestSecurityContext: function() {
            var deferred = $q.defer();

            if (securityContext.authenticated) {
              if (!!securityContext.token()) {
                $http.get(appConfig.apiUrl + '/users/current', {
                  headers: {
                    'Authorization': 'Bearer ' + securityContext.token()
                  }
                }).success(function(user) {
                  deferred.resolve(securityContext.setAuthentication(user));

                }).error(function() {
                  deferred.reject();
                });

              } else {
                deferred.reject();
              }

              return deferred.promise;

            } else {
              deferred.reject();
              return deferred.promise;
            }
          },

          login: function(user, success, error) {
            $http.post(appConfig.apiUrl + '/login', user, null)
              .success(function(loggedInUser) {
                securityContext.setAuthentication(loggedInUser);

                if (loggedInUser.token) {
                  Restangular.setDefaultHeaders({'Authorization': 'Bearer ' + loggedInUser.token});
                } else {
                  securityContext.reset();
                }

                success(user);
              })
              .error(error);
          },

          logout: function() {
            securityContext.reset();
          }
        };

        return authentication;
      }
    ]);
}());
