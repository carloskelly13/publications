(function(){
  'use strict';

  var pub = angular.module('pub.documents.services', []);

  pub.factory('documentServices', [
    '$q',
    'authentication',
    'Restangular',
    function($q, authentication, Restangular) {
      var documentServices = {

        newDocument: function(user, title, width, height) {
          return {
            _user: user._id,
            name: title || 'Untitled Document',
            width: width || 504,
            height: height || 360,
            shapes: []
          };
       }
      };

      return documentServices;
    }
  ]);

}());