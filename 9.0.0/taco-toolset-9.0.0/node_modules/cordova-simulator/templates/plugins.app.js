/*global define */
/*jslint white: true */

define(['angular', 'plugins/app', 'plugins/{{ id }}/client/js/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins')
    .run(['plugins', '{{ name }}Plugin', function(plugins, {{ name }}Plugin) {
        //plugins.registerCommand('service', 'method', {{ name }}Plugin.method);
    }]);

    return app;
});