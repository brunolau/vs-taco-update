/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins.services')
    .factory('actionsheetPlugin', [function() {
        return {
            show: function(obj, success, fail, args) {
                obj.scope.$apply(function() {
                    var opts = {
                        template: 'partials/actionsheet.html',
                        close: function(index) {
                            obj.scope.removeWidget();
                            success(index);
                        },
                        backdrop: true
                    };
                    
                    if(obj.device.preset.platform === "ios") {
                        opts.margin = "0 0 10px 0";
                        opts.location = "bottom";
                    }
                    
                    angular.forEach(args[0], function(option, name) {
                        opts[name] = option;
                    });
                    
                    obj.scope.showWidget(opts);
                });
            },
            hide: function(obj, args) {
                
            }
        };
    }]);

    return app;
});