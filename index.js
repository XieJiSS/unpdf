/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JieJiSS <c141028@protonmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/11/25 14:51:25 by JieJiSS           #+#    #+#             */
/*   Updated: 2017/11/25 14:51:25 by JieJiSS          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
let request = require('request');
const path = require("path");
const url = require("url");
const fs = require("fs");
const tmp = require("tmp");

let win;

ipcMain.on("quit", (event, code) => {
    win = null;
    process.exit(1);
});
ipcMain.on("update", (event, url) => {
    let httpStream = request({
        method: 'GET',
        url: url
    });
    let tmpobj = tmp.dirSync();
    let tmpDir = tmpobj.name;
    let writeStream = fs.createWriteStream(path.join(tmpDir, "unpdf_setup.exe"));
    httpStream.pipe(writeStream);
    let totalLength = 0;
    
    // 当获取到第一个HTTP请求的响应获取
    httpStream.on('response', (response) => {
        console.log('response headers is: ', response.headers);
    });
    
    httpStream.on('data', (chunk) => {
        totalLength += chunk.length;
        console.log('recevied data size: ' + totalLength + 'KB');
    });
    
    // 下载完成
    writeStream.on('close', () => {
        console.log('download finished');
        // Manual cleanup
        tmpobj.removeCallback();
        console.log(tmpDir);
    });
});
function createWindow() {
    win = new BrowserWindow({
        width: 760, 
        height: 530,
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
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, "/src/html/index.html"),
            protocol: "file:",
            slashes: true
        })
    );
    win.on("closed", () => {
        win = null;
    });
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});
