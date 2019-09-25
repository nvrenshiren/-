import List from '../../utils/modules/list/list';
import Subnav from '../../utils/plus/subnav/subnav';
var PageInit = {
  data: {},
  options: {},
  Plus: {
    List: List,
    Subnav: Subnav
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
    wx.ajax.get({
      url: wx.PW.Url
    }).then(data => {
      wx.PW.Category = data.category;
      that.setData({
        category: data.category.filter(item => item.ismenu == "1" && item.parentid == "0" && item.modelid != "0")
      });
      that.Plus.List.Format(0);
    });
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
  onPageScroll(params) {
    
  },
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
  },
  execScript(exec) {
    typeof (exec) == "function" && exec(this);
  }
}
//执行
Page(PageInit);