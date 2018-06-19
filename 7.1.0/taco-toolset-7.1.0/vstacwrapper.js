/********************************************************
*                                                       *
*   Copyright (C) Microsoft. All rights reserved.       *
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
