"use strict";

window.onerror = function handleError(err_str) {
    window.LAST_ERROR_EVENT = err_str;
};

const swal = require("sweetalert2");

$(".feedback").click(function () {
    swal({
        title: "反馈方式",
        html: `请发送反馈邮件至g171117@126.com，并提供以下信息：<br /><br /><code>APP_VERSION: ${
            window.UNPDF_VERSION
        }</code><br /><code>LAST_ERROR: ${
            window.LAST_ERROR_EVENT || null
        }</code>`,
        type: "error"
    });
    window.open(
        "mailto:g171117@126.com?subject=UN%20PDF%20Downloader%20Feedback&body=" +
        encodeURIComponent(
            `APP_VERSION: ${
                window.UNPDF_VERSION
            };${"\n"}LAST_ERROR: ${
                window.LAST_ERROR_EVENT || null
            };${"\n"}请描述您先前所做的操作，这将有助于我重现问题：${"\n".repeat(4)}` +
            "感谢您的建议。"
        )
    );
});
