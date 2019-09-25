module.exports = {
  blank(params) {
    var url = params.local ? "/pages/" + params.local + "/" + params.local : "/pages/content/content";
    var Set = [];
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        var item = params[key].replace(/"([^"]*)"/g, "'$1'");
        Set.push(key + "=" + encodeURI(escape(item)));
      }
    }
    var Param = Set.join("&");
    wx.navigateTo({
      url: url + "?" + Param
    });
  },
  self(params) {},
  toopen(params) {},
  switchTab(params) {},
  back(prve = 1) {}
};