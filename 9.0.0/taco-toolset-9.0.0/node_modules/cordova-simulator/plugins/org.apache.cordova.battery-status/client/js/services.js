/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins.services')
    .factory('batterystatusPlugin', [function() {
        return {
            start: function(obj, success, fail, args) {
                obj.scope.batteryWatcher = obj.scope.$watch('battery', function(value) {
                    success({level: value, isPlugged: obj.scope.isPlugged});
                });
                
                obj.scope.isPluggedWatcher = obj.scope.$watch('isPlugged', function(value) {
                    success({level: value, isPlugged: obj.scope.isPlugged});
                });
            },
            stop: function(obj) {
                if (obj.scope.batteryWatcher !== undefined) {
                    obj.scope.batteryWatcher();
                }
                
                if (obj.scope.isPluggedWatcher !== undefined) {
                    obj.scope.isPluggedWatcher();
                }
            }
        };
    }]);

    return app;
});