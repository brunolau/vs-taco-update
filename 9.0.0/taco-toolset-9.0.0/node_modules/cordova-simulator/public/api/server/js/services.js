/*global define */
/*jslint white: true */

define(['angular', 'socketio'], function(angular, io) {
    'use strict';

    var app = angular.module('cordovaSimulator.api.server.services', [])
    .factory('serverApi', [function() {
        var server = io.connect();
        return {
            emit: function(event, data) {
                if (server !== undefined) {
                    server.emit(event, data);
                }
            },
            on: function(event, cb) {
                if (server !== undefined) {
                    server.on(event, cb);
                }
            },
            removeListener: function(event, cb) {
                if (server !== undefined) {
                    server.removeListener(event, cb);
                }
            },
            get: function(url, cb) {
                var res = url + 'Response';

                function callback() {
                    cb.apply(this, arguments);
                    this.removeListener(res, callback);
                }

                this.on(res, callback);

                this.emit(url);
            }
        };
    }]);

    return app;
});