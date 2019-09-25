import My from '../../utils/modules/my/my';
var PageInit = {
  data: {},
  options: {},
  Plus: {
    My: My
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
  onShow() {
    var that = this;
  },
  auth() {
    wx.login({
      success: (login) => {
        wx.getUserInfo({
          withCredentials: true,
          success: (info) => {
            info["code"] = login.code;
            wx.ajax.post({
              url: wx.PW.Home + "weixin/api.php",
              data: info
            }).then(data => {
              console.log(data);
            });
          }
        });
      }
    });
  },
  onReady() {
    var that = this;
    //初始化模块或者组件
    that.loadPlus();
    that.Plus.My.GetData();
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
  onPageScroll() {},
  loadPlus() {
    var that = this;
    //初始化模块或者组件
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