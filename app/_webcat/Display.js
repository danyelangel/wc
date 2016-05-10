(function () {
  'use strict';

  angular
    .module('Webcat.Display', [])
    .service('Display', Service);

  function Service() {
    var self = this;
    self.computedStyle = computedStyle;
    self.computedClass = computedClass;
    function computedStyle(defaults, options) {
      var styl = {};
      if (angular.isObject(defaults) && angular.isObject(options)) {
        styl = angular.extend(styl, defaults.styles, options.styles);
      } else if (angular.isObject(defaults)) {
        styl = defaults.styles;
      } else {
        styl = {};
      }
      return styl;
    }
    function computedClass(defaults, options) {
      var clss = [],
          temp = {};
      if (angular.isObject(options) && angular.isObject(defaults)) {
        angular.extend(temp, defaults.classes, options.classes);
        angular.forEach(temp, function (val) {
          clss.push(val);
        });
      } else if (angular.isObject(defaults)) {
        angular.forEach(defaults.classes, function (val) {
          clss.push(val);
        });
      } else {
        clss = [];
      }
      return clss;
    }
  }
}());
