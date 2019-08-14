/*global define, FileReader */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.api.fileReader.services', [])
    .factory('fileReaderApi', ['$q', function($q) {
        return {
            read: function(e, cb) {
                
                var files= e.target.files,
                    contents = {},
                    promises = [];

                angular.forEach(files, function(file) {
                    var reader = new FileReader(),
                        deferred = $q.defer();

                    reader.onload = function(e) {
                        deferred.resolve({
                            "name": file.name,
                            "content": e.target.result
                        });
                    };

                    promises.push(deferred.promise);
                    reader.readAsText(file);
                });

                if (cb === undefined || typeof cb !== "function") {
                    return $q.all(promises);
                } else {
                    $q.all(promises).then(cb);
                }
            }
        };
    }]);

    return app;
});