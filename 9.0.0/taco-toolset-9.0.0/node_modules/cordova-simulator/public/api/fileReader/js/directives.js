/*global define */
/*jslint white: true */

define(['angular', 'jquery', 'api/fileReader/js/services'], function(angular, $) {
    'use strict';

    var app = angular.module('cordovaSimulator.api.fileReader.directives', [
        'cordovaSimulator.api.fileReader.services'
    ])
    .directive('inputFile', ['fileReaderApi', function(api) {
        return {
            restrict: 'A',
            scope: {
                inputFile: '=inputFile'
            },
            link: function(scope, element, attrs) {
                var input = $('<input type="file"></input>').css({
                    "display": 'none'
                });

                if (attrs.multiple !== undefined) {
                    input.attr("multiple", "");
                }

                input.change(function(e) {
                    api.read(e, scope.inputFile);
                });

                $(element).after(input);

                $(element).click(function () {
                    input.focus().click();
                });
            }
        };
    }]);

    return app;
});