/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins.services')
    .factory('devicePlugin', [function() {
        return {
            getDeviceInfo: function(obj) {
                return {
                    platform: obj.device.preset.platform,
                    version: obj.device.preset.platformVersion,
                    uuid: '1A2FDEF0-C09D-4DB4-A8BE-7EC2F4A6E49A',
                    model: obj.device.preset.model
                };
            }
        };
    }]);

    return app;
});