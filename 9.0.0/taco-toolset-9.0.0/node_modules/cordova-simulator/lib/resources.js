var path = require('path');

var express = require('express.io');
var recursive = require('recursive-readdir');
var mime = require('mime');

function pathToUrl(resourceBaseDir, resourcePath) {
    return '/resources/' + path.basename(resourceBaseDir) + resourcePath.replace(resourceBaseDir, "").split(path.sep).join('/');
}

module.exports = function(app, resources) {
    var resourceList = {
        images: [],
        videos: [],
        audios: []
    };
    
    resources.forEach(function(resourceDir) {
        app.use('/resources/' + resourceDir.name, express.static(resourceDir.path));
        
        recursive(resourceDir.path, function (err, files) {
            if (!err) {
                files.forEach(function(file) {
                    var type = mime.lookup(file);
                    
                    if (type.indexOf('image/') == 0)
                        resourceList.images.push(pathToUrl(resourceDir.path, file));
                    else if (type.indexOf('audio/') == 0)
                        resourceList.audios.push(pathToUrl(resourceDir.path, file));
                    else if (type.indexOf('video/') == 0)
                        resourceList.videos.push(pathToUrl(resourceDir.path, file));
                });
            }
        });
    });
    
    app.io.route('resources', function(req) {
        req.io.emit('resourcesResponse', resourceList);
    });
}