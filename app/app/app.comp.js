(function () {
  'use strict';

  angular
    .module('app', [
      'app.nav',
      'app.slide',
      'app.editableText'
    ])
    .component('appEl', {
      bindings: {
        ref: '@'
      },
      templateUrl: 'app/app.tpl.html',
      controller: ['Lang', 'Tao', AppEl]
    });

  function AppEl(Lang, Tao) {
    var $ctrl = this;

    // Constructor
    $ctrl.lang = Lang.current;
    $ctrl.preview = false;
    Tao.getRoot($ctrl.ref).then(function (obj) {
      $ctrl.root = obj;
      $ctrl.rootChildren = Tao.getChildren(obj.$id);
    });

    // API
    // - Tao
    $ctrl.getChannel = Tao.getChannel;
    $ctrl.updateData = updateData;
    // - Slides
    $ctrl.addSlide = addSlide;
    $ctrl.removeSlide = removeSlide;
    $ctrl.updateSlide = updateSlide;

    function removeSlide(channelKey) {
      return function () {
        Tao.removeChannel(channelKey, $ctrl.root);
      };
    }
    function updateSlide(channelKey) {
      return function (data, property) {
        var channelId = $ctrl.rootChildren[channelKey].$id;
        $ctrl.rootChildren[channelKey][property] = data;
        Tao.updateChannel(channelId, $ctrl.rootChildren[channelKey]);
      };
    }
    function addSlide() {
      $ctrl.addingSlide = true;
      Tao.addChannel($ctrl.root).then(function () {
        $ctrl.addingSlide = false;
      });
    }
    function updateData(property) {
      return function (data) {
        if (!angular.isObject($ctrl.root.data)) {
          $ctrl.root.data = {};
        }
        if (!angular.isObject($ctrl.root.data[property])) {
          $ctrl.root.data[property] = {};
        }
        $ctrl.root.data[property][$ctrl.lang] = data;
        Tao.updateChannel($ctrl.root.$id, $ctrl.root);
      };
    }
  }
}());
