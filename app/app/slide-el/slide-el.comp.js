(function () {
  'use strict';

  angular
    .module('app.slide', ['ngFileUpload', 'app.card', 'app.image'])
    .component('slideEl', {
      bindings: {
        // Input Data
        wcData: '<',
        wcDisplay: '<',
        wcDisplayDefault: '<',
        wcState: '<',
        wcChildChannel: '<',
        // Component Events
        onRemove: '&',
        onUpdate: '&',
        // Children Events (TO DO)
        onChildAdd: '&',
        onChildRemove: '&',
        onChildUpdate: '&'
      },
      templateUrl: 'app/slide-el/slide.tpl.html',
      controller: ['$sce', 'Display', '$mdDialog', 'Ospry', 'ImageServer', Controller]
    });

  function Controller($sce, Display, $mdDialog, Ospry, ImageServer) {
    var $ctrl = this;
    // Constructor
    if (angular.isObject($ctrl.state)) {
      $ctrl.lang = $ctrl.state.lang;
    }
    $ctrl.Display = Display;
    $ctrl.display = {
      styles: Display.computedStyle($ctrl.wcDisplayDefault, $ctrl.wcDisplay),
      classes: Display.computedClass($ctrl.wcDisplayDefault, $ctrl.wcDisplay)
    };

    // API
    // - Data
    $ctrl.remove = remove;
    $ctrl.updateCard = updateCard;
    $ctrl.updateBackgroundImage = updateBackgroundImage;
    $ctrl.removeBackground = removeBackground;
    // - Styles
    $ctrl.updateBackgroundColor = updateBackgroundColor;
    $ctrl.updateTextColor = updateTextColor;
    $ctrl.updateBlur = updateBlur;
    $ctrl.getParallax = getParallax;
    $ctrl.getBlur = getBlur;
    function remove() {
      var confirm = $mdDialog.confirm()
          .title('Are you sure?')
          .textContent('This action can not be undonde')
          .ok('Ok')
          .cancel('Cancel');
      $mdDialog.show(confirm).then(function () {
        $ctrl.onRemove()();
      });
    }
    function updateCard(data, property) {
      $ctrl.onUpdate()(data, property);
    }
    function updateBackgroundColor() {
      var confirm = $mdDialog.prompt()
          .title('Color Picker')
          .textContent('Use any CSS supported color format.')
          .placeholder($ctrl.display.styles.backgroundColor)
          .ok('Ok')
          .cancel('Cancel');
      $mdDialog.show(confirm).then(function (result) {
        if (!angular.isObject($ctrl.wcDisplay)) {
          $ctrl.wcDisplay = {
            styles: {}
          };
        }
        if (!angular.isObject($ctrl.wcDisplay.styles)) {
          $ctrl.wcDisplay.styles = {};
        }
        $ctrl.wcDisplay.styles.backgroundColor = result;
        $ctrl.onUpdate()($ctrl.wcDisplay, 'display');
      });
    }
    function updateTextColor() {
      var confirm = $mdDialog.prompt()
          .title('Color Picker')
          .textContent('Use any CSS supported color format.')
          .placeholder($ctrl.display.styles.color)
          .ok('Ok')
          .cancel('Cancel');
      $mdDialog.show(confirm).then(function (result) {
        if (!angular.isObject($ctrl.wcDisplay)) {
          $ctrl.wcDisplay = {
            styles: {}
          };
        }
        $ctrl.wcDisplay.styles.color = result;
        $ctrl.onUpdate()($ctrl.wcDisplay, 'display');
      });
    }
    function updateBackgroundImage(file) {
      if (angular.isObject($ctrl.wcData)) {
        if (angular.isObject($ctrl.wcData.background)) {
          if (angular.isObject($ctrl.wcData.background.metadata)) {
            ImageServer.remove($ctrl.wcData.background.metadata.id);
          }
        }
      }
      Ospry.up(file).then(updateImage);
    }
    function removeBackground() {
      ImageServer.remove($ctrl.wcData.background.metadata.id);
      $ctrl.wcData.background = null;
      $ctrl.onUpdate()($ctrl.wcData, 'data');
    }
    function updateImage(metadata) {
      if (!angular.isObject($ctrl.wcData.background)) {
        $ctrl.wcData.background = {};
      }
      $ctrl.wcData.background.metadata = metadata;
      $ctrl.onUpdate()($ctrl.wcData, 'data');
    }
    function updateBlur() {
      if (!angular.isObject($ctrl.wcDisplay)) {
        $ctrl.wcDisplay = {
          properties: {}
        };
      }
      if (!angular.isObject($ctrl.wcDisplay.properties)) {
        $ctrl.wcDisplay.properties = {};
      }
      $ctrl.slider = {
        current: 'blur',
        onChange: blurChange,
        value: $ctrl.wcDisplay.properties.blur || 0
      };
      function blurChange(value) {
        $ctrl.wcDisplay.properties.blur = value;
        $ctrl.onUpdate()($ctrl.wcDisplay, 'display');
      }
    }
    function getParallax(isTop) {
      var value;
      if (!angular.isObject($ctrl.wcDisplay)) {
        $ctrl.wcDisplay = {
          properties: {}
        };
      }
      if (!angular.isObject($ctrl.wcDisplay.properties)) {
        $ctrl.wcDisplay.properties = {};
      }
      if (angular.isNumber($ctrl.wcDisplay.properties.depth)) {
        value = 14 * $ctrl.wcDisplay.properties.depth;
      } else {
        value = 0;
      }
      if (!isTop) {
        value = -value;
      }
      return 'transform: translateY(' + value + 'vh)';
    }
    function getBlur() {
      var value;
      if (!angular.isObject($ctrl.wcDisplay)) {
        $ctrl.wcDisplay = {
          properties: {}
        };
      }
      if (!angular.isObject($ctrl.wcDisplay.properties)) {
        $ctrl.wcDisplay.properties = {};
      }
      if (angular.isNumber($ctrl.wcDisplay.properties.blur)) {
        value = 3 * $ctrl.wcDisplay.properties.blur;
      } else {
        value = 10;
      }
      return 'blur(' + value + 'px)';
    }
  }
}());
