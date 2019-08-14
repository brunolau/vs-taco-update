/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/org.apache.cordova.device/client/js/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', 'devicePlugin', function(plugins, devicePlugin) {
        plugins.registerCommand('Device', 'getDeviceInfo', devicePlugin.getDeviceInfo);
    }]);

    return app;
});