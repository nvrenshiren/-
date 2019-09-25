module.exports = {
  Page: null,
  Quality: 80,
  Mode: 1, //1为裁剪2为缩放,
  Data: {},
  init(Page) {
    var that = this;
    that.Page = Page;
    that.Page['ImgEvent'] = (e) => {
      that.On.call(that, e);
    };
  },
  On(e) {
    var that = this;
    var data = e.currentTarget.dataset;
    switch (data.name) {
      case "downthumb":
        that.Data[data.id]["loaded"] = true;
        that.setData()
        break;
    }
  },
  Down(e) {
    var that = this;
    switch (that.Cleck(e)) {
      case 0:
        var data = e.dataset;
        wx.$("#" + e.id, (ret) => {
          var quality = data.quality ? data.quality : that.Quality;
          var mode = data.mode ? data.mode : that.Mode;
          that.Data[e.id] = {};
          that.Data[e.id]["src"] = that.GetCdn(data.src, parseInt(ret.width * 1.5), parseInt(ret.height * 1.5), quality, mode);
          that.Data[e.id]["loaded"] = false;
          that.setData();
        });
        break;
      case 1:
        break;
      case 2:
        that.setData();
        break;
    }
  },
  GetCdn(src, width, height, quality, mode) {
    return src.split("?")[0] + "?imageView2/" + mode + "/w/" + width + "/h/" + height + "/q/" + quality;
  },
  setData() {
    var that = this;
    that.Page.setData({
      imgloader: that.Data
    })
  },
  Cleck(e) {
    var that = this;
    if (!!that.Data[e.id]) {
      if (that.Data[e.id]["loaded"]) { //图已加载完
        return 2;
      } else { //图正在加载中
        return 1;
      }
    } else { //未开始加载
      return 0;
    }
  },
  Clean() {
    var that = this;
    that.Data = {};
    that.setData();
  }
}