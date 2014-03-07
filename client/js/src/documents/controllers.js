(function() {
  'use strict';

  var pub = angular.module('pub.documents.controllers', []);

  pub.controller('DocumentsController', [
    '$scope',
    '$location',
    'documentServices',
    'authentication',
    'documents',
    'Restangular',
    function($scope, $location, documentServices, authentication, documents, Restangular) {

      documents.getList().then(function(res) {
        $scope.documents = res;
      });

      $scope.updateAuthenticationStatus();

      $scope.newDocument = function() {
        documents.post(documentServices.newDocument($scope.user)).then(function(res) {
          $scope.documents.push(res);
        });
      };

      $scope.deleteDocument = function(sender) {
           sender.remove();
        $scope.documents.splice(_.indexOf($scope.documents, sender), 1);
      };

      $scope.updateDocument = function(sender) {
        sender.put();
      };
    }
  ]);
}());