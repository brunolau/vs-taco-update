var path = require('path');
var chokidar = require('chokidar');

var express = require('express.io');

module.exports = function(app, appsToServe, reload, mainServe) {
    appsToServe.forEach(function(_app) {
        app.use('/apps/' + _app.name, express.static(_app.path));
        
        app.get('/apps/' + _app.name + '/cordova.js', function(req, res, next) {
            req.url = req.url.replace('/apps/' + _app.name, '/');
            mainServe(req, res, next);
        });
        
        if (reload) {
            chokidar.watch(_app.path).on('all', function(event, path) {
                app.io.broadcast('reload', _app);
            });
        }
    });

    app.io.route('apps', function(req) {
        req.io.emit('appsResponse', appsToServe);
    });
}