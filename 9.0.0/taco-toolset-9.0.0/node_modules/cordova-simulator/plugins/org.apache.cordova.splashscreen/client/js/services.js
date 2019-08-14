/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins.services')
    .factory('splashscreenPlugin', ['$templateCache', '$timeout', function($templateCache, $timeout) {
        $templateCache.put('splashscreen', '<img ng-src="{{widget.splashscreen}}" ng-style="{} | widgetStyle:(bounds | deviceOrientation:isLandscape)">');
        
        return {
            show: function(obj, args) {
                if (obj.app.splashScreen !== undefined) {
                    var opts = {
                            template: 'splashscreen',
                            splashscreen: obj.app.splashScreen,
                            backdrop: true
                        };

                    obj.scope.$apply(function() {
                        obj.scope.showWidget(opts);
                        obj.iframe.fadeTo(0, 0);
                    });
                    
                    $timeout(function () {
                        obj.scope.$apply(function() {
                            obj.scope.removeWidget();
                            obj.iframe.fadeTo(0, 1);
                        });
                    }, obj.app.splashScreenDelay || 3000);
                }
            },
            hide: function(obj, args) {
                if (obj.app.splashscreen !== undefined && obj.scope.widget !== undefined) {
                    obj.scope.$apply(function() {
                        obj.scope.removeWidget();
                        obj.iframe.fadeTo(0, 1);
                    });
                }
            }
        };
    }]);

    return app;
});