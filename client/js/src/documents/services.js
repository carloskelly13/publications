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
            width: width || 8.5,
            height: height || 11,
            shapes: []
          };
        },
        
        newShape: function(type) {
          var shape = {};
          
          if (type === 'rect' || type == 'ellipse') {
            shape = { 
              type: type, 
              x: 1, 
              y: 1,
              r: 0,
              angle: 0,
              width: 1, 
              height: 1,
              fill: '#3498db', 
              stroke: '#34495e',
              strokeWidth: 1, 
              strokeOpacity: 1.0, 
              fillOpacity: 1.0
            };
          }
          
          return shape;
        }
      };

      return documentServices;
    }
  ]);

}());