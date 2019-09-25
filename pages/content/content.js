import Content from '../../utils/modules/content/content';
var PageInit = {
  options: {},
  data: {},
  Plus: {
    Content: Content
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
    //其他处理
    if (params.template == "show_pics") {
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#000"
      });
    }
  },
  onShow(params) {
    var that = this;
  },
  onReady(params) {
    var that = this;
    //初始化模块或者组件
    that.loadPlus();
    //获取页面数据
    that.Plus.Content.GetData();
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