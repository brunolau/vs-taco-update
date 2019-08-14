/*global define */
/*jslint white: true */

define(['angular', 'api/server/js/services'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.api.server', [
        'cordovaSimulator.api.server.services'
    ]);

    return app;
});