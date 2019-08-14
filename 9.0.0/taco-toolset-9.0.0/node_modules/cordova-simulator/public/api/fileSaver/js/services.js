/*global define */
/*jslint white: true */

define(['angular', 'saveAs', 'Blob'], function(angular, saveAs, Blob) {
    'use strict';

    var app = angular.module('cordovaSimulator.api.fileSaver.services', [])
    .factory('fileSaverApi', [function() {
        return {
            save: function(name, text) {
                var blob = new Blob([text], {type: "text/plain;charset=utf-8"});

                saveAs(blob, name);
            }
        };
    }]);

    return app;
});