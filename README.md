# Fate/Grand Order Login BOT
For biligame (China version) Android server only. https://fgo.biligame.com/

# How to use
1. Install and start mitmproxy
2. Start Android emulator by using command: 
```emulator -avd "YOUR_AVD_NAME" -http-proxy 127.0.0.1:8080```
3. Open browser and navigate to http://mitm.it/ to trust the certificate on your emulator.
4. Login to FGO and make sure you finish the very first tutorial (Until you see the main menu)
5. Go to http://127.0.0.1/8081 and filter the sniffered traffic by ```logintomembercenter```
6. You can see ```rkuid``` (Biligame User ID),  ```access_token``` (Access Token) from the right-side of 'Request' tab
7. Rename ```users.json.example``` to ```users.json``` and edit the configuration by the information that you sniffered (Multiple account is supported)
8. Run ```npm start``` (You can also schedule to run it everyday by using crontab on Linux)
9. Profit

# Compile
You need to compile yourself. The artifact is not provided in this repo. 
Please make sure that you have typescript installed globally on your system. To install it, run the following command:
```
npm install -g typescript
```

To compile, just run the follow command:
```
npm install
tsc
```

# Error Handler
You can write your own error handler to notify yourself if the program encountered any error. To do so, just rename ```src/ErrorHandler.ts.example``` to ```src/ErrorHandler.ts```. Please note that you need to compile it.

# Game Update
If the game updated, you can edit ```clientinfo.json``` to set the app version and data version to the latest version. You can grab the version number by using mitmproxy.