(function () {
  'use strict';

  angular
    .module('webcat.array', ['Tao'])
    .component('wcArray', {
      bindings: {
        // Input Data
        arrayId: '<',
        // Children Events
        onChildAdd: '&',
        onChildRemove: '&',
        onChildUpdate: '&'
      },
      templateUrl: 'app/wc-array/array.tpl.html',
      controller: [Controller]
    });

  function Controller() {
  }
}());
