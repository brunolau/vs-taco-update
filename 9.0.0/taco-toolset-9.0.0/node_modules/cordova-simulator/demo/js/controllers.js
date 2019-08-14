angular.module('demo.controllers', [])
.controller('pluginsListController', function($scope, pluginsList) {
    $scope.plugins = pluginsList;
});