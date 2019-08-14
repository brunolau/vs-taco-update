/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/org.apache.cordova.vibration/client/js/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', 'vibrationPlugin', function(plugins, vibrationPlugin) {
        plugins.registerCommand('Vibration', 'vibrate', vibrationPlugin.vibrate);
        plugins.registerCommand('Vibration', 'cancelVibration', vibrationPlugin.cancelVibration);
        plugins.registerCommand('Vibration', 'vibrateWithPattern', vibrationPlugin.vibrateWithPattern);
    }]);

    return app;
});