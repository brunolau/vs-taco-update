#!/usr/bin/env node

var path = require('path');
var version = require('../package.json').version;

var argv = require('yargs')
    .options('p', {
        alias : 'port',
        default : 80,
        describe: 'The server\'s port'
    })
    .options('l', {
        alias : 'launch',
        default : false,
        describe: 'Launch in browser'
    })
    .options('d', {
        alias : 'demo',
        default : false,
        describe: 'Include the demo app'
    })
    .options('a', {
        alias : 'apps',
        default : [],
        describe: 'Serve the specified apps'
    })
    .options('r', {
        alias : 'resources',
        default : [],
        describe: 'Resources folders'
    })
    .help('h').alias('h', 'help')
    .version(version, 'v').alias('v', 'version')
    .usage('Starts the cordova simulator.\n' + 
           'Usage: cordova-simulator ' + 
           '[-l | --launch] ' +
           '[-d | --demo] ' +
           '[-p num | --port=num] ' + 
           '[-a app1[,app2..] | --apps=app1[,app2..]] ' +
           '[-r resource_folder1[,resource_folder2..] | --resources=resource_folder1[,resource_folder2..]]\n' +
           '\napp1, app2... are folders that contain index.html files.\n' +
           '\nresource_folder1, resource_folder2... are folders that contain audio, video and picture files.\n')
    .example('cordova-simulator -l -d -p 8100 -a www -r music,movies', 'The simulator starts on port 8100, includes the demo, app is located in www folder, resources are in the music and movies folders, the simulator will try to be launched in your default browser.')
    .example('cordova-simulator --launch --demo --port=8100 --apps=www --resources=music,movies', 'Same example as above.')
    .check(function(argv) {
        if (typeof argv.port != 'number')
            throw new Error("The specified port is not a number.");
        if (argv.port < 0 || argv.port > 65535)
            throw new Error("The specified port is not in range (0 - 65535).");
        
        if (typeof argv.launch != 'boolean')
            throw new Error("The launch argument is not boolean.");
        
        if (typeof argv.demo != 'boolean')
            throw new Error("The demo argument is not boolean.");
        
        if (typeof argv.apps == 'string')
            argv.apps = argv.apps.split(',');
        else if (typeof argv.apps == 'number')
            argv.apps = [argv.apps.toString()];
        else if (typeof argv.apps != 'object')
            throw new Error("The app argument is not valid.");
        
        var apps = [];
        argv.apps.forEach(function(app) {
            apps.push({
                "name": path.basename(path.dirname(path.resolve(app))),
                "path": path.resolve(app)
            });
        });
        
        argv.apps = apps;
        
        if (typeof argv.resources == 'string')
            argv.resources = argv.resources.split(',');
        else if (typeof argv.resources == 'number')
            argv.resources = [argv.resources.toString()];
        else if (typeof argv.resources != 'object')
            throw new Error("The resources argument is not valid.");
        
        var resources = [];
        argv.resources.forEach(function(resource) {
            resources.push({
                "name": path.basename(path.resolve(resource)),
                "path": path.resolve(resource)
            });
        });
        
        argv.resources = resources;
    })
    .argv;

var run = require('../');

run({
    port: argv.port,
    launch: argv.launch,
    demo: argv.demo,
    apps: argv.apps,
    resources: argv.resources,
    dir: 'dist'
});