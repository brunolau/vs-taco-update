/*global define */
/*jslint white: true */

define(['angular', 'api/storage/js/services'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.api.storage', [
        'cordovaSimulator.api.storage.services'
    ]);

    
    return app;
});