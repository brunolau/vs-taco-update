var path = require('path');

var express = require('express.io');
var open = require('open');

var appsServing = require('./lib/apps');
var resourcesServing = require('./lib/resources');

module.exports = function(properties) {
    var filesDir = path.join(__dirname, properties.dir);
    
    if (properties.demo) {
        properties.apps.push({
            name: 'demo',
            path: path.join(filesDir, 'demo')
        });
    }
    
    var app = express();
    app.http().io();
    var mainServe = express.static(path.join(filesDir, 'public'), 
                                   {index: properties.offline ? 'index-offline.html' :
                                                                'index.html'});
    
    appsServing(app, properties.apps, true, mainServe);
    resourcesServing(app, properties.resources);
    
    app.use(mainServe);

    app.listen(properties.port);
    
    if (properties.launch) {
        open('http://localhost:' + properties.port);
    }
}