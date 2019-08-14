/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/org.apache.cordova.dialogs/client/js/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', 'dialogsPlugin', function(plugins, dialogsPlugin) {
        plugins.registerCommandWithFunctions('Notification', 'alert', dialogsPlugin.alert);
        plugins.registerCommandWithFunctions('Notification', 'prompt', dialogsPlugin.prompt);
        plugins.registerCommandWithFunctions('Notification', 'confirm', dialogsPlugin.confirm);
        plugins.registerCommand('Notification', 'beep', dialogsPlugin.beep);
    }]);

    return app;
});