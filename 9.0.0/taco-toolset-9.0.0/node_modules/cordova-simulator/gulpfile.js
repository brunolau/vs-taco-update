var gulp = require('gulp');
var tap = require('gulp-tap');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var addsrc = require('gulp-add-src');
var watch = require('gulp-watch');
var gulpif = require('gulp-if');
var flatten = require('gulp-flatten');
var rjs = require('requirejs');
var merge = require('merge-stream');
var del = require('del');
var nunjucks = require('nunjucks');
var cordova = require('cordova-lib').cordova;
var cordovajs = require('cordova-js/tasks/lib/bundle');
var fs = require('fs-extra');
var path = require('path');
var Q = require('q');

var argv = require('yargs')
    .options('port', {
            default : 80
        })
    .options('d', {
                alias : 'dev',
                default : false
            })
    .options('s', {
                alias : 'site',
                default : false
            })
    .options('p', {
                alias : 'production',
                default : false
            })
    .check(function(argv) {
        if (argv.production) {
            buildEnv = "prod";
            destDir = "dist/";
        } else if (argv.site) {
            buildEnv = "site";
            destDir = "dist/";
        } else {
            buildEnv = "dev";
            destDir = "dev/";
        }
    })
    .argv;

var config = require('./config/config');
var server = require('./');

var buildEnv;
var destDir;
var cwd = process.cwd();

function generateMain(file) {
    var env = new nunjucks.Environment();
    env.addFilter('json', function(obj, count) {
        return JSON.stringify(obj, null, count);
    });
    
    var template = file.contents.toString();

    for (var key in config.libs) {
        if(config.libs.hasOwnProperty(key)) {
            config.requirejs.paths[key] = config.libs[key];
        }
    }

    config.deps = config.mainDeps.concat();

    config.apis.forEach(function(api) {
        config.deps.push('api/' + api + '/js/app');
    });

    for (var key in config.plugins) {
        if(config.plugins.hasOwnProperty(key)){
            config.deps.push('plugins/' + config.plugins[key].id + '/client/js/app');
        }
    }

    var res = env.renderString(template, config);

    file.contents = new Buffer(res);
};

function generatePluginFiles(opts) {
    var appTemplate = fs.readFileSync('templates/plugins.app.js', {encoding: 'utf8'});
    var servicesTemplate = fs.readFileSync('templates/plugins.services.js', {encoding: 'utf8'});
    
    var env = new nunjucks.Environment();
    
    var app = env.renderString(appTemplate, opts);
    var services = env.renderString(servicesTemplate, opts);

    fs.outputFileSync('plugins/' + opts.id + "/client/js/app.js", app);
    fs.outputFileSync('plugins/' + opts.id + "/client/js/services.js", services);
}

gulp.task('clean', function (done) {
    del(['dev', 'tmp', 'dist'], done);
});

gulp.task('demo', ['clean'], function () {
    return gulp.src('./demo/**/*')
            .pipe(gulp.dest(destDir + '/demo'));
});

gulp.task('simulator', ['clean'], function () {
    var simulator = gulp.src('./templates/main.js')
            .pipe(tap(generateMain))
            .pipe(rename('js/main.js'))
            .pipe(addsrc(['public/!(css)/**/*', 'public/index.html']))
            .pipe(gulp.dest(destDir + 'public/'));

    var plugins = gulp.src('./plugins/*/client/js/*')
            .pipe(gulp.dest(destDir + '/public/plugins'));
    
    var pluginsPartials = gulp.src('plugins/*/client/partials/*')
            .pipe(flatten())
            .pipe(gulp.dest(destDir + '/public/partials'));

    var allCss = gulp.src(['public/css/*', 'plugins/*/client/css/*'])
            .pipe(concat('app.css'))
            .pipe(gulp.dest(destDir + '/public/css'));
    
    return merge(simulator, plugins, pluginsPartials, allCss);
});

