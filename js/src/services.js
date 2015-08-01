(function() {
  angular.module('pub.services', [])
    .service('pubProgressModal', pubProgressModal);

  function pubProgressModal($mdDialog) {
    const dialogConfig = {
      clickOutsideToClose: false,
      template: `
        <md-dialog class="dialog-progress" aria-label="Working. Please Wait.">
          <md-dialog-content>
            <div class="progress-loader"></div>
          </md-dialog-content>
        </md-dialog>
      `
    };

    this.showProgressModal = function() {
      $mdDialog.show(dialogConfig);
    };

    this.hideProgressModal = function() {
      $mdDialog.hide();
    };
  }

}());
