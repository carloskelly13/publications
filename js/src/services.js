(function() {
  'use strict';

  angular.module('pub.services', [])
    .service('pubProgressModal', pubProgressModal);
    
  function pubProgressModal($mdDialog) {
    var _dialogConfig = {
      clickOutsideToClose: false,
      template: `<md-dialog class="dialog-progress" aria-label="Working. Please Wait.">
                  <md-dialog-content>
                    <div class="progress-loader"></div>
                  </md-dialog-content>
                </md-dialog>`
    };

    this.showProgressModal = ($event) => {
      if (!!$event) {
        _dialogConfig.targetEvent = $event;
      }

      $mdDialog.show(_dialogConfig);
    };

    this.hideProgressModal = () => {
      _dialogConfig.targetEvent = null;
      $mdDialog.hide();
    };
  }
  
}());
