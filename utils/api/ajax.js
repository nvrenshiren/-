import Promise from '../lib/promise.min';

function APIAJAX(params) {
    params.url = params.url.indexOf("https%") < 0 ? params.url : unescape(decodeURI(params.url));
    params.header.cookie = wx.getcookie();
    return new Promise((resolve, reject) => {
        wx.request({
            url: params.url,
            data: params.data,
            method: params.method,
            header: params.header,
            success: (res) => {
                wx.checkhead(res.header);
                resolve(res.data)
            },
            fail: (res) => {
                reject(res.data)
            }
        });
    });
}

module.exports = {
    get(params) {
        params.method = "GET";
        params.header = {
            "content-type": "application/json"
        };
        return APIAJAX(params);
    },
    post(params) {
        params.method = "POST";
        params.header = {
            "content-type": "application/x-www-form-urlencoded"
        };
        params.data = !!params.data ? params.data : {};
        return APIAJAX(params);
    }
};