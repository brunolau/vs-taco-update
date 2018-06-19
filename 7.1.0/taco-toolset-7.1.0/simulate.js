/********************************************************
 *                                                      *
 *   Copyright (C) Microsoft. All rights reserved.      *
 *                                                      *
 ********************************************************/
"use strict";

var io = require("socket.io-client");
var Q = require("q");
var simulate = require("cordova-simulate");

var args = processArgs();

var themeFile = args["theme-file"];
var theme = require(themeFile);
updateThemeFont(theme, args["font-family"], args["font-size"]);

var opts = {
    dir: args["dir"],
    device: args["device"],
    livereload: (args["livereload"] || "").toLowerCase() !== "false",
    port: args["port"],
    lang: args["lang"],
    simhosttitle: args["simhosttitle"],
    theme: theme,
    corsproxy: (args["corsproxy"] || "").toLowerCase() !== "false"
};

var simulator = new simulate.Simulator(opts);
simulator.startSimulation().then(connectSimulateDebugHost).then(function () {
    writeProperty("appUrl", simulator.appUrl());
    writeProperty("simHostUrl", simulator.simHostUrl());
    writeProperty("urlRoot", simulator.urlRoot());
}).catch(function (error) {
    error = error.message || error.toString();
    if (error.toLowerCase().indexOf("error:") !== 0) {
        error = "Error: " + error;
    }
    console.error(error);
});

process.stdin.on("data", function (data) {
    var dataString = data.toString();
    var match = dataString.match(/^EVENT=(.*)/);
    if (match) {
		handleEvent(match[1]);
    }
});

function connectSimulateDebugHost() {
    return Q.Promise(function (resolve, reject) {
        function simulateConnectErrorHandler(err) {
            reject(err);
        }

        // Node side XHR implementation used by socket.io cannot resolve localhost if not connected to the internet.
        var urlRoot = simulator.urlRoot().replace("localhost", "127.0.0.1");
        var simulateDebugHost = io.connect(urlRoot);
        simulateDebugHost.on("connect_error", simulateConnectErrorHandler);
        simulateDebugHost.on("connect_timeout", simulateConnectErrorHandler);
        simulateDebugHost.on("connect", function () {
            simulateDebugHost.on("resize-viewport", function (data) {
                writeEvent("resize-viewport", data);
            });
            simulateDebugHost.on("reset-viewport", function () {
                writeEvent("reset-viewport");
            });
            simulateDebugHost.emit("register-debug-host", {handlers: ["reset-viewport", "resize-viewport"]});
            resolve();
        });
    });
}

function writeProperty(name, value) {
    console.log("PROP=" + JSON.stringify({name: name, value: value}));
}

function writeEvent(name, data) {
    console.log("EVENT=" + JSON.stringify(typeof data === "undefined" ? {name: name} : {name: name, data: data}));
}

function handleEvent(data) {
	data = JSON.parse(data);
	var eventName = data.name;
	var eventData = data.data;

	switch (eventName) {
		case "theme-changed":
			if (simulator.updateTheme) {
				var theme = require(eventData["theme-file"]);
				updateThemeFont(theme, eventData["font-family"], eventData["font-size"]);
		        simulator.updateTheme(theme);
			}
	}
}

function updateThemeFont(theme, fontFamily, fontSize) {
	var themeDefault = theme.default || (theme.default = {});
	var themeNormalDefault = themeDefault[""] || (themeDefault[""] = {});
	themeNormalDefault["font-family"] = fontFamily;
	themeNormalDefault["font-size"] = fontSize;
}

function processArgs() {
	return process.argv.slice(2).reduce(function (args, arg) {
		arg = arg.split("=");
		if (arg.length === 1) {
			arg[1] = true;
		}
		args[arg[0]] = arg[1];
		return args;
	}, {});

}
