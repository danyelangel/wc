(function () {
  'use strict';

  angular
    .module('app.card', ['app.image', 'ngFileUpload'])
    .component('cardEl', {
      bindings: {
        // Input Data
        wcData: '<',
        wcDisplay: '<',
        wcDisplayDefault: '<',
        wcState: '<',
        // Component Events
        onRemove: '&',
        onUpdate: '&'
      },
      templateUrl: 'app/card-el/card.tpl.html',
      controller: ['$sce', 'Display', 'Ospry', Controller]
    });

  function Controller($sce, Display, Ospry) {
    var $ctrl = this;
    // Constructor
    if (angular.isObject($ctrl.state)) {
      $ctrl.lang = $ctrl.wcState.lang;
    }
    $ctrl.display = {
      styles: Display.computedStyle($ctrl.wcDisplayDefault, $ctrl.wcDisplay),
      classes: Display.computedClass($ctrl.wcDisplayDefault, $ctrl.wcDisplay)
    };
    // API
    $ctrl.html = html;
    $ctrl.updateImage = updateImage;
    $ctrl.removeImage = removeImage;
    $ctrl.uploadImage = uploadImage;
    $ctrl.updateData = updateData;
    function html(input) {
      return $sce.trustAsHtml(input);
    }
    function uploadImage(file) {
      $ctrl.wcData.img = {};
      Ospry.up(file).then(updateImage);
    }
    function removeImage() {
      if (!angular.isObject($ctrl.wcData.img)) {
        $ctrl.wcData.img = {};
      }
      $ctrl.wcData.img.metadata = null;
      $ctrl.onUpdate()($ctrl.wcData, 'data');
    }
    function updateImage(metadata) {
      $ctrl.wcData.img.metadata = metadata;
      $ctrl.onUpdate()($ctrl.wcData, 'data');
    }
    function updateData(property) {
      return function (data) {
        if (!angular.isObject($ctrl.wcData)) {
          $ctrl.wcData = {};
        }
        if (!angular.isObject($ctrl.wcData[property])) {
          $ctrl.wcData[property] = {};
        }
        $ctrl.wcData[property][$ctrl.wcState.lang] = data;
        $ctrl.onUpdate()($ctrl.wcData, 'data');
      };
    }
  }
}());
