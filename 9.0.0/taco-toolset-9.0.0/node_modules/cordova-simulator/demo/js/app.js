angular.module('demo', [
    'ionic',
    'ngCordova',
    'demo.controllers',
    'demo.directives',
    'demo.filters',
    'demo.services',
    'demo.plugins'
])
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
.config(function($stateProvider, $urlRouterProvider, pluginsList) {
    $urlRouterProvider.otherwise('/plugins');

    $stateProvider
    .state('plugins', {
        url: '/plugins',
        templateUrl: 'partials/pluginsList.html',
        controller: 'pluginsListController'
    });
    
    angular.forEach(pluginsList, function(plugin, name) {
        var state = {
            url: '/' + name,
            templateUrl: 'partials/' + name + '.html'
        };
        
        if (plugin.controller)
            state.controller = name + 'Controller';
        
        $stateProvider
        .state(name, state);
    });
});