(function() {
  'use strict';

  var pub = angular.module('pub.directives', ['ngAnimate']);

  pub.directive('pubHexColorInput', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
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

  pub.directive('pubUnsignedNonZeroFloatInput', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
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
    }
  });

  pub.directive('pubSignedFloatInput', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
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
    }
  });

  pub.directive('pubUnsignedIntegerInput', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
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
    }
  });

  pub.directive('pubAlphaFloatInput', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
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
    }
  });

  pub.directive('pubModalAbout', function() {
    return {
      templateUrl: '/views/directives/about.html'
    }
  });

  pub.directive('pubModalLogin', function() {
    return {
      templateUrl: '/views/directives/login.html'
    }
  });

  pub.directive('pubModalUser', function() {
    return {
      templateUrl: '/views/directives/user.html'
    }
  });

  pub.directive('pubModalUserError', function() {
    return {
      templateUrl: '/views/directives/user-error.html'
    }
  })

  pub.directive('shakeThat', ['$animate', function($animate) {
    return {
      require: '^form',
      scope: {
        submit: '&',
        submitted: '=',
        authSuccess: '='
      },
      link: function(scope, element, attrs, form) {
        // listen on submit event
        element.on('submit', function() {
          // tell angular to update scope
          scope.$apply(function() {
            // everything ok -> call submit fn from controller
            if (form.$valid) return scope.submit();
            // show error messages on submit
            scope.submitted = true;
            // shake that form
            $animate.addClass(element, 'shake', function() {
              $animate.removeClass(element, 'shake');
            });
          });
        });

        scope.$watch('authSuccess', function() {
          if (scope.authSuccess === false) {
            // shake that form
            $animate.addClass(element, 'shake', function() {
              $animate.removeClass(element, 'shake');
              scope.authSuccess = null
            });
          }
        })
      }
    };
  }])

}());
