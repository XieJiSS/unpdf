"use strict";

window.onerror = function handleError(err_str) {
    window.LAST_ERROR_EVENT = err_str;
};

const swal = require("sweetalert2");

$(".feedback").click(function () {
    swal({
        title: "反馈方式",
        html: `请发送反馈邮件至g171117@126.com，并提供以下信息：<br /><br />版本号：${
            window.UNPDF_VERSION
        }<br />LAST_ERROR：${
            window.LAST_ERROR_EVENT || null
        }`,
        type: "error"
    });
});