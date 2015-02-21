String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

Array.prototype.moveElement = function(element, offset) {
  var idx = this.indexOf(element);

  if (idx === -1) {
    return;
  }

  var newIdx = idx + offset;

  if (newIdx < 0) {
    newIdx = 0;
  } else if (newIdx > this.length) {
    newIdx = this.length;
  }

  this.splice(idx, 1);
  this.splice(newIdx, 0, element);
};

(function(){
  'use strict';

  var pub = angular.module('pub.documents.services', []);

  pub.factory('documentServices', [
    function() {
      var documentServices = {

        newShape: function(type) {
          var shape = {};

          if (type === 'rect' || type === 'ellipse') {
            shape = { type: type, x: 1, y: 1, r: 0, angle: 0, width: 1, height: 1, fill: '#609eeb', stroke: '#4e8bda', strokeWidth: 1, strokeOpacity: 1.0, fillOpacity: 1.0 };

          } else if (type === 'text') {
            shape = { type: type, x: 1, y: 1, r: 0, text: 'Text Box', fontFamily: 'Source Sans Pro', fontSize: 14, fontStyle: 'normal', fontWeight: '400', angle: 0, width: 2, height: 1, strokeWidth: 0, color: '#434a54', opacity: 1.0, textAlign: 'left' };
          }

          return shape;
        }
      };

      return documentServices;
    }
  ]);

}());
