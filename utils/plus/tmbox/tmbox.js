module.exports = {
  Page: null,
  Params: {
    show: false,
    input: "",
    liveid: 0
  },
  ApiUrl: wx.PW.Home + "index.php?m=live&c=index&a=tanmu",
  init(Page) {
    var that = this;
    that.Page = Page;
    //事件代理
    that.Page['TmBoxEvent'] = (e) => {
      that.On.call(that, e);
    };
    //
  },
  On(e) {
    var that = this;
    var data = e.currentTarget.dataset;
    switch (data.name) {
      case "posttm":
        wx.ajax.post({
          url: that.ApiUrl + "&liveid=" + that.Params.liveid,
          data: {
            content: that.Params.input,
            dosubmit: 1
          }
        }).then(res => {
          if (!res.error) {
            that.Page.Plus.Live.sendDanmu(that.Params.input);
          }
          that.Params.input = "";
          that.Hide();
          wx.toast(res.msg);
        });
        break;
      case "tmbox":
        that.Hide();
        break;
      case "getinput":
        that.Params.input = e.detail.value;
        that.setData();
        break;
    }
  },
  setData() {
    var that = this;
    that.Page.setData({
      tmbox: that.Params
    });
  },
  Open(liveid) {
    var that = this;
    that.Params.show = true;
    that.Params.liveid = liveid;
    that.setData();
  },
  Hide() {
    var that = this;
    that.InputCon = "";
    that.Params.show = false;
    that.setData();
  }
}