/*global define */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    angular.module('cordovaSimulator.filters', [])
    .filter('deviceOrientation', [function() {
        return function(input, isLandscape) {
            if (isLandscape) {
                return {
                    width: input.height,
                    height: input.width
                };
            }
            else {
                return input;
            }
        };
    }]).filter('widgetStyle', [function() {
        return function(input, bounds, margin) {
            if (margin !== undefined) {
                input.margin = margin;
            }
            input['max-height'] = bounds.height;
            input['max-width'] = bounds.width;
            
            return input;
        };
    }]);
});