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
    //Clean the compatibility dir created in "afterCompile" step
    //This is to ensure always fresh version in the bin folder
    var fs = require('fs');
    var path = require('path');
    var rootdir = data.projectRoot;
    var dirPath = path.join(rootdir, 'platforms\\android\\build');

    if (fs.existsSync(dirPath)) {
        console.log("TACO update - removing possible previously created files in the platforms directory");

        var deleteFolderRecursive = function (path) {
            if (fs.existsSync(path)) {
                fs.readdirSync(path).forEach(function (file, index) {
                    var curPath = path + "/" + file;
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }
        };

        deleteFolderRecursive(dirPath);
        console.log("TACO update - platforms directory build folder successfully removed");
    }

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
        var destFile = path.join(rootdir, destDir + fileName.replace('app-','android-'));
        var destDir = path.dirname(destFile);

        if (fs.existsSync(srcFile) && fs.existsSync(destDir)) {
            fs.createReadStream(srcFile).pipe(fs.createWriteStream(destFile));
        }
    }

    var attemptCopy = function (srcDir, destDir) {
        performCopy(srcDir, destDir, 'app-debug.apk');
        performCopy(srcDir, destDir, 'app-release.apk');
        //performCopy(srcDir, destDir, 'android-debug.apk');
        //performCopy(srcDir, destDir, 'android-release.apk');
        //performCopy(srcDir, destDir, 'output.json');
    }

    var createDirectories = function () {
        var ensureCreated = function (dirPath) {
            var buildDir = path.join(rootdir, dirPath);
            if (!fs.existsSync(buildDir)) {
                console.log("TACO update - \"" + dirPath + "\" directory does not exist, creating...");
                fs.mkdirSync(buildDir);
                console.log("TACO update - \"" + dirPath + "\" successfully created");
            }
        };

        ensureCreated('platforms\\android\\build');
        ensureCreated('platforms\\android\\build\\outputs');
        ensureCreated('platforms\\android\\build\\outputs\\apk');    
    }

    console.log("TACO update - APK copy to folder structure compatible with TACO tooling...");
    console.log('TACO update - Rootdir is: "' + rootdir + '"');
    console.log('TACO update - Creating "build" directory structure in platforms folder"');
    createDirectories();



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
