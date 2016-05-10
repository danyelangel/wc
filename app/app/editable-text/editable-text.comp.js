(function () {
  'use strict';
  angular
    .module('app.editableText', ['angular-medium-editor'])
    .component('editableTextEl', {
      templateUrl: 'app/editable-text/editable-text.tpl.html',
      bindings: {
        // Webcat
        wcData: '<',
        wcClass: '<',

        // Config
        disableExtraSpaces: '<',
        disableReturn: '<',
        toolbarButtons: '<',
        textPlaceholder: '@',

        // State
        disableEditing: '<',

        // Events
        onUpdate: '&'
      },
      controller: ['$scope', '$timeout', Controller]
    });
  function Controller($scope, $timeout) {
    var $ctrl = this;

    $scope.$watch('$ctrl.disableEditing', updateComponent);

    function updateComponent() {
      // Editor Options
      $ctrl.editorOptions = {
        targetBlank: true,

        // Config
        disableExtraSpaces: $ctrl.disableExtraSpaces,
        disableReturn: $ctrl.disableReturn,
        toolbar: $ctrl.disableEditing || !$ctrl.toolbarButtons ? false : {
          buttons: $ctrl.toolbarButtons
        },

        // State
        disableEditing: $ctrl.disableEditing,
        staticToolbar: true
      };

      $ctrl.refreshing = true;
      $timeout(function () {
        $ctrl.refreshing = false;
      });
    }

    // API
    $ctrl.textChanged = textChanged;
    function textChanged() {
      $ctrl.onUpdate()($ctrl.wcData);
    }
  }
}());
