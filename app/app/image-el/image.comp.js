(function () {
  'use strict';
  angular
    .module('app.image', ['ngFileUpload', 'firebase'])
    .component('imageEl', {
      bindings: {
        wcData: '<',
        wcState: '<',
        maxSize: '<',
        imgType: '@',
        imgFile: '<',
        onUpdate: '&',
        onRemove: '&'
      },
      transclude: true,
      templateUrl: 'app/image-el/image.tpl.html',
      controller: ['Ospry', 'ImageServer', '$mdDialog', Controller]
    });

  function Controller(Ospry, ImageServer, $mdDialog) {
    var $ctrl = this;

    // API
    $ctrl.update = update;
    $ctrl.remove = remove;
    function upload(file) {
      Ospry.up(file).then($ctrl.onUpdate());
    }
    function update(file) {
      if (file) {
        ImageServer.remove($ctrl.wcData.id);
        $ctrl.wcData = null;
        upload(file);
      } else {
        $mdDialog.show($mdDialog.alert({
          title: 'Attention',
          textContent: 'There was a problem with the upload!',
          ok: 'OK'
        }));
      }
    }
    function remove() {
      ImageServer.remove($ctrl.wcData.id);
      $ctrl.onRemove()();
    }
  }
}());
