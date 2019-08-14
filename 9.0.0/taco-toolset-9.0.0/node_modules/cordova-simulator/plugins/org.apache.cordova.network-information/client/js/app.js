/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/org.apache.cordova.network-information/client/js/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', 'networkinfoPlugin', function(plugins, networkinfoPlugin) {
        plugins.registerCommandWithFunctions('NetworkStatus', 'getConnectionInfo', networkinfoPlugin.getConnectionInfo);
    }]);

    return app;
});