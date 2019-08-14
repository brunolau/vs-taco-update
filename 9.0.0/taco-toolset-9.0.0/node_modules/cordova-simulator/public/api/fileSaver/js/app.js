/*global define */
/*jslint white: true */

define(['angular', 'api/fileSaver/js/services'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.api.fileSaver', [
        'cordovaSimulator.api.fileSaver.services'
    ]);

    return app;
});