/********************************************************
*                                                       *
*   Copyright (C) Microsoft. All rights reserved.       *
*                                                       *
*    Compatibility update by Bruno Laurinec, 2018       *
* based on https://stackoverflow.com/a/49270052/1264729 *
*                                                       *
********************************************************/
"use strict";

var cordova;
var HooksRunner;
var cordovaLibPath;

try {
    cordova = require('./node_modules/cordova');
} catch (e) {
    throw new Error('Failed to load Cordova from ' + './node_modules/cordova');
}

try {
    var hooksPath = './node_modules/cordova-lib/src/hooks/HooksRunner'
    HooksRunner = require(hooksPath);
} catch (e) {
    throw new Error('Failed to load HooksRunner from ' + hooksPath + ' ' + e.message);
}

var beforePrepare = function (data) {
    // Instead of a build, we call prepare and then compile
    // trigger the before_build in case users expect it
    var hooksRunner = new HooksRunner(data.projectRoot || data.root);
    hooksRunner.fire('before_build', data);
}

var afterCompile = function (data) {
    // Instead of a build, we call prepare and then compile
    // trigger the after_build in case users expect it
    var hooksRunner = new HooksRunner(data.projectRoot || data.root);
    console.log("TACO update - APK copy to folder structure copatible with TACO tooling...");

    var fs = require('fs');
    var path = require('path');
    var rootdir = process.argv[2];

    var srcfile = path.join(rootdir, "platforms\\android\\app\\build\\outputs\\apk\\debug\\app-debug.apk");
    var destfile = path.join(rootdir, "platforms\\android\\build\\outputs\\apk\\app-debug.apk");

    var destdir = path.dirname(destfile);
    if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
        fs.createReadStream(srcfile).pipe(
            fs.createWriteStream(destfile));
    }

    srcfile = path.join(rootdir, "platforms\\android\\app\\build\\outputs\\apk\\debug\\output.json");
    destfile = path.join(rootdir, "platforms\\android\\build\\outputs\\apk\\output.json");

    destdir = path.dirname(destfile);
    if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
        fs.createReadStream(srcfile).pipe(
            fs.createWriteStream(destfile));
    }

    console.log("TACO update - APK copy complete...");
    hooksRunner.fire('after_build', data);
}

// Custom hooks
cordova.on('before_prepare', beforePrepare);
cordova.on('after_compile', afterCompile);

cordova.on('results', function (message) {
    console.log(message);
});
cordova.on('warn', function (message) {
    console.warn('Warning: ' + message);
});
cordova.on('verbose', function (message) {
    console.log('[VSTAC_VERBOSE]' + message);
});
cordova.on('error', function (message) {
    console.error(message);
});
cordova.cli(process.argv);
