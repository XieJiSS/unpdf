"use strict";

const { ipcRenderer } = require("electron");

$("div.bg").css("height", window.innerHeight - 10);
$("div.bg").css("width", window.innerWidth - 10);

setTimeout(function () {
    $(document.body).css("visibility", "visible");
}, 0);

$(window).focus(_focus);

$(window).blur(_blur);

$(".control-min").click(function () {
    _blur();
    ipcRenderer.send("minify");
});

$(".control-close").click(function () {
    ipcRenderer.send("close-window");
});

function _focus() {
    $("div.bg").css("background", "rgba(255, 255, 255, 1)");
}

function _blur() {
    $("div.bg").css("background", "rgba(255, 255, 255, 0.75)");
}