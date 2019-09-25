import Loading from '../../plus/loading/loading';
import imgLoader from '../../plus/imgloader/imgloader';
import WxParse from '../../plus/wxParse/wxParse';
module.exports = {
  Page: null,
  Done: false,
  PullDown: false,
  PullUp: false,
  ListData: [],
  ListPage: 1,
  Loading: Loading,
  imgLoader: imgLoader,
  PageParams: null,
  DataUrl: "",
  FormatHtml: false,
  init(Page) {
    var that = this;
    that.Page = Page;
    that.Loading.init(that.Page);
    that.imgLoader.init(that.Page);
    that.PullDown = !!that.Page.options.window.enablePullDownRefresh;
    //下拉刷新代理
    that.Page.onPullDownRefresh = () => {
      if (!!that.PullDown) {
        return that.Refresh();
      }
    }
    //上拉加载代理
    that.Page.onReachBottom = () => {
      if (!!that.PullDown) {
        return that.Reach();
      }
    }
    //其他事件代理
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
      case "scrollbot":
        if (!that.Loading.Status) { //上一次加载完才继续加载此次请求
          return that.Reach();
        }
        break;
    }
  },
  setData(params = {}) {
    var that = this;
    that.Page.setData({
      lists: that.ListData
    });

  },
  GetData() {
    var that = this;
    var dataurl = that.DataUrl;
    var listpage = that.ListPage;
    dataurl = (dataurl.indexOf("http") < 0) ? APP.Home + dataurl + ((listpage != 1) ? listpage + ".html" : "index.html") : (dataurl.substr(-1) == "=") ? dataurl + listpage : dataurl + "&page=" + listpage;
    wx.ajax.get({
      url: dataurl
    }).then(data => {
      setTimeout(() => {
        that.CheckData(data);
      }, 1000)
    });

  },
  CheckData(data) {
    var that = this;
    that.ListData = (that.ListPage > 1) ? that.ListData.concat(data.lists) : data.lists;
    if (!!that.FormatHtml) {
      that.ListData.map(function (item, key, ary) {
        WxParse.wxParse(`content[${key}]`, 'html', item.content, that.Page, 0);
      });
    }
    that.Done = (data.lists.length == 0);
    that.setData();
    that.Loading[data.lists.length > 0 ? "Done" : "None"]();
    wx.stopPullDownRefresh();
  },
  Refresh() {
    var that = this;
    that.Done = false;
    that.ListPage = 1;
    that.GetData();
  },
  Reach() {
    var that = this;

    if (!!that.Done) {
      that.Loading.None();
    } else {
      that.ListPage = that.ListPage + 1;
      that.Loading.Ing();
      that.GetData();
    }

  },
  Format(DataUrl = "", FormatHtml = false) {
    var that = this;
    that.DataUrl = DataUrl;
    that.FormatHtml = FormatHtml;
    if (!!that.PullDown) {
      if (wx.PW.ios) {
        // wx.startPullDownRefresh();
        that.Refresh();
      } else {
        wx.startPullDownRefresh();
      }
    } else {
      that.Refresh();
    }
  }
}