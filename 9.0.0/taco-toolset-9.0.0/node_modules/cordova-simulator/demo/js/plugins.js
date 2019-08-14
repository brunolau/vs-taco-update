angular.module('demo.plugins', [])
.constant('pluginsList', {
    platformClass: {
        title: 'Platform class'
    },
    reload: {
        title: 'Reload'
    },
    device: {
        controller: true,
        title: 'Device',
        icon: 'ion-iphone'
    },
    appVersion: {
        title: 'App Version',
        controller: true
    },
    vibration: {
        title: 'Vibration',
        controller: true
    },
    clipboard: {
        title: 'Clipboard',
        controller: true
    },
    flashlight: {
        title: 'Flashlight',
        controller: true
    },
    batterystatus: {
        title: 'Battery Status',
        controller: true
    },
    dialogs: {
        title: 'Dialogs',
        controller: true
    },
    networkinfo: {
        title: 'Network Info',
        controller: true
    },
    actionsheet: {
        title: 'Action Sheet',
        controller: true
    },
    splashscreen: {
        title: 'Splash Screen',
        controller: true
    }
})
.controller('deviceController', function($scope, $cordovaDevice) {
    $scope.device = $cordovaDevice.getDevice();
})
.controller('splashscreenController', function($scope, $cordovaSplashscreen) {
    $scope.show = function() {
        $cordovaSplashscreen.show();
    }
})
.controller('clipboardController', function($scope, $cordovaClipboard) {
    $scope.copy = function(text) {
        $cordovaClipboard.copy(text);
    }
    
    $scope.paste = function() {
        $cordovaClipboard.paste()
        .then(function (result) {
            $scope.pastedText = result;
        })
    }
    
})
.controller('appVersionController', function($scope, $cordovaAppVersion) {
    $cordovaAppVersion.getAppVersion().then(function (version) {
        $scope.version = version;
    });
})
.controller('vibrationController', function($scope, $cordovaVibration) {
    $scope.vibrate = function(duration) {
        $cordovaVibration.vibrate(duration);
    }
})
.controller('flashlightController', function($scope, $cordovaFlashlight) {
    $scope.on = $cordovaFlashlight.switchOn;
    $scope.off = $cordovaFlashlight.switchOff;
    $scope.toggle = $cordovaFlashlight.toggle;
})
.controller('networkinfoController', function($scope, $rootScope, $cordovaNetwork) {
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        $scope.network = networkState;
    });

    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        $scope.network = networkState;
    });
})
.controller('dialogsController', function($scope, $cordovaDialogs) {
    $scope.alert = function() {
        $cordovaDialogs.alert('alert dialog')
        .then(function() {
        });
    }
    
    $scope.prompt = function() {
        $cordovaDialogs.prompt('prompt dialog', 'Prompt', ['OK', 'Cancel'], 'text')
        .then(function(result) {
        });
    }
    
    $scope.confirm = function() {
        $cordovaDialogs.confirm('confirm dialog')
        .then(function() {
        });
    }
    
    $scope.beep = function() {
        $cordovaDialogs.beep(3);
    }
})
.controller('actionsheetController', function($scope, $cordovaActionSheet) {
    var options = {
        title: 'This is an action sheet',
        buttonLabels: ['Option1', 'Option2'],
        addCancelButtonWithLabel: 'Cancel',
        androidEnableCancelButton : true,
        winphoneEnableCancelButton : true,
        addDestructiveButtonWithLabel : 'Destructive Action'
    };

    $scope.show = function() {
        $cordovaActionSheet.show(options)
        .then(function(btnIndex) {
            var index = btnIndex;
        });
    };
})
.controller('batterystatusController', function($scope, $rootScope, $cordovaBatteryStatus) {
    $rootScope.$on('$cordovaBatteryStatus:status', function (e, result) {
        $scope.level = result.level;
        $scope.isPlugged = result.isPlugged;
        
        if (result.level > 20) {
            $scope.status = "ok";
        }
    });
    $rootScope.$on('$cordovaBatteryStatus:critical', function (e, result) {
      $scope.status = "critical";
    });

    $rootScope.$on('$cordovaBatteryStatus:low', function (e, result) {
      $scope.status = "low";
    });
});