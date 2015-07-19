(function() {
  'use strict';

  angular.module('pub.security.services', [])
    .service('accountService', accountService);
    
  function accountService($http, appConfig, securityContext, uuid4) {
    
    this.createAccount = () => {
      let request = {
        method: 'POST',
        url: `${appConfig.apiUrl}/users`,
        data: {
          name: `${uuid4.generate()}@publicationsapp.com`,
          password: 'password',
          temporary: true
        }
      };

      return $http(request);
    };
    
    this.updateAccount = (sender) => {
      let request = {
        method: 'PATCH',
        url: `${appConfig.apiUrl}/users`,
        headers: {
          Authorization: `Bearer ${securityContext.token()}`
        },
        data: {
          name: sender.emailAddress || securityContext.user.name,
          currentPassword: sender.currentPassword || 'password',
          password: sender.newPassword,
          temporary: false
        }
      };

      return $http(request);
    };
    
  }
  
})();