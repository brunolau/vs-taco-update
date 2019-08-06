# VS2017 TACO Update
This package updates the Visual Studio Tools for Apache Cordova for VS 2017 to use higher Cordova and Cordova-Android versions.

Currently supported:
Cordova@7.1.0 with Cordova-Android@6.3.0
Cordova@9.0.0 with Cordova-Android@8.0.0

# Installation instructions
1. Find the folder where Visual Studio stores the taco-toolset, (it should be located somewhere in C:\ProgramData\Microsoft\VisualStudio\MDA)

2. Copy the chosen taco-toolset [from the 7.1.0. or 9.0.0] folder to the directory identified in previous step so that you now have 2 toolsets in the directory (the default taco-toolset-6.3.1 and the new taco toolset of your choice [e.g. taco-toolset-9.0.0])

3. Important step - Locate the Android SDK that TACO uses (default in C:\ProgramData\Microsoft\AndroidSDK\25) and ensure you have installed Android SDK version 26 (you may use the attached SDKManager.exe, or you can use Android studio to update). To ensure you have the SDK 26, look into the "platforms" directory, you should have "android-26" in there if everything's setup correctly. If you skip this step, build will stop with error stating something like "you have to agree on license for Android SDK 26". Also ensure you have update the build-Tools if necessary for your project). This all could be done in the SDK Manager

4. Delete node_modules, package.json in your Cordova App's root folder

5. Close all instances of Visual Studio and re-open them

6. In your project, double-click config.xml, choose the "Toolset" tab on the left. Now look for the "Toolset name" dropdown. There should be new addition "Cordova 9.0.0". Select it and save your config.xml

6. Build your project, your project will now be built using Cordova @9.0.0 and Cordova-Android @8.0.0




# Creating your own Toolset
Creating a custom Toolset for TACO isn't that difficult as it might seem at the first sight. Note that this might not be the most ideal way to do it, but it's the way I did it. Also note that higher Cordova and Cordova-android versions might have some unexpected compatibility issues with the TACO tooling. So if you need any other versions than the ones I provided in my update, you can create your own using following steps:

1. Download Node.js and install it (https://nodejs.org/en/)
2. Create a directory on your root (e.g. C:\Taco, I will call it this way for the rest of the tutorial)
3. Open command prompt (type cmd.exe) and launch it as Administrator
4. Navigate to the newly created directory (cd C:\Taco), this will be the folder, where npm will store the libraries we are about to download
5. Install the desired cordova version (npm install cordova@7.1.0) [don't use the -g switch]
6. Install npm (npm install npm) [don't use the -g switch], this should add npm into the node_modules directory
7. Type "npm shrinkwrap" into the command prompt and execute it
8. Navigate to VS TACO directory (it should be located somewhere in C:\ProgramData\Microsoft\VisualStudio\MDA, in my case it was C:\ProgramData\Microsoft\VisualStudio\MDA\284aeaec)
9. Copy the taco-toolset-6.3.1 into another folder and name it according to the cordova version you are about to install (e.g. taco-toolset-7.1.0, I will call it this way for the rest of the tutorial)
10. Now the fun begins. In this copied folder (taco-toolset-7.1.0), delete the node_modules, node.exe, npm-shrinkwrap.json
11. From the C:\Taco folder, copy the node_modules folder and npm-shrinkwrap.json into the taco-toolset-7.1.0 folder
12. Copy node.exe from the Node.js installation directory to ensure you have latest Node.js in your toolset (default location being C:\Program Files\nodejs)
13. In the command prompt, execute "node --version" command, this will output the Node.js version (e.g. 8.11.3)
14. In the command prompt, execute "npm -version", this will output the NPM version (e.g. 5.6.0)
15. In the taco-toolset-7.1.0 folder, edit the versions.json file and set the approperiate versions in there (cordova, node, npm). Here you also specify the Cordova-android version used by the toolset
16. In the same folder, edit the package.json file, again, replace the "6.3.1" version with your own (7.1.0)
17. Your custom toolset is now ready, just copy it next to the taco-toolset-6.3.1 folder, close all Visual studio instances and you are good to go



Note that starting with Cordova-Android @6.4.0 the output structure changed and in order to build succesfully, you also need to patch the vstacwrapper.js file. See my implementation (in the 7.1.0 tooling) for more details
