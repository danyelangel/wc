(function () {
  'use strict';
  angular
    .module('Webcat.Image', ['firebase'])
    .service('Ospry', Ospry)
    .service('ImageServer', Server)
    .constant('OspryKey', 'pk-test-kaarg39s4uyqrlkqx6aiu00g')
    .constant('ImageFirebase', 'https://webcat.firebaseio.com/ospry');

  function Ospry($window, OspryKey, ImageServer, $q) {
    var self = this,
        ospry = new $window.Ospry(OspryKey);
    // API
    self.up = up;
    function up(file) {
      var deferred = $q.defer();
      ospry.up({
        files: [file],
        imageReady: imageReady
      });
      return deferred.promise;
      function imageReady(err, metadata) {
        if (err) {
          deferred.reject();
        } else {
          ImageServer.claim(metadata.id).then(function () {
            deferred.resolve(metadata);
          });
        }
      }
    }
  }

  function Server($window, ImageFirebase, $firebaseArray, $q) {
    var self = this,
        ref = new $window.Firebase(ImageFirebase),
        removeArray = $firebaseArray(ref.child('remove')),
        claimArray = $firebaseArray(ref.child('claim'));
    // API
    self.remove = remove;
    self.claim = claim;
    function remove(id) {
      var deferred = $q.defer();
      fbAdd(removeArray, id, deferred);
      return deferred.promise;
    }
    function claim(id) {
      var deferred = $q.defer();
      fbAdd(claimArray, id, deferred);
      return deferred.promise;
    }
    function fbAdd(array, data, deferred) {
      array
        .$add(data)
        .then(deferred.resolve)
        .catch(deferred.reject);
    }
  }
}());
