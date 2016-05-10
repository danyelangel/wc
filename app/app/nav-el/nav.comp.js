(function () {
  'use strict';

  angular
    .module('app.nav', [])
    .component('navEl', {
      bindings: {
        title: '<',
        lang: '=',
        preview: '='
      },
      templateUrl: 'app/nav-el/nav.tpl.html',
      controller: ['$sce', Controller]
    });

  function Controller($sce) {
    var vm = this;
    vm.html = html;
    function html(input) {
      return $sce.trustAsHtml(input);
    }
  }
}());
