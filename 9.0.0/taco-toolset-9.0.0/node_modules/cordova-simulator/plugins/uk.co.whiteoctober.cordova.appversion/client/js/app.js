/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/uk.co.whiteoctober.cordova.appversion/client/js/services'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', 'appVersionPlugin', function(plugins, appVersionPlugin) {
        plugins.registerCommand('AppVersion', 'getVersionNumber', appVersionPlugin.getAppVersion);
    }]);

    return app;
});