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
const path = require("path");
const url = require("url");

let win;

ipcMain.on("quit", (event, code) => {
    win = null;
    process.exit(1);
});
function createWindow() {
    win = new BrowserWindow({
        width: 760, 
        height: 540,
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
