/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.plugins', [
        'cordovaSimulator.plugins.services'
    ])
    .run(['plugins', 'platformClass', 'reload', function(plugins, platformClass, reload) {
        plugins.register('platformClass', 'custom', platformClass);
        plugins.register('reload', 'custom', reload);
    }]);

    return app;
});