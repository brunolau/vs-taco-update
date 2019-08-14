/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/nl.x-services.plugins.actionsheet/client/js/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', 'actionsheetPlugin', function(plugins, actionsheetPlugin) {
        plugins.registerCommandWithFunctions('ActionSheet', 'show', actionsheetPlugin.show);
        plugins.registerCommand('ActionSheet', 'hide', actionsheetPlugin.hide);
    }]);

    return app;
});