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

    var fs = require('fs');
    var path = require('path');
    var rootdir = data.projectRoot;
    var hooksRunner = new HooksRunner(data.projectRoot || data.root);
    var performCopy = function (srcDir, destDir, fileName) {
        var srcFile = path.join(rootdir, srcDir + fileName);
        var destFile = path.join(rootdir, destDir + fileName);
        var destDir = path.dirname(destFile);

        if (fs.existsSync(srcFile) && fs.existsSync(destDir)) {
            fs.createReadStream(srcFile).pipe(fs.createWriteStream(destFile));
        }
    }

    var attemptCopy = function (srcDir, destDir) {
        performCopy(srcDir, destDir, 'app-debug.apk');
        performCopy(srcDir, destDir, 'app-release.apk');
        performCopy(srcDir, destDir, 'android-debug.apk');
        performCopy(srcDir, destDir, 'android-release.apk');
        performCopy(srcDir, destDir, 'output.json');
    }

    console.log("TACO update - APK copy to folder structure compatible with TACO tooling...");
    console.log('TACO update - Rootdir is: "' + rootdir + '"');

    //Paths may differ depending on installed build tools
    attemptCopy('platforms\\android\\build\\outputs\\apk\\debug\\', 'platforms\\android\\build\\outputs\\apk\\');
    attemptCopy('platforms\\android\\app\\build\\outputs\\apk\\debug\\', 'platforms\\android\\build\\outputs\\apk\\');
    attemptCopy('platforms\\android\\build\\outputs\\apk\\release\\', 'platforms\\android\\build\\outputs\\apk\\');
    attemptCopy('platforms\\android\\app\\build\\outputs\\apk\\release\\', 'platforms\\android\\build\\outputs\\apk\\');

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
