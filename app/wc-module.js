(function () {
  'use strict';

  /* @ngdoc object
   * @name candyflipPortfolio
   * @description
   *
   */
  angular
    .module('wc', [
      // External dependencies
      'ngMaterial',
      // Private dependencies
      'Webcat',
      // Components
      'app'
    ])
    .config(function ($mdThemingProvider) {
      $mdThemingProvider.theme('default')
      .primaryPalette('grey', {
        default: '900'
      })
      .accentPalette('grey', {
        default: '50'
      });
      $mdThemingProvider.theme('dark')
      .primaryPalette('grey', {
        default: '900'
      })
      .accentPalette('grey', {
        default: '900'
      }).dark();
      $mdThemingProvider.theme('bright')
      .primaryPalette('grey', {
        default: '50'
      })
      .accentPalette('grey', {
        default: '50'
      });
    });
}());
