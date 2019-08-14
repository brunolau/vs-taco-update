/*global define */
/*jslint white: true */

define(['angular', 'api/fileReader/js/services', 'api/fileReader/js/directives'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.api.fileReader', [
        'cordovaSimulator.api.fileReader.services',
        'cordovaSimulator.api.fileReader.directives'
    ]);

    return app;
});