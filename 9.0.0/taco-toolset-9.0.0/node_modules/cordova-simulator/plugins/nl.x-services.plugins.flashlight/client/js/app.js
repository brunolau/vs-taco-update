/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/nl.x-services.plugins.flashlight/client/js/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', 'flashlightPlugin', function(plugins, flashlightPlugin) {
        plugins.registerCommand('Flashlight', 'available', flashlightPlugin.available);
        plugins.registerCommand('Flashlight', 'switchOn', flashlightPlugin.switchOn);
        plugins.registerCommand('Flashlight', 'switchOff', flashlightPlugin.switchOff);
    }]);

    return app;
});