(function() {
  'use strict';

  angular.module('pub.directives', ['ngAnimate'])
    .directive('pubHexColorInput', pubHexColorInput)
    .directive('pubUnsignedNonZeroFloatInput', pubUnsignedNonZeroFloatInput)
    .directive('pubSignedFloatInput', pubSignedFloatInput)
    .directive('pubUnsignedIntegerInput', pubUnsignedIntegerInput)
    .directive('pubAlphaFloatInput', pubAlphaFloatInput);
  
  function pubHexColorInput() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: (scope, element, attrs, ngModel) => {
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
    };
  }
  
  function pubUnsignedNonZeroFloatInput() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: (scope, element, attrs, ngModel) => {
        ngModel.$parsers.push(function(value) {
          var number = parseFloat(value);

          if (!isNaN(number) && number > 0) {
            ngModel.$setValidity('pubUnsignedNonZeroFloatInput', true);
            return number;
          } else {
            ngModel.$setValidity('pubUnsignedNonZeroFloatInput', false);
            return ngModel.$modelValue;
          }
        });
      }
    };
  }
  
  function pubSignedFloatInput() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: (scope, element, attrs, ngModel) => {
        ngModel.$parsers.push(function(value) {
          var number = parseFloat(value);

          if (!isNaN(number)) {
            ngModel.$setValidity('pubSignedFloatInput', true);
            return number;
          } else {
            ngModel.$setValidity('pubSignedFloatInput', false);
            return ngModel.$modelValue;
          }
        });
      }
    };
  }
  
  function pubUnsignedIntegerInput() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: (scope, element, attrs, ngModel) => {
        ngModel.$parsers.push(function(value) {
          var number = parseFloat(value);

          if (!isNaN(number) && number >= 0 && number % 1 === 0) {
            ngModel.$setValidity('pubUnsignedIntegerInput', true);
            return number;
          } else {
            ngModel.$setValidity('pubUnsignedIntegerInput', false);
            return ngModel.$modelValue;
          }
        });
      }
    };
  }
  
  function pubAlphaFloatInput() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: (scope, element, attrs, ngModel) => {
        ngModel.$parsers.push(function(value) {
          var number = parseFloat(value);

          if (!isNaN(number) && number <= 1 && number >= 0) {
            ngModel.$setValidity('pubAlphaFloatInput', true);
            return number;
          } else {
            ngModel.$setValidity('pubAlphaFloatInput', false);
            return ngModel.$modelValue;
          }
        });
      }
    };
  }

}());
