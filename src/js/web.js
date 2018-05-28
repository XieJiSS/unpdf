/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   web.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JieJiSS <c141028@protonmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/11/25 14:59:30 by JieJiSS           #+#    #+#             */
/*   Updated: 2018/01/09 22:56:42 by JieJiSS          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

"use strict";

const http = require("http");
const child_process = require("child_process");

function log(str) {
    $("#log div.log").text(str);
}

let CACHE = {
    inter: [],
};

function emptyCallback() {}

const noop = emptyCallback;

$.fn.extend({
    rubberBand: function() {
        var animationEnd =
            "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
        this.addClass("animated rubberBand").one(animationEnd, function() {
            $(this).removeClass("animated rubberBand");
        });
        return this;
    }
});

function updateUNPDF(url="http://jiejiss.xyz/unpdf-download") {
    ipcRenderer.send("update", url);
}

var loading = $(".loading-bar");
var speedDiv = $(".current-speed");
var previous = 0;
var previousTime = new Date().getTime() / 1000;
var d = 0;

ipcRenderer.on("download", (event, byteLength, totalLength) => {
    d++;
    var currentTime = new Date().getTime() / 1000;
    if(currentTime - previousTime >= 1) {
        var speed = (byteLength - previous) / (currentTime - previousTime) / 1024;
        previous = byteLength;
        previousTime = currentTime;
        speedDiv.show();
        speedDiv.html("更新包正在下载……<br />下载速度：" + speed.toFixed(2) + "KB/S");
    }
    loading.show();
    loading.css("width", Math.round(Number(byteLength) / Number(totalLength) * window.innerWidth));
});

ipcRenderer.on("finish", event => {
    speedDiv.hide();
    loading.fadeOut();
    swal({
        type: "info",
        title: "提示",
        text: "下载完毕。为确保安装成功，请先退出UNPDF Downloader再开始更新包安装流程。"
    });
});

function err(str, title = "出错了！") {
    return new Promise(resolve => {
        swal({
            title,
            text: str,
            type: "error",
            confirmButtonText: "退出",
            allowOutsideClick: false,
            confirmButtonColor: "#f27474"
        }).then(resolve, resolve);
    });
}

function check() {
    if(process.platform !== "win32")
        return;
    http.get("http://jiejiss.xyz/unpdf-upload", r => {
        if (r.statusCode === 403) {
            err(
                "Error Code " + r.statusCode + " emitted, about to exit.",
                "FATAL ERROR"
            ).then(() => {
                ipcRenderer.send("quit", String(r.statusCode));
            });
        } else if (r.statusCode === 404) {
            err("检查更新失败：Error Code " + r.statusCode).then(() => {});
        } else {
            r.setEncoding("utf8");
            r.setEncoding("utf8");
            let rawData = [];
            r.on("data", chunk => {
                rawData.push(chunk);
            });
            r.on("end", () => {
                try {
                    const info = JSON.parse(
                        typeof rawData[0] === "string"
                            ? rawData.join("")
                            : Buffer.concat(rawData).toString()
                    );
                    if (info.ver > ver) {
                        document.title += ` v${String(ver)
                            .split("")
                            .join(".")}（有新版本）`;
                        $("#control-title").text(document.title);
                        swal({
                            title: "新版本",
                            html: `当前版本v${ver
                                .toString()
                                .split("")
                                .join(".")}<br>新版本为v${info.ver
                                .toString()
                                .split("")
                                .join(".")}<br>${
                                    info.str ? "更新内容：" + info.str : ""
                                }`,
                            type: "info",
                            confirmButtonText: "下载",
                            showCancelButton: true,
                            cancelButtonText: "取消"
                        }).then(
                            () => {
                                updateUNPDF("http://jiejiss.xyz/unpdf-download");
                            },
                            () => {}
                        );
                    } else if (info.ver < ver) {
                        document.title += ` v${String(ver)
                            .split("")
                            .join(".")}`;
                        document.title += " Beta";
                        $("#control-title").text(document.title);
                    } else {
                        document.title += ` v${String(ver)
                            .split("")
                            .join(".")}`;
                        $("#control-title").text(document.title);
                    }
                } catch (e) {
                    console.error(e.message);
                }
            });
        }
    });
}

check();

let encode = encodeURIComponent;

let languages = {
    zh_CN: {
        file: "C",
        search: "zh-cn"
    },
    en_US: {
        file: "E",
        search: "en"
    }
};

String.prototype.format = function format() {
    //python str的format方法的阉割实现
    function toStr(o) {
        if (o === undefined) {
            return "";
        } else if (o === null) {
            return "null";
        } else {
            if (o.toString) {
                return o.toString();
            } else {
                return Object.prototype.toString.call(o);
            }
        }
    }
    let str = this;
    for (var i = 0; i < arguments.length; i++) {
        if (str.includes(`{${i}}`)) {
            str = str.replace(
                new RegExp(`\\{${i}\\}`, "g"),
                toStr(arguments[i])
            ); // 危险操作
        } else {
            str = str.replace("{}", toStr(arguments[i]));
        }
    }
    return str;
};

String.prototype.toTitle = function toTitle() {
    let arr = this.valueOf().split(" ");
    return arr
        .map(v => {
            if (v.length < 2) {
                if (v.length === 1) {
                    return v.toUpperCase();
                } else {
                    return v;
                }
            } else {
                return v[0].toUpperCase() + v.toLowerCase().slice(1);
            }
        })
        .join(" ");
};

let ctx_search = "https://search.un.org/results.php?query={0}&lang={1}&tpl=ods";
let ctx_file = "http://daccess-ods.un.org/access.nsf/get?open&DS={0}&Lang={1}";
let ctx_doc = "https://daccess-ods.un.org/access.nsf/GetFile?Open&DS={0}&Lang={1}&Type=DOC";
let ctx_ref = "{0}, {1}, {2}, {3}, available at: https://undocs.org/{3} [accessed {4}]"; //委员会名称，标题，发布时间，文件路径，当前日期
let ctx_refworld = "http://www.refworld.org/cgi-bin/texis/vtx/rwmain?page=search&skip=0&query={0}"; //文件标题

function main() {
    let l = $("#zh_CN")[0].checked ? "zh_CN" : "en_US";
    let vp = $("#path").text() || "";
    let vs = $("#search").text() || "";
    let ftype = getFileType();
    if (vp.trim()) {
        $("#search")[0].parentNode.style = "";
        download($("#path").text(), languages[l].file, vp, ftype);
    } else if (vs.trim()) {
        $("#search")[0].parentNode.style = "";
        search($("#search").text(), languages[l], ftype);
    } else {
        $("#search")[0].parentNode.style = "color: red;";
    }
}

function search(str, language, ftype) {
    let files = [];
    let lang = language.search;
    let jqXHR = $.get(ctx_search.format(encode(str), encode(lang)), data => {
        if (String(data).includes("No pages were found containing")) {
            err("没有搜索到相关信息。");
            return false;
        }
        let htmlNode = document.createElement("html");
        htmlNode.innerHTML = data;
        let nodes = htmlNode.querySelectorAll("div#search-results article");
        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].innerHTML);
            let fix = nodes[i].innerHTML.split(
                '<div style="font-weight: bold; border-bottom: 0; font-size:1em; color: #005778">'
            )[1];
            if(!fix || fix.length < 2)
                return;
            let title = fix.split("</div>")[0];
            let lines = nodes[i].innerText
                .replace(/\s+/g, str => {
                    if (str.includes("\n")) {
                        return "\n";
                    } else {
                        return " ";
                    }
                })
                .replace(/联\s?合\s?国/, "联合国")
                .slice(1)
                .split("\n");
            let path = lines[0];
            lines.shift(); // PATH
            lines.shift(); // TITLE
            let text = lines.join("\n");
            files.push({
                about: path + "\n\n" + title.toTitle() + "\n\n" + text,
                path,
                file: language.file,
                title
            });
        }
        asklist(files, ftype);
    });
}

function asklist(list, ftype) {
    if (list.length === 0) {
        return;
    }
    var line = 0;
    swal({
        title: `下载文件？`,
        html:
            "摘要：<br />" +
            list[0].about
                .replace(/\</g, "&lt;")
                .replace(/\>/g, "&gt;")
                .replace(/(.*\n.*)/g, function($1) {
                    if (!$1.trim() || $1.trim() === "-") return "";
                    if (line <= 9) {
                        if ($1.replace(/[()[];.\d]+/g, "").trim().length > 5) {
                            line++;
                            if ($1.length > 32) {
                                $1 = $1.slice(0, 16) + "<br />" + $1.slice(16);
                            }
                            return $1.trim() + "<br />";
                        } else {
                            return $1.trim();
                        }
                    } else {
                        return "";
                    }
                }),
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#999",
        confirmButtonText: "下载该文件",
        cancelButtonText: "下一份文件",
        closeButtonAriaLabel: "退出",
        confirmButtonClass: "btn btn-success",
        cancelButtonClass: "btn btn-info",
        buttonsStyling: false
    }).then(
        () => {
            let fdate = getPublishDate(list[0].file, list[0].about);
            download(list[0].path, list[0].file, list[0].title, ftype, true, fdate, function () {
                list.shift();
                asklist(list);
            });
        },
        dismiss => {
            if (dismiss === "cancel") {
                list.shift();
                asklist(list);
            }
        }
    );
}

function download(p, l, t, ftype = "PDF", isTitle = false, filedate="文件发布日期", callback) {
    if(!navigator.onLine) {
        clearTimeout(CACHE.inter.pop());
        return err("Download failed: Your computer is offline!", "Network Error");
    }
    let lang = l === "C" ? "中文" : "英文";
    swal({
        title: "处理中",
        text: isTitle
            ? `正在尝试下载${t}，语言为${lang}，格式为${ftype}……`
            : `正在尝试下载${t}号文件，语言为${lang}，格式为${ftype}……`,
        timer: 5000,
        type: "info",
        allowOutsideClick: false,
        onOpen: () => {
            swal.showLoading()
        }
    }).then(res => {}, rej => {});
    let u;
    if (!p.startsWith("http")) {
        if (ftype !== "DOC") {
            u = ctx_file.format(p, l);
        } else {
            u = ctx_doc.format(p, l);
            downloadDOC(
                u,
                `Download DOC: ${p} ${t || "TITLE NOT AVAILABLE"}`,
                p,
                callback
            );
        }
    } else {
        if (p.startsWith("/")) {
            p = p.slice(1);
        }
        let arr = p.replace(/^https?\:\/\//, "").split("/");
        arr.shift();
        p = arr.join("/");
        if (ftype !== "DOC") {
            u = ctx_file.format(p, l);
        } else {
            u = ctx_doc.format(p, l);
            downloadDOC(
                u,
                `Download DOC: ${p} ${t || "TITLE NOT AVAILABLE"}`,
                p,
                callback
            );
        }
    }
    CACHE.inter.push(setTimeout(function () {
        swal({
            input: 'text',
            html: '自动生成的引用文字（请仔细检查，仅供参考）<div title="他们是：张馨怡，任梓彰，吴开元和王子轩；排名不分先后">感谢我在BJMUNC18 UNDPen的主席们启发</div>',
            confirmButtonText: '复制',
            showCancelButton: true,
            inputValue: ctx_ref.format(getCommittee(l, p), t, filedate, p, getDateStr()),
            reverseButtons: true,
            preConfirm () {
                $(".swal2-input")[0].select();
                document.execCommand("copy");
                return new Promise(res => {
                    res(true);
                });
            }
        }).then(res => {}, rej => {});
    }, 5200));
    $.get(u, data => {
        if (data.includes("There is no document matching your request")) {
            clearTimeout(CACHE.inter.pop());
            swal("下载失败", "该文件不存在于联合国ODS上。", "error");
            return false;
        } else if(data.includes("Error 91: Object variable not set")) {
            swal("下载失败", "该DOC文件不存在于联合国ODS上。", "error");
            clearTimeout(CACHE.inter.pop());
            return false;
        }
        let partialHTML = data.split("URL=")[1];
        if(!partialHTML) {
            swal("出错了！", "文件下载失败：这可能是因为联合国ODS上没有这份文件。", "error");
            clearTimeout(CACHE.inter.pop());
            return false;
        }
        let redir = partialHTML.split('">')[0];
        log("正在跳转到" + redir + "，请稍候……");
        if(process.platform === "darwin") {
            child_process.exec("open " + "https://daccess-ods.un.org" + redir);
        } else {
            let w = window.open(
                "https://daccess-ods.un.org" + redir,
                `Download PDF: ${p} ${t || "TITLE NOT AVAILABLE"}`
            );
        }
        $("#path").text(p);
        if (isTitle) {
            let divNode = $("<div>").text(`文件路径为${p}`);
            $("<br>").appendTo($("div#swal2-content"));
            divNode.appendTo($("div#swal2-content"));
            divNode.rubberBand();
        }
        return true;
    });
}

$("#path")[0].addEventListener(
    "keydown",
    ev => {
        if ((ev.code || ev.keyCode) === 13 || ev.key === "Enter") {
            $("a#submit").click();
        }
    },
    { passive: true }
);

$("#submit").click(main);

function getFileType() {
    let pdf = $("#d_pdf")[0].checked;
    let doc = $("#d_doc")[0].checked;
    if (pdf) {
        return "PDF";
    } else if (doc) {
        return "DOC";
    } else {
        (console.warn || console.log)("获取文件格式失败，fallback到PDF");
        window.LAST_ERROR_EVENT = "Failed to get file type: web::getFileType@L457 " + [pdf, doc].join();
        return "PDF";
    }
}

function downloadDOC(url, title, _path = "", callback) {
    callback = callback || emptyCallback;
    if(process.platform === "darwin") {
        child_process.exec("open " + url);
    } else {
        window.open(url, title);
    }
    $("#path").text(_path);
    swal({
        title: "免责声明",
        html: "UN PDF Downloader不保证从联合国官网上下载的文件绝对安全。<br />请确保您的电脑上已经安装了必要的安全更新。",
        type: "warning"
    });
    setTimeout(function () {
        callback();
    }, 1000);
}

function getCommittee(lang, path) {
    if(lang === "C")
        return getChnCommitteeName(path);
    else return getEngCommitteeName(path);
}

function getEngCommitteeName (path="") {
    let start = path.split("/")[0];
    if(start === "A") {
        let next = path.split("/")[1];
        switch (next) {
            case "C.1":
                return "United Nations General Assembly First Committee";
            case "C.2":
                return "United Nations General Assembly Second Committee";
            case "C.3":
                return "United Nations General Assembly Third Committee";
            case "C.4":
                return "United Nations General Assembly Fourth Committee";
            case "C.5":
                return "United Nations General Assembly Fifth Committee";
            case "C.6":
                return "United Nations General Assembly Sixth Committee";
            case "HRC":
                return "United Nations Human Rights Council";
            default:
                return "United Nations General Assembly";
        }
    }
    switch (start) {
        case "S":
            return "United Nations Security Council";
        case "E":
            return "United Nations Economic and Social Council";
        case "ST":
            return "United Nations Secretariat";
        case "AT":
            return "United Nations Administrative Tribunal";
        case "APLC":
            return "United Nations Anti Personnel Landmine Convention";
        case "UNEP":
            return "United Nations Environment Programme";
        case "FCCC":
            return "United Nations Framework Convention on Climate Change";
        default:
            return "United Nations";
    }
}

function getChnCommitteeName (path="") {
    let start = path.split("/")[0];
    if(start === "A") {
        let next = path.split("/")[1];
        switch (next) {
            case "C.1":
                return "联合国大会第一委员会";
            case "C.2":
                return "联合国大会第二委员会";
            case "C.3":
                return "联合国大会第三委员会";
            case "C.4":
                return "联合国大会第四委员会";
            case "C.5":
                return "联合国大会第五委员会";
            case "C.6":
                return "联合国大会第六委员会";
            case "HRC":
                return "联合国人权理事会";
            default:
                return "联合国大会";
        }
    }
    switch (start) {
        case "S":
            return "联合国安全理事会";
        case "E":
            return "联合国经济和社会理事会";
        case "ST":
            return "联合国秘书处";
        case "AT":
            return "联合国行政法庭";
        case "APLC":
            return "联合国杀伤人员地雷公约";
        case "UNEP":
            return "联合国环境署";
        case "FCCC":
            return "联合国气候变化框架公约"
        default:
            return "联合国";
    }
}

function getDateStr() {
    let time = new Date();
    return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`;
}

function getPublishDate(lang, about="") {
    let start = "Publication Date: ";
    if(lang === "C")
        start = "出版日期: ";
    let lines = about.split("\n");
    for(let i = 0; i < lines.length; i++) {
        if(lines[i].startsWith(start)) {
            return lines[i].replace(start, "").replace(",", "");
        }
    }
}
