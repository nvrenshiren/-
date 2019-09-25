import Loading from '../../plus/loading/loading';
import imgLoader from '../../plus/imgloader/imgloader';
module.exports = {
  Page: null,
  Done: false,
  PullDown: false,
  PullUp: false,
  Data: [],
  ListData: [],
  ListPage: 1,
  Loading: Loading,
  imgLoader: imgLoader,
  PageSize: 20,
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
    var Start = (that.ListPage - 1) * that.PageSize;
    that.CheckData(that.Data.slice(Start, that.PageSize * that.ListPage));
  },
  CheckData(data) {
    var that = this;
    that.ListData = (that.ListPage > 1) ? that.ListData.concat(data) : data;
    that.Done = (data.length == 0);
    that.setData();
    that.Loading[data.length > 0 ? "Done" : "None"]();
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
  Format(Data = [], PageSize = 20) {
    var that = this;
    that.Data = Data;
    that.PageSize = PageSize;
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