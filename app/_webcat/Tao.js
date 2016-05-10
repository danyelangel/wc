(function () {
  'use strict';

  angular
    .module('Webcat.Tao', ['firebase'])
    .service('Tao', Service)
    .constant('ChannelDefaults', {
      exists: true
    });

  function Service($window, $q, $firebaseObject, $firebaseArray, ChannelDefaults) {
    var self = this;

    // Properties
    self.childrenArrays = {};

    // API
    self.getChannel = getChannel;
    self.getChildren = getChildren;
    self.getRoot = getRoot;
    self.removeChannel = removeChannel;
    self.addChannel = addChannel;
    self.updateChannel = updateChannel;

    function getChannel(channelId) {
      var obj;
      if (angular.isDefined(channelId)) {
        obj = self.channels.$getRecord(channelId);
      } else {
        throw Error('Could not get channel because channel is not defined');
      }
      return obj;
    }
    function getChildren(channelId) {
      var ref = self.ref
                    .child('channels')
                    .child(channelId)
                    .child('children'),
          children = {},
          array;

      self.childrenArrays[channelId] = $firebaseArray(ref);
      array = self.childrenArrays[channelId];
      array.$loaded(updateArray);
      array.$watch(updateArray);

      function updateArray() {
        angular.forEach(children, function (value, key) {
          delete children[key];
        });
        angular.forEach(array, function (value) {
          children[value.$id] = getChannel(value.$value);
        });
      }
      return children;
    }
    function getRoot(rootRef) {
      return $q(function (resolve, reject) {
        var root, obj;
        self.ref = new $window.Firebase(rootRef);
        self.channels = $firebaseArray(self.ref.child('channels'));
        root = $firebaseObject(self.ref.child('root'));
        root.$loaded()
          .then(function () {
            if (angular.isDefined(root.$value)) {
              obj = getChannel(root.$value);
              resolve(obj);
            } else {
              reject('No root id found');
            }
          })
          .catch(function (error) {
            reject(error);
          });
      });
    }
    function removeChannel(key, channelObj) {
      var channelId = channelObj.children[key],
          keyRecord = self.childrenArrays[channelObj.$id].$getRecord(key);
      self.childrenArrays[channelObj.$id].$remove(keyRecord).then(function () {
        getChannelObj(channelId).$remove();
      });
    }
    function addChannel(channelObj) {
      var deferred = $q.defer();
      createChannel().then(function (ref) {
        self
          .childrenArrays[channelObj.$id]
          .$add(ref.key())
          .then(deferred.resolve);
      });
      return deferred.promise;
    }
    function updateChannel(channelId, channelObj) {
      var obj = getChannelObj(channelId);
      angular.forEach(channelObj, function (value, key) {
        obj[key] = value;
      });
      obj.$save();
    }

    // Private functions
    function getChannelObj(channelId) {
      var ref = self.ref
                    .child('channels')
                    .child(channelId);
      return $firebaseObject(ref);
    }
    function createChannel() {
      var deferred = $q.defer(),
          defaults = ChannelDefaults;
      self
        .channels
        .$add(defaults)
        .then(deferred.resolve)
        .catch(deferred.reject);
      return deferred.promise;
    }
  }
}());
