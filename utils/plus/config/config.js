module.exports = {
  Page: null,
  Params: {
    show: false,
    fontsize: 28,
    night: false
  },
  init(Page) {
    var that = this;
    that.Page = Page;
    //事件代理
    that.Page['ConfigEvent'] = (e) => {
      that.On.call(that, e);
    };

  },
  On(e) {
    var that = this;
    var data = e.currentTarget.dataset;
    switch (data.name) {
      case "config":
        that.Hide();
        break;
      case "fontsize":
        that.Params.fontsize = e.detail.value;
        that.setData();
        break;
      case "night":
        that.Params.night = e.detail.value;
        var bgcolor = e.detail.value ? "#000" : "#fff";
        wx.setPageStyle({
          style: {
            "background": bgcolor
          }
        });
        that.setData();
        break;
    }
  },
  setData() {
    var that = this;
    that.Page.setData({
      config: that.Params
    });
  },
  Open() {
    var that = this;
    that.Params.show = true;
    that.setData();
  },
  Hide() {
    var that = this;
    that.Params.show = false;
    that.setData();
  }
}