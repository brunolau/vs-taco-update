/*global define */
/*jslint white: true */

define(['angular', 'jquery'], function(angular, $) {
    'use strict';

    angular.module('cordovaSimulator.directives', [])
    .directive('device', ['plugins', function(plugins) {
        return {
        restrict: 'E',
        controller: ['$scope', function($scope) {
            $scope.isLandscape = $scope.device.preset.width > $scope.device.preset.height;
            $scope.currNet = $scope.device.preset.networks[0];
            $scope.battery = 100;
            $scope.isPlugged = true;
            $scope.flashlight = false;
            
            $scope.toggleOrientation = function() {
                $scope.isLandscape = !$scope.isLandscape;
            };
            
            $scope.setNet = function(net) {
                $scope.currNet = net;
            };
            
            $scope.showWidget = function(widget) {
                $scope.widget = widget;
            };
            
            $scope.backdropClick = function() {
                if ($scope.widget.backdropCb !== undefined) {
                    $scope.widget.backdropCb();
                    $scope.removeWidget();
                }
            };
            
            $scope.removeWidget = function() {
                $scope.widget = undefined;
            };
        }],
        link: function(scope, element, attrs) {
            var iframe = element.find('iframe');
            scope.appName = attrs.appName;
            scope.bounds = {width: scope.device.preset.width, height: scope.device.preset.height};
            
            iframe.attr("src", '/apps/' + scope.appName);

            scope.reload = function() {
                iframe.attr("src", iframe.attr("src"));
            };
            
            iframe.on('load', function() {
                var iframeWindow = document.getElementById(scope.appName + '_' + scope.device.id).contentWindow,
                    obj = {
                        window: iframeWindow,
                        iframe: iframe,
                        device: scope.devices[scope.device.id],
                        app: scope.apps[scope.appName],
                        scope: scope
                    };
                
                plugins.wire(obj, iframeWindow.cordova);
                
                iframeWindow.cordova.require('cordova/platform').id = scope.device.preset.platform;
                
                iframeWindow.simulatorExec = function(success, fail, service, action, args) {
                    plugins.execCommand(obj, success, fail, service, action, args);
                };
                
                iframeWindow.cordova.require('cordova/channel').onCordovaReady.subscribe(function() {
                    iframeWindow.cordova.require('cordova/channel').onCordovaInfoReady.fire();
                });
                
                iframeWindow.cordova.require('cordova/channel').onNativeReady.fire();
            });

            scope.$watch('device.preset.platform', function(value) {
                iframe.attr("src", iframe.attr("src"));
            });
        },
        templateUrl: 'partials/device.html',
        replace: true
      };
    }])
    .directive('presetConfig', [function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/presetConfig.html',
            replace: true,
            controller: ['$scope', function($scope) {
                $scope.deletePreset = function() {
                    delete $scope.presets[$scope.preset.name];
                };

                $scope.addPreset = function() {
                    $scope.presets[$scope.preset.name] = $scope.preset;
                    $scope.preset = {};
                };
            }],
            link: function(scope, element, attrs) {
                if (attrs.newPreset !== undefined) {
                    scope.preset = {};
                    scope.newPreset = true;
                } else {
                    scope.newPreset = false;
                }
            }
        };
    }])
    .directive('alerts', ['$compile', 'alertSystem', function($compile, alertSystem) {
        var template = "<div class=\"alert alert-{{type}} alert-dismissible fade in\" role=\"alert\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>" +
                            "<strong>{{strong}}</strong> {{text}}" +
                        "</div>";

        return {
            restrict: 'E',
            scope: true,
            link: function(scope, element, attrs) {
                function createAlert(childScope) {
                    var alert = $compile(template)(childScope);

                    alert.on('closed.bs.alert', function () {
                        childScope.$destroy();
                    });

                    element.prepend($compile(template)(childScope));
                }

                alertSystem.listen(function(type, strong, text) {
                    var childScope = scope.$new(false, scope);
                    childScope.type = type;
                    childScope.text = text;
                    childScope.strong = strong;

                    if (element.find('.alert').length > 3) {
                        $('.alert:last-child').on('closed.bs.alert', function () {
                            childScope.$apply(function() {
                                createAlert(childScope);
                            });
                        });

                        $('.alert:last-child').alert('close');
                    } else {
                        createAlert(childScope);
                    }
                });
            }
        };
    }])
    .directive('showModal', ['$compile', '$rootScope', function($compile, $rootScope) {
        var template = 
'<div class="modal fade" id="showModal" tabindex="-1" role="dialog" aria-labelledby="showModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog">' +
        '<div class="modal-content">' +
            '<div class="modal-header">' +
             '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> ' +
                '<h4 class="modal-title" id="showModalLabel" ng-bind="title"></h4>' +
            '</div>' +
            '<div class="modal-body" ng-include="template" ng-class="cssclass">' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>' +
            '</div>' +
        '</div>' +
    '</div>' +
'</div>',
        widgetScope;
        
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var body = $('body');
                
                if (body.find('#showModal').length === 0) {
                    widgetScope = $rootScope.$new(false);
                    body.append($compile(template)(widgetScope));
                }
                
                $(element).attr({'data-toggle':"modal", 'data-target':"#showModal"}).click(function() {
                    widgetScope.$apply(function() {
                        widgetScope.title = attrs.showModal;
                        widgetScope.template = attrs.modalTemplate;
                        widgetScope.cssclass = attrs.modalClass;
                    });
                });
                
            }
        };
    }]);
});