gulp.task('createCordova', ['clean'], function (done) {
    var plugins = [];
    for (var key in config.plugins) {
        if(config.plugins.hasOwnProperty(key)){
            plugins.push(config.plugins[key].url !== undefined ? config.plugins[key].url : config.plugins[key].id);
        }
    }
    
    cordova.raw.create('tmp', 'ozsay.cordovaSimulator.simulator', 'simulator').done(function() {
        var cwd = process.cwd();
        process.chdir('tmp');
        cordova.raw.platform('add', ['android']).done(function() {
            cordova.raw.plugin('add', plugins).done(function() {
                process.chdir(cwd);
                done();
            });
        });
    });
});

gulp.task('plugin', [], function (done) {
    if (argv.add && argv.i !== undefined && argv.n !== undefined) {
        var plugin = [argv.u !== undefined ? argv.u : argv.i];
        
        var cwd = process.cwd();
        process.chdir('tmp');
        cordova.raw.plugin('add', plugin).done(function() {
            process.chdir(cwd);
            
            config.plugins[argv.n] = {
                id: argv.i,
                url: argv.u
            };
            
            fs.writeJson('./config/config.json', config, function() {
                generatePluginFiles({
                    id: argv.i,
                    name: argv.n
                });
                
                done();
            });
        });
    }
});

gulp.task('createCordovaJs', ['createCordova'], function (done) {
    fs.copy('cordova', 'node_modules/cordova-js/src', function (err) {
        if (!err) {
            var cwd = process.cwd();
            process.chdir('node_modules/cordova-js');
            var cordovaJsFile = cordovajs('simulator', false, 'custom commit', '3.7.0');
            process.chdir(cwd);
            fs.outputFile('tmp/platforms/android/assets/www/cordova.js', cordovaJsFile, done);
        } else {
            done(err);
        }
    });
});

gulp.task('copyCordova', ['createCordova', 'createCordovaJs'], function () {
    return gulp.src(['tmp/platforms/android/assets/www/cordova*.js', 
                     'tmp/platforms/android/assets/www/plugins/**/*.js'])
        .pipe(concat('cordova.js'))
        .pipe(gulpif(buildEnv !== "dev", uglify()))
        .pipe(gulp.dest(destDir + 'public/'));
});

gulp.task('cordova', ['createCordova', 'createCordovaJs', 'copyCordova'], function () {
});

gulp.task('serve', [], function () {
    server({
        port: argv.port,
        launch: true,
        demo: true,
        apps: [],
        resources: [],
        dir: 'dev'
    });
    
    var watchPublic = watch(['public/!(css|lib)/**/*', 'public/index.html'], {verbose: true}).pipe(gulp.dest('dev/public/'));
    var watchPlugins = watch('plugins/*/client/js/*', {verbose: true}).pipe(gulp.dest('dev/public/plugins'));
    var watchPluginsPartials = watch('plugins/*/client/partials/*', {verbose: true}).pipe(flatten()).pipe(gulp.dest('dev/public/partials'));
    
    var watchAllCss = watch(['public/css/*', 'plugins/*/client/css/*'], {verbose: true}, function() {
        gulp.src(['public/css/*', 'plugins/*/client/css/*'])
            .pipe(concat('app.css'))
            .pipe(gulp.dest(destDir + '/public/css'));
    });
    
    var watchDemo = watch('demo/**/*', {verbose: true}).pipe(gulp.dest('dev/demo'));
    
    return merge(watchPublic, watchPlugins, watchPluginsPartials, watchAllCss, watchDemo);
});

gulp.task('build', ['simulator', 'cordova', 'demo'], function (done) {
    var dir = destDir + "public/";
    
    if (buildEnv === "prod") {
        config.requirejs.baseUrl = dir;
        config.requirejs.name = "js/main";

        for (var key in config.libs) {
            if(config.libs.hasOwnProperty(key)) {
                config.requirejs.paths[key] = 'empty:';
            }
        }

        config.requirejs.optimize = "uglify2";
        config.requirejs.out = function(script) {
            fs.writeFileSync(dir + "js/main.js", script);
            
            del([dir + "api", dir + "plugins", dir + "js/!(main.js)"], done);
        }
        
        rjs.optimize(config.requirejs);
    }
});