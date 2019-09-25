import List from '../../utils/modules/list/list';
var PageInit = {
  data: {},
  options: {},
  Plus: {
    List: List
  },
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
    that.setData({
      params: wx.intkey(params)
    });
  },
  onShow() {
    var that = this;
  },
  onReady() {
    var that = this;
    //初始化模块或者组件
    that.loadPlus();
    //获取栏目数据
    that.setData({
      category: wx.PW.Category.filter(item => item.ismenu == "1" && item.parentid == that.data.params.catid && item.modelid != "0")
    });



    //获取领导数据
    wx.ajax.get({
      url: `${wx.PW.Home}index.php?m=content&c=index&a=lists&catid=${that.data.params.catid}`
    }).then((data) => {
      that.setData({
        boss: data
      });
    });




    that.Plus.List.Format(0);
  },
  onHide() {
    var that = this;
  },
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