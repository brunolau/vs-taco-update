/*global define */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    angular.module('cordovaSimulator.controllers', [])
    .controller('mainController', ['$scope', '$rootScope', '$location', 'configuration', '$http', function($scope, $rootScope, $location, configuration, $http) {
        $scope.save = configuration.save;
        $scope.reset = configuration.reset;
        $scope.loadFromGist = configuration.loadFromGist;

        $scope.exportConfiguration = configuration.exportConfiguration;
        $scope.importConfiguration = function(files) {
            configuration.importConfiguration(JSON.parse(files[0].content));        
        };
        
        $scope.setApp = function(app) {
            $rootScope.currApp = app;
        };
    }]);
});