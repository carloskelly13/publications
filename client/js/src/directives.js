(function() {
  'use strict';

  var pub = angular.module('pub.directives', []);
  
  pub.directive('hexColorInput', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {        
        // View -> Model      
        ngModel.$parsers.push(function(value) {
          if (value.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
            ngModel.$setValidity('hexColorInput', true);
            return value;
          } else {
            ngModel.$setValidity('hexColorInput', false);
            return ngModel.$modelValue;
          }
        });
      }
    }
  });

}());