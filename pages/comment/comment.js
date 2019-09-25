import Comment from '../../utils/modules/comment/comment';
var PageInit = {
  options: {},
  data: {},
  Plus: {
    Comment: Comment
  },
  Params: {},
  onLoad(params) {
    var that = this;
    var config = __wxConfig;
    var file = that.route + ".html";
    var pageconfig = config["page"][file];
    that.options = {
      WebviewId: that.__wxWebviewId__,
      route: that.route,
      file: file,
      scene: config.appLaunchInfo.scene,
      window: pageconfig.window
    }
    var Params = wx.intkey(params);
    that.setData({
      params: Params
    });
    that.Params = Params;
  },
  onShow(params) {
    var that = this;
  },
  onReady(params) {
    var that = this;
    //初始化模块或者组件
    that.loadPlus();
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
  onPageScroll() {},
  loadPlus() {
    var that = this;
    if (!!that.Plus) {
      for (var item in that.Plus) {
        var plus = that.Plus[item];
        if (typeof (plus["init"]) == "function") {
          plus["init"](that);
        }
      }
    }
  }
}
//执行
Page(PageInit);