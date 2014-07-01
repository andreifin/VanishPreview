'use strict';

/**
 * @ngdoc overview
 * @name previewGruntApp
 * @description
 * # previewGruntApp
 *
 * Main module of the application.
 */
angular
  .module('previewGruntApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider.
       when('/', {
         templateUrl: 'views/main.html', //add the correct path
         controller: 'MainCtrl'
       }).
       when('/links', {
         templateUrl: 'views/links.html', //add the correct path
         controller: 'LinksCtrl' //is it needed?
       }).
       when('/levels', {
         templateUrl: 'views/levelSelect.html', //add the correct path
         controller: 'SelectCtrl'
       }).
       when('/levels/:levelId', {
         templateUrl: 'views/gameview.html', //add the correct path
         controller: 'GameCtrl'
         //levelId goes into $routeParams
       }).
       otherwise({
         redirectTo: '/'
       });
  });
