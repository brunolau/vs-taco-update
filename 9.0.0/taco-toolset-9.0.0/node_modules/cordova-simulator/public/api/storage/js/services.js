/*global define */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.api.storage.services', [])
    .factory('storageApi', ['$window', function($window) {
        return {
            get: function(key) {
                if ($window.localStorage[key] !== undefined) {
                    return JSON.parse($window.localStorage[key]);
                }
                else {
                    return null;
                }
            },
            set: function(key, val) {
                $window.localStorage[key] = JSON.stringify(val);
            }
        };
                
    }]);

    return app;
});