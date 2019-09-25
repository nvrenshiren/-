module.exports = {
  Page: null,
  Params: {
    show: false,
    replyid: 0,
    commentid: "",
    comnum: 0,
    input: ""
  },
  ApiUrl: wx.PW.Home + "index.php?m=comment&c=index&format=json",
  init(Page) {
    var that = this;
    that.Page = Page;
    //事件代理
    that.Page['ComBoxEvent'] = (e) => {
      that.On.call(that, e);
    };
    //
  },
  On(e) {
    var that = this;
    var data = e.currentTarget.dataset;
    switch (data.name) {
      case "postcom":
        wx.ajax.post({
          url: that.ApiUrl + "&commentid=" + that.Params.commentid + "&a=post&id=" + that.Params.replyid,
          data: {
            content: that.Params.input
          }
        }).then(res => {
          
          if (!!that.Page.options.window.enablePullDownRefresh) { //触发下拉刷新
            if (wx.PW.ios) {
              wx.startPullDownRefresh();
              that.Page.onPullDownRefresh();
            } else {
              wx.startPullDownRefresh();
            }
          }
          that.Params.comnum++;

          that.Params.input = "";
          that.Hide();
          wx.toast(res.msg);
        });
        break;
      case "combox":
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
      combox: that.Params
    });
  },
  Open(commentid, replyid) {
    var that = this;
    that.Params.show = true;
    that.Params.commentid = commentid;
    that.Params.replyid = replyid;
    that.setData();
  },
  Hide() {
    var that = this;
    that.Params.show = false;
    that.setData();
  },
  getComnum(commentid) {
    var that = this;
    //获取评论数
    wx.ajax.get({
      url: `${wx.PW.Home}api.php?op=commentsnum&commentid=${commentid}`
    }).then(data => {
      that.Params.comnum = data * 1;
      that.setData();
    });
  }
}