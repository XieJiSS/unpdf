/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   web.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JieJiSS <c141028@protonmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/11/25 14:59:30 by JieJiSS           #+#    #+#             */
/*   Updated: 2017/11/25 14:59:30 by JieJiSS          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

"use strict";

const http = require("http");

const swal = require("sweetalert2");

const ver = 140;

function log(str) {
    $("#log div.log").text(str);
}

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

function updateUNPDF (url="http://jiejiss.xyz/unpdf-download") {
    ipcRenderer.send("update", url);
}

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

const { ipcRenderer } = require("electron");

function check() {
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
                            .join(".")}`;
                        swal({
                            title: "更新",
                            text: `有新版本：当前版本v${ver
                                .toString()
                                .split("")
                                .join(".")}，新版本为v${info.ver
                                .toString()
                                .split("")
                                .join(".")}`,
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
                    } else {
                        document.title += ` v${String(ver)
                            .split("")
                            .join(".")}`;
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
let ctx_doc =
    "https://daccess-ods.un.org/access.nsf/GetFile?Open&DS={0}&Lang={1}&Type=DOC";

function main() {
    let l = $("#zh_CN")[0].checked ? "zh_CN" : "en_US";
    let vp = $("#path").val() || "";
    let vs = $("#search").val() || "";
    let ftype = getFileType();
    if (vp.trim()) {
        $("#search")[0].parentNode.style = "";
        download($("#path").val(), languages[l].file, vp, ftype);
    } else if (vs.trim()) {
        $("#search")[0].parentNode.style = "";
        search($("#search").val(), languages[l], ftype);
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
        let html = document.createElement("html");
        html.innerHTML = data;
        let doc = html;
        let nodes = doc.querySelectorAll("div#search-results article");
        for (var i = 0; i < nodes.length; i++) {
            console.log(nodes[i].innerHTML);
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
                    if (line <= 7) {
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
            download(list[0].path, list[0].file, list[0].title, ftype, true);
        },
        dismiss => {
            if (dismiss === "cancel") {
                list.shift();
                asklist(list);
            }
        }
    );
}

function download(p, l, t, ftype = "PDF", isTitle = false) {
    swal({
        title: "处理中",
        text: isTitle
            ? `正在尝试下载${t}，格式为${ftype}……`
            : `正在尝试下载${t}号文件，格式为${ftype}……`,
        timer: 5000,
        type: "info",
        allowOutsideClick: false
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
                p
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
                p
            );
        }
    }
    $.get(u, data => {
        if (data.includes("There is no document matching your request")) {
            swal("下载失败", "该文件不存在于联合国ODS上。", "error");
            return false;
        }
        let redir = data.split("URL=")[1].split('">')[0];
        log("Redirecting to " + redir + "...");
        let w = window.open(
            "https://daccess-ods.un.org" + redir,
            `Download PDF: ${p} ${t || "TITLE NOT AVAILABLE"}`
        );
        $("#path").val(p);
        if (isTitle) {
            let divNode = $("<div>").text(`文件路径为${p}`);
            $("<br>").appendTo($("div#swal2-content"));
            divNode.appendTo($("div#swal2-content"));
            divNode.rubberBand();
        }
        return true;
    });
}

$("input#path")[0].addEventListener(
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
        (console.warn || console.log)("未获取到文件格式！");
        return "PDF";
    }
}

function downloadDOC(url, title, _path = "") {
    window.open(url, title);
    $("#path").val(_path);
    swal({
        title: "免责声明",
        html:
            "不保证从联合国官网上下载的文件绝对安全。<br />请确保您的电脑上已经安装了必要的安全更新。",
        type: "warning"
    });
}
