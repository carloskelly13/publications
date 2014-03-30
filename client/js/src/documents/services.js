(function(){
  'use strict';

  var pub = angular.module('pub.documents.services', []);

  pub.factory('documentServices', [
    function() {
      var documentServices = {

        newShape: function(type) {
          var shape = {};

          if (type === 'rect' || type === 'ellipse') {
            shape = { type: type, x: 1, y: 1, r: 0, angle: 0, width: 1, height: 1, fill: '#3498db', stroke: '#34495e', strokeWidth: 1, strokeOpacity: 1.0, fillOpacity: 1.0 };

          } else if (type === 'text') {
            shape = { type: type, x: 1, y: 1, r: 0, text: 'Text Box', fontFamily: 'Helvetica Neue', fontSize: 13, fontStyle: 'normal', fontWeight: 400, angle: 0, width: 2, height: 1, strokeWidth: 0, color: '#111', opacity: 1.0, textAlign: 'left' };
          }

          return shape;
        }
      };

      return documentServices;
    }
  ]);

}());