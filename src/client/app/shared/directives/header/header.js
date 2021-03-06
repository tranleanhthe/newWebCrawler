(function () {
  'use strict';

  angular.module('app')
    .directive('myHeader', myHeader);

  /* @ngInject */
  function myHeader() {
    var directive = {
      restrict: 'EA',
      controllerAs: 'vm',
      scope: {},
      templateUrl: 'app/shared/directives/header/header.html'
    };
    return directive;
  }
})();
