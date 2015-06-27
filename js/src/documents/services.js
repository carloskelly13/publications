(function(){
  'use strict';

  var pub = angular.module('pub.documents.services', []);

  pub.factory('documentServices', [
    '$document',
    '$http',
    '$window',
    'appConfig',
    'securityContext',
    function($document, $http, $window, appConfig, securityContext) {
      var documentServices = {

        offsetShape: function(shapes, shape, offset) {
          var idx = shapes.indexOf(shape);

          if (idx === -1) {
            return;
          }

          var newIdx = idx + offset;

          if (newIdx < 0) {
            newIdx = 0;
          } else if (newIdx > shapes.length) {
            newIdx = shapes.length;
          }

          shapes.splice(idx, 1);
          shapes.splice(newIdx, 0, shape);
        },

        downloadPdf: function(documentId, documentName) {
          $http.get(appConfig.apiUrl + '/documents/' + documentId + '/pdf', {
            headers: {
              'Authorization': 'Bearer ' + securityContext.token()
            },
            responseType: 'arraybuffer'
          }).success(function(pdf) {
            var a = $document.createElement('a');
            $document.body.appendChild(a);
            var blob = new $window.Blob([pdf], {type: 'application/pdf'}),
            url = $window.URL.createObjectURL(blob);
            a.href = url;
            a.download = documentName + '.pdf';
            a.click();
            $window.URL.revokeObjectURL(url);

          }).error(function() {
          });
        },

        newShape: function(type) {
          var shape = {};

          if (type === 'rect' || type === 'ellipse') {
            shape = {type: type, x: 0.25, y: 0.25, r: 0, angle: 0, width: 1, height: 1, fill: '#e0e0e0', stroke: '#9e9e9e', strokeWidth: 1, strokeOpacity: 1.0, fillOpacity: 1.0};

          } else if (type === 'text') {
            shape = {type: type, x: 0.25, y: 0.25, r: 0, text: 'Text Box', fontFamily: 'Source Sans Pro', fontSize: 14, fontStyle: 'normal', fontWeight: '400', angle: 0, width: 2, height: 1, strokeWidth: 0, color: '#434a54', opacity: 1.0, textAlign: 'left'};
          }

          return shape;
        }
      };

      return documentServices;
    }
  ]);

}());
