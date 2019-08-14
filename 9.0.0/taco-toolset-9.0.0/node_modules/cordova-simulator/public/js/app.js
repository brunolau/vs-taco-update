/*global define */
/*jslint white: true */

define(['angular', 'app/services', 'app/directives', 'app/filters', 'app/controllers', 'plugins/app'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator', [
        'cordovaSimulator.api',
        'cordovaSimulator.filters',
        'cordovaSimulator.services',
        'cordovaSimulator.directives',
        'cordovaSimulator.controllers',
        'cordovaSimulator.plugins'
    ])
    .run(['configuration', '$rootScope', function(configuration, $rootScope) {
        configuration.load().then(function() {
            $rootScope.appReady = true;
        });
    }]);
    
    return app;
});