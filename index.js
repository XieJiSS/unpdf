/* @file index.js
 * @author JieJiSS
 * @description 
 * @created Sun Sep 17 2017 20:09:37 GMT+0800 (中国标准时间)
 * @copyright Pan RuiZhe 2017, Apache 2.0
 * @license Apache 2.0
 * @last-modified Sun Sep 17 2017 20:09:37 GMT+0800 (中国标准时间)
 */

"use strict";

const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

ipcMain.on("quit", (event, code) => {
    process.exit(1);
});

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 760, 
        height: 640,
        icon: __dirname + '/src/html/logo.png',
        background: "#ffffff",
        show: false,
        resizable: false,
    });

    //win.setMenu(null);

    win.on("ready-to-show", () => {
        win.show();
        win.focus();
    });

    // and load the index.html of the app.
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, "/src/html/index.html"),
            protocol: "file:",
            slashes: true
        })
    );

    // Open the DevTools.
     win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
