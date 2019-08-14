/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins.services')
    .factory('flashlightPlugin', [function() {
        return {
            available: function(obj) {
                return true;
            },
            switchOn: function(obj) {
                obj.scope.$apply(function() {
                    obj.scope.flashlight = true;
                });
            },
            switchOff: function(obj) {
                obj.scope.$apply(function() {
                    obj.scope.flashlight = false;
                });
            }
        };
    }]);

    return app;
});