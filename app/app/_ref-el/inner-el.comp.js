(function () {
  'use strict';

  angular
    .module('app.innerEl', [])
    .component('innerEl', innerEl());

  function innerEl() {
    return {
      bindings: {},
      templateUrl: 'app/inner-el/inner-el.tpl.html',
      controller: ['$scope',
      function ($scope) {
        var $ctrl = this;
        console.log($ctrl, $scope);
      }]
    };
  }
}());
