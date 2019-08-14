/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins.services')
    .factory('vibrationPlugin', ['$timeout', function($timeout) {
        return {
            vibrate: function(obj, args) {
                if (obj.scope.vibration !== undefined) {
                    $timeout.cancel(obj.scope.vibration);
                }
                
                obj.iframe.addClass("shake shake-constant");
                
                obj.scope.vibration = $timeout(function() {
                    obj.iframe.removeClass("shake shake-constant");
                }, args[0]);
            },
            cancelVibration: function(obj) {
                if (obj.scope.vibration !== undefined) {
                    $timeout.cancel(obj.scope.vibration);
                }
                
                obj.iframe.removeClass("shake shake-constant");
            },
            vibrateWithPattern: function(obj, args) {
                if (obj.scope.vibration !== undefined) {
                    $timeout.cancel(obj.scope.vibration);
                }
                
                args[1] = args[1] === -1 ? 1 : args[1];
                
                var i = 0,
                    j = 0;
                
                function calcNext() {
                    if (j < args[1]) {
                        if (i < (args[0].length)) {
                            return args[0][i++];
                        } else {
                            j++;
                            i=0;
                            return calcNext();
                        }
                    } else {
                        return -1;
                    }
                }
                
                function wait(duration) {
                    var next = calcNext();
                    
                    obj.scope.vibration = $timeout(function() {
                        if (next !== -1) {
                            vib(next);
                        }
                    }, duration);
                }
                
                function vib(duration) {
                    obj.iframe.addClass("shake shake-constant");
                    
                    var next = calcNext();
                    
                    obj.scope.vibration = $timeout(function() {
                        obj.iframe.removeClass("shake shake-constant");
                        
                        if (next !== -1) {
                            wait(next);
                        }
                    }, duration);
                    
                }
                
                vib(calcNext());
            }
        };
    }]);

    return app;
});