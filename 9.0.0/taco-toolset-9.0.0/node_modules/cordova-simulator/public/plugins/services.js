/*global define, FileReader */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.plugins.services', [])
    .factory('plugins', ['$q', function($q) {
        var actions = {},
            directPlugins = {},
            customPlugins = {};
        
        return {
            register: function(plugin, type, fn) {
                if (type === "direct") {
                    directPlugins[plugin] = fn;
                } else if (type === "custom") {
                    customPlugins[plugin] = fn;
                }
            },
            wire: function(obj, cordova) {
                angular.forEach(directPlugins, function(plugin, name) {
                    cordova.define(name, plugin);
                });
                
                angular.forEach(customPlugins, function(plugin, name) {
                    plugin(obj);
                });
            },
            registerCommand: function(plugin, method, fn) {
                if (actions[plugin] === undefined) {
                    actions[plugin] = {};
                }
                
                actions[plugin][method] = {fn: fn};
            },
            registerCommandWithFunctions: function(plugin, method, fn) {
                if (actions[plugin] === undefined) {
                    actions[plugin] = {};
                }
                
                actions[plugin][method] = {fn: fn, functions: true};
            },
            execCommand: function(obj, success, fail, plugin, action, args) {
                if (actions[plugin][action].functions) {
                    actions[plugin][action].fn(obj, success, fail, args);
                } else {
                    success = success || function() {};
                    fail = fail || function() {};

                    var result = actions[plugin][action].fn(obj, args);

                    if (result !== undefined && typeof result.then === 'function') {
                        result.then(function(res) {
                            success(res);
                        }, function(err) {
                            fail(err);
                        });
                    } else {
                        success(result);
                    }
                }
            }
        };
    }])
    .factory('platformClass', [function() {
        return function(obj) {
            if (obj.window.ionic !== undefined) {
                obj.window.ionic.Platform.setPlatform(obj.device.preset.platform);
            }
            var platformClass = "platform-" + obj.device.preset.platform;
            obj.iframe.contents().find('body').removeClass(platformClass).addClass(platformClass);
        };
    }])
    .factory('reload', ['serverApi', function(serverApi) {
        return function(obj) {
            serverApi.on('reload', function() {
                obj.iframe.attr("src", obj.iframe.attr("src"));
            });
        };
    }]);
    
    return app;
});