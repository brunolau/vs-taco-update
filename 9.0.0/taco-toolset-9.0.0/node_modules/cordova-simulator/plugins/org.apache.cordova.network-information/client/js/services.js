/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins.services')
    .factory('networkinfoPlugin', [function() {
        return {
            getConnectionInfo: function(obj, success, fail, args) {
                obj.scope.$watch('currNet', function(value) {
                    success(value);
                });
                
                success(obj.scope.currNet);
            }
        };
    }]);

    return app;
});