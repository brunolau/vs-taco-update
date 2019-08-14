/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/org.apache.cordova.battery-status/client/js/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', 'batterystatusPlugin', function(plugins, batterystatusPlugin) {
        plugins.registerCommandWithFunctions('Battery', 'start', batterystatusPlugin.start);
        plugins.registerCommand('Battery', 'stop', batterystatusPlugin.stop);
    }]);

    return app;
});