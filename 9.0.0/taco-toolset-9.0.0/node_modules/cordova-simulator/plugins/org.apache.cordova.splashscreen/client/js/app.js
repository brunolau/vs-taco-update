/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/org.apache.cordova.splashscreen/client/js/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', 'splashscreenPlugin', function(plugins, splashscreenPlugin) {
        plugins.registerCommand('SplashScreen', 'show', splashscreenPlugin.show);
        plugins.register('SplashScreen', 'custom', splashscreenPlugin.show);
        plugins.registerCommand('SplashScreen', 'hide', splashscreenPlugin.hide);
    }]);

    return app;
});