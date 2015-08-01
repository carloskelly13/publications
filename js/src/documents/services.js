(function(){
  angular.module('pub.documents.services', [])
    .service('documentService', documentService);

  function documentService($document, $http, $q, $window, appConfig, Restangular, securityContext) {

    this.newDocument = function(sender) {
      let deferred = $q.defer();

      Restangular.all('documents')
        .post(sender)
        .then((responseObj) => { deferred.resolve(responseObj); },
              (error) => { deferred.reject(error); });

      return deferred.promise;
    };

    this.offsetShape = function(shapes, shape, offset) {
      let idx = shapes.indexOf(shape);

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
    };

    this.newShape = function(sender) {
      let type = _.contains(['rect', 'ellipse', 'text'], sender) ? sender : 'rect';

      if (type === 'rect' || type === 'ellipse') {
        return {type: type, x: 0.25, y: 0.25, r: 0, angle: 0, width: 1, height: 1, fill: '#e0e0e0', stroke: '#9e9e9e', strokeWidth: 1, strokeOpacity: 1.0, fillOpacity: 1.0};
      } else if (type === 'text') {
        return {type: type, x: 0.25, y: 0.25, r: 0, text: 'Text Box', fontFamily: 'Source Sans Pro', fontSize: 14, fontStyle: 'normal', fontWeight: '400', angle: 0, width: 2, height: 1, strokeWidth: 0, color: '#434a54', opacity: 1.0, textAlign: 'left'};
      }
    };

    this.downloadPdf = function(documentId) {
      $http.get(`${appConfig.apiUrl}/documents/${documentId}/pdf`, {
        headers: {
          Authorization: `Bearer ${securityContext.token()}`
        },
        responseType: 'arraybuffer'
      })
        .success((pdfData) => {
          var blob = new $window.Blob([pdfData], {type: 'application/pdf'});
          console.log(blob);
        });
    };
  }
}());
