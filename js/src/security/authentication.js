(function() {
  'use strict';

  angular.module('pub.security.authentication', [])
    .service('authentication', authenticationService);
    
  function authenticationService($q, $http, appConfig, securityContext, Restangular) {
    this.requestSecurityContext = () => {
      var deferred = $q.defer();

      if (securityContext.authenticated) {
        if (!!securityContext.token()) {
          $http.get(`${appConfig.apiUrl}/users/current`, {
            headers: {
              'Authorization': 'Bearer ' + securityContext.token()
            }
          }).success((user) => {
            deferred.resolve(securityContext.setAuthentication(user));

          }).error(() => {
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
    };

    this.login = (user) => {
      let deferred = $q.defer();
      
      $http.post(`${appConfig.apiUrl}/login`, user, null)
        .success(function(loggedInUser) {
          securityContext.setAuthentication(loggedInUser);

          if (loggedInUser.token) {
            Restangular.setDefaultHeaders({Authorization: `Bearer ${loggedInUser.token}`});
          } else {
            securityContext.reset();
          }
          
          deferred.resolve(user);
        })
        .error((error) => {
          deferred.reject(error);
        });
        
      return deferred.promise;
    };

    this.logout = () => {
      securityContext.reset();
    };
  }
  
}());
