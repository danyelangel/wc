(function () {
  'use strict';

  angular
    .module('app.colorPicker', [])
    .component('colorPicker', {
      bindings: {
        // Input Data
        wcData: '',
        // Component Events
        onRemove: '&'
      },
      templateUrl: 'app/color-picker/color-picker.tpl.html',
      controller: [Controller]
    });

  function Controller() {
  }
}());
