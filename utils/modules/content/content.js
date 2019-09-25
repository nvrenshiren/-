import WxParse from '../../plus/wxParse/wxParse';
import imgLoader from '../../plus/imgloader/imgloader';
import NavBar from '../../plus/navbar/navbar';
module.exports = {
  Page: null,
  Data: {},
  Params: null,
  imgLoader: imgLoader,
  NavBar: NavBar,
  init(Page) {
    var that = this;
    that.Page = Page;
    that.Params = that.Page.Params;
    that.imgLoader.init(that.Page);
    that.NavBar.init(that.Page);
    //其他事件代理
    //内容事件
    that.Page['ConEvent'] = (e) => {
      that.On.call(that, e);
    };
    //列表事件
    that.Page['ListEvent'] = (e) => {
      that.On.call(that, e);
    };
  },
  On(e) {
    var that = this;
    var data = e.currentTarget.dataset;
    switch (data.name) {
      case "downimg":
        that.imgLoader.Down(e.currentTarget);
        break;
      case "view":
        wx.link.blank(data);
        break;
      case "changeindex":
        that.Data["slideindex"] = e.detail.current + 1;
        that.setData();
        break;
      case "viewpic":
        wx.previewImage({
          current: data.src,
          urls: that.Data.pictureurls
        })
        break;
    }
  },
  setData() {
    var that = this;
    that.Page.setData({
      data: that.Data
    });
  },
  GetData() {
    var that = this;
    //获取内容数据
    wx.ajax.get({
      url: that.Params.url
    }).then(data => {
      that.Data = data;
      that.ViewAdd();
    });
  },
  ViewAdd() {
    var that = this;
    //获取浏览量
    wx.ajax.get({
      url: `${wx.PW.Home}api.php?op=ajaxview&modelid=${that.Data.modelid}&id=${that.Data.id}`
    }).then(data => {
      that.Data["view"] = data.view;
      that.setData();
      !!that.Data.content && WxParse.wxParse('content', 'html', that.Data.content, that.Page, 10);
      //初始化NavBar
      that.NavBar.Format(that.Data);
      //添加进本地记录
      wx.toview(that.Params);
    });

  }
}