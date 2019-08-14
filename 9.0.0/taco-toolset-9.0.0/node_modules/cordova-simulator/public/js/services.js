/*global define */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    angular.module('cordovaSimulator.services', [])
    .provider('configuration', [function() {
        var provider = this;
        this.defaults = {
            platforms: ['android', 'ios'],
            presets: {
                genericAndroid: {
                    name: 'genericAndroid',
                    platform: 'android',
                    platformVersion: '5.0',
                    model: 'SG4',
                    networks: ['ethernet', 'cellular', '2g', '3g', '4g', 'wifi', 'none'],
                    width: 337,
                    height: 667
                },
                genericIphone: {
                    name: 'genericIphone',
                    platform: 'ios',
                    platformVersion: '7.0',
                    model: 'iphone6',
                    networks: ['ethernet', 'cellular', '2g', '3g', '4g', 'wifi', 'none'],
                    width: 337,
                    height: 667
                }
            },
            devices: {
                android: {
                    id: 'android',
                    preset: 'genericAndroid'
                },
                iphone: {
                    id: 'iphone',
                    preset: 'genericIphone'
                }
            }
        };

        function stringsToPresets(config) {
            angular.forEach(config.devices, function(device) {
                device.preset = config.presets[device.preset];
            });

            return config;
        }

        function presetsToStrings(config) {
            angular.forEach(config.devices, function(device) {
                    device.preset = device.preset.name;
            });

            return config;
        }

        this.$get = ['$http', '$rootScope', '$q', 'alertSystem', 'storageApi', 'fileSaverApi', 'serverApi', function($http, $rootScope, $q, alertSystem, storageApi, fileSaverApi, serverApi) {
            var load = function(config) {
                var promises = [],
                    deferredResources = $q.defer(),
                    deferredApps = $q.defer();

                config = stringsToPresets(angular.copy(config) || 
                                          storageApi.get('configuration') || 
                                          angular.copy(provider.defaults));
                $rootScope.config = config;

                if ($rootScope.config.platforms === undefined) {
                    $rootScope.config.platforms = [];
                }
                if ($rootScope.config.presets === undefined) {
                    $rootScope.config.presets = {};
                }
                if ($rootScope.config.devices === undefined) {
                    $rootScope.config.devices = {};
                }
                if ($rootScope.config.apps === undefined) {
                    $rootScope.config.apps = {};
                }
                if ($rootScope.config.plugins === undefined) {
                    $rootScope.config.plugins = {};
                }

                $rootScope.platforms = config.platforms;
                $rootScope.presets = config.presets;
                $rootScope.devices = config.devices;
                $rootScope.apps = config.apps;
                $rootScope.plugins = config.plugins;


                promises.push(deferredResources.promise);

                serverApi.get('resources', function(resources) {
                    $rootScope.resources = resources;
                    deferredResources.resolve();
                });


                promises.push(deferredApps.promise);

                serverApi.get('apps', function(apps) {
                    angular.forEach(apps, function(app) {
                        if ($rootScope.apps[app.name] === undefined) {
                            $rootScope.apps[app.name] = {
                                name: app.name,
                                path: app.path,
                                served: true
                            };
                        } else {
                            $rootScope.apps[app.name].served = true;
                            $rootScope.apps[app.name].path = app.path;
                        }
                    });

                    deferredApps.resolve();
                });

                return $q.all(promises);
            }, 
            save = function() {
                var config = presetsToStrings(angular.copy($rootScope.config));

                angular.forEach(config.apps, function(app) {
                    delete app.served;
                    delete app.path;
                });

                storageApi.set('configuration', config);
            },
            reset = function() {
                load(provider.defaults);
            },
            exportConfiguration = function() {
                var config = presetsToStrings(angular.copy($rootScope.config));

                angular.forEach(config.apps, function(app) {
                    delete app.served;
                    delete app.path;
                });

                fileSaverApi.save("configuration.json", JSON.stringify(config, null, 2));
            },
            importConfiguration = function(config) {
                load(config);
            },
            loadFromGist = function() {
                $http.get('https://api.github.com/gists/35f975e0836d3555ebe1')
                .success(function(data) {
                    try {
                        var gist = JSON.parse(data.files['cordova-simulator-presets'].content);

                        angular.forEach(gist.platforms, function(platform) {
                            if ($rootScope.config.platforms.indexOf(platform) === -1) {
                                $rootScope.config.platforms.push(platform);
                            }
                        });

                        angular.forEach(gist.presets, function(preset, name) {
                            if ($rootScope.config.presets[name] === undefined) {
                                $rootScope.config.presets[name] = preset;
                            }
                        });
                    } catch (e) {
                        alertSystem.warning('Can\'t load gist', 'Json parsing has failed.');
                    }
                })
                .error(function() {
                    alertSystem.warning('Can\'t load gist', 'http get has failed.');
                });
            };

            return {
                load: load,
                save: save,
                reset: reset,
                exportConfiguration: exportConfiguration,
                importConfiguration: importConfiguration,
                loadFromGist: loadFromGist
            };
        }];
    }])
    .factory('alertSystem', ['$rootScope', function($rootScope) {
        return {
            TYPES: {
                SUCCESS: 'success',
                INFO: 'info',
                WARNING: 'warning',
                DANGER: 'danger'
            },
            listen: function(listener) {
                $rootScope.$on('alert', function(event, type, strong, text) {
                    listener(type, strong, text);
                });
            },
            emit: function(type, strong, text) {
                $rootScope.$emit('alert', type, strong, text);
            },
            success: function(strong, text) {
                this.emit(this.TYPES.SUCCESS, strong, text);
            },
            info: function(strong, text) {
                this.emit(this.TYPES.INFO, strong, text);
            },
            warning: function(strong, text) {
                this.emit(this.TYPES.WARNING, strong, text);
            },
            danger: function(strong, text) {
                this.emit(this.TYPES.DANGER, strong, text);
            }
        };
    }]);
});