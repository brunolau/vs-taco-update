/*global define, Audio */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';
    
    var app = angular.module('cordovaSimulator.plugins.services')
    .factory('dialogsPlugin', ['$timeout', function($timeout) {
        return {
            alert: function(obj, success, fail, args) {
                obj.scope.$apply(function() {
                    obj.scope.showWidget({
                        template: 'partials/dialogs-alert.html',
                        title: args[1],
                        message: args[0],
                        button: args[2],
                        backdropCb: success,
                        close: function() {
                            obj.scope.removeWidget();
                            success();
                        },
                        backdrop: true
                    });
                });
            },
            confirm: function(obj, success, fail, args) {
                function callback(index) {
                    success(index === undefined ? 0 : index);
                }
                
                obj.scope.$apply(function() {
                    obj.scope.showWidget({
                        template: 'partials/dialogs-confirm.html',
                        title: args[1],
                        message: args[0],
                        buttons: args[2],
                        backdropCb: callback,
                        close: function(index) {
                            obj.scope.removeWidget();
                            callback(index);
                        },
                        backdrop: true
                    });
                });
            },
            prompt: function(obj, success, fail, args) {
                function callback(index, text) {
                    success({
                        buttonIndex: index === undefined ? 0 : index,
                        input1: text
                    });
                }
                
                obj.scope.$apply(function() {
                    obj.scope.showWidget({
                        template: 'partials/dialogs-prompt.html',
                        title: args[1],
                        message: args[0],
                        buttons: args[2],
                        defaultText: args[3],
                        backdropCb: callback,
                        close: function(index, text) {
                            obj.scope.removeWidget();
                            callback(index, text);
                        },
                        backdrop: true
                    });
                });
            },
            beep: function(obj, args) {
                var audio = new Audio('resources/beep.mp3'),
                    i = args[0];
                
                function play() {
                    audio.play();
                    i--;
                    if (i > 0) {
                     $timeout(play, 1000);
                    }
                }
                
                if (i > 0) {
                    play();
                }
            }
        };
    }]);

    return app;
});