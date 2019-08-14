/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/com.verso.cordova.clipboard/client/js/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', 'clipboardPlugin', function(plugins, clipboardPlugin) {
        plugins.registerCommand('Clipboard', 'copy', clipboardPlugin.copy);
        plugins.registerCommand('Clipboard', 'paste', clipboardPlugin.paste);
    }]);

    return app;
});