/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.plugins.services')
    .factory('appVersionPlugin', [function() {
        return {
            getAppVersion: function(obj) {
                return obj.app.version;
            }
        };
    }]);
    
    return app;
});