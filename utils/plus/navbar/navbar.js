import ComBox from '../../plus/combox/combox';
import TmBox from '../../plus/tmbox/tmbox';
import Config from '../../plus/config/config';
module.exports = {
  Page: null,
  Params: {},
  PageParams: null,
  PageData: null,
  ComBox: ComBox,
  Config: Config,
  TmBox:TmBox,
  init(Page) {
    var that = this;
    that.Page = Page;
    that.PageParams = that.Page.Params;
    that.FavData = that.getFav();
    //事件代理
    that.Page['NavEvent'] = (e) => {
      that.On.call(that, e);
    };
    //其他
    that.ComBox.init(that.Page);
    that.TmBox.init(that.Page);
    that.Config.init(that.Page);
  },
  Format(pagedata) {
    var that = this;
    that.PageData = pagedata;
    //初始化各个参数
    that.Params = {
      "combtn": {
        "show": true
      },
      "comlink": {
        "show": true
      },
      "favbtn": {
        "show": true,
        "status": (!!that.FavData && that.FavData.filter(item => (item.url == that.PageParams.url)).length > 0) ? true : false
      },
      "picbtn": {
        "show": that.PageParams.template == "show_pics"
      },
      "config": {
        "show": that.PageParams.template != "show_pics" && that.PageParams.template != "show_live"
      },
      "tmbtn": {
        "show": that.PageParams.template == "show_live"
      }
    }
    that.setData();
    that.ComBox.getComnum(that.PageData.commentid);
  },
  On(e) {
    var that = this;
    var data = e.currentTarget.dataset;
    switch (data.name) {
      case "confav":
        that[that.Params.favbtn.status ? "DelFav" : "AddFav"]()
        break;
      case "combox":
        that.ComBox.Open(that.PageData.commentid, 0);
        break;
      case "viewcom":
        data["commentid"] = that.PageData.commentid;
        wx.link.blank(data);
        break;
      case "config":
        that.Config.Open();
        break;
      case "tmbox":
        that.TmBox.Open(that.PageData.id);
        break;
    }
  },
  setData() {
    var that = this;
    that.Page.setData({
      navbar: that.Params
    });
  },
  getParams() {
    var that = this;
    return that.Params;
  },
  getFav() {
    return wx.getItem(wx.PW.FavData);
  },
  AddFav() {
    var that = this;
    var Old = that.getFav() || [];
    Old.unshift(that.PageParams);
    wx.setItem(wx.PW.FavData, Old);
    that.Params.favbtn.status = true;
    that.setData();
    wx.toast("收藏成功");
  },
  DelFav() {
    var that = this;
    var Old = that.getFav();
    var New = !!Old ? Old.filter(item => (item.url != that.PageParams.url)) : [];
    wx.setItem(wx.PW.FavData, New);
    that.Params.favbtn.status = false;
    that.setData();
    wx.toast("取消收藏");
  }
}