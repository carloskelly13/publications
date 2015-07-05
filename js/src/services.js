(function() {
  'use strict';

  angular.module('pub.services', [])

    .service('pub.progressModal', [
      '$mdDialog',
      function($mdDialog) {
        var _dialogConfig = {
            clickOutsideToClose: false,
            template: '<md-dialog class="dialog-progress" aria-label="Working. Please Wait.">' +
                      '  <md-dialog-content>' +
                      '  <div class="progress-loader"></div>' +
                      ' </md-dialog-content>' +
                      '</md-dialog>'
        };

        this.showProgressModal = function($event) {
          if (!!$event) {
            _dialogConfig.targetEvent = $event;
          }

          $mdDialog.show(_dialogConfig);
        };

        this.hideProgressModal = function() {
          _dialogConfig.targetEvent = null;
          $mdDialog.hide();
        };
      }
    ]);
}());
