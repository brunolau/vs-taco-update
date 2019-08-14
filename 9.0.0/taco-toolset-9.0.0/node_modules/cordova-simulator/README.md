# cordova-simulator

Web application for simulating cordova plugins.

The app is an alternative to `cordova serve` (`ionic serve` for ionic users).

## Installing

```bash
$ npm install -g cordova-simulator
```

*Note: For a global install of `-g cordova-simulator`, OSX/Linux users may need to prefix the command with `sudo`.*

## Usage

```bash
$ cordova-simulator [-l | --launch] [-d | --demo] [-p num | --port=num] [-a app1[,app2...] | --apps=app1[,app2...]] [-r resource_folder1[,resource_folder2...] | --resources=resource_folder1[,resource_folder2...]]
```

Options:

| Param           | Description            | Default Value  |
| --------------- | ---------------------- | -------------- |
| -p, --port      | The server's port      | 80             |
| -l, --launch    | Launch in browser      | false          |
| -d, --demo      | Include the demo       | false          |
| -a, --apps      | Apps folders           | []             |
| -r, --resources | Resources folders      | []             |
| -h, --help      | Show help              | &nbsp;         |
| -v, --version   | Show version number    | &nbsp;         |

## Custom behavior

#### # platform classes

Based on the platform, the simulator will add `'platform-*'` classes to the body of the app html.

#### # live reload

The simulator will reload the devices whenever a file is changed in the app folder.

## Supported plugins

- [Action Sheet](https://github.com/EddyVerbruggen/cordova-plugin-actionsheet)
- [App Version](https://github.com/whiteoctober/cordova-plugin-app-version)
- [Battery Status](https://github.com/apache/cordova-plugin-battery-status) *
- [Clipboard](https://github.com/VersoSolutions/CordovaClipboard)
- [Device](https://github.com/apache/cordova-plugin-device) *
- [Dialogs](https://github.com/apache/cordova-plugin-dialogs) *
- [Flashlight](https://github.com/EddyVerbruggen/Flashlight-PhoneGap-Plugin)
- [Network Information](https://github.com/apache/cordova-plugin-network-information) *
- [Splashscreen](https://github.com/apache/cordova-plugin-splashscreen) *
- [Vibration](https://github.com/apache/cordova-plugin-vibration) *

`* official Apache Cordova Plugin`