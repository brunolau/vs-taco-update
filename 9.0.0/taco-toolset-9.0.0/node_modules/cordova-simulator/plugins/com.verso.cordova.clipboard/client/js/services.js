/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins.services')
    .factory('clipboardPlugin', [function() {
        return {
            copy: function(obj, args) {
                obj.scope.clipboard = {
                    text: args[0]
                };
            },
            paste: function(obj) {
                if (obj.scope.clipboard !== undefined) {
                    return obj.scope.clipboard.text;
                } else {
                    return "";
                }
            }
        };
    }]);

    return app;
});