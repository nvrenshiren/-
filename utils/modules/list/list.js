import Loading from '../../plus/loading/loading';
import imgLoader from '../../plus/imgloader/imgloader';
module.exports = {
  Page: null,
  Done: false,
  PullDown: false,
  PullUp: false,
  SlideData: [],
  ListData: [],
  ListPage: 1,
  CatObj: null,
  SlideIndex: 0,
  Loading: Loading,
  imgLoader: imgLoader,
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
    }
  },
  setData(params = {}) {
    var that = this;
    that.Page.setData({
      list: {
        catobj: !!params.catobj ? params.catobj : that.CatObj,
        listpage: !!params.listpage ? params.listpage : that.ListPage,
        slideindex: !!params.slideindex ? params.slideindex : that.SlideIndex,
        data: {
          slidedata: !!params.slidedata ? params.slidedata : that.SlideData,
          listdata: !!params.listdata ? params.listdata : that.ListData
        }
      }
    });
  },
  GetData() {
    var that = this;
    var dataurl = that.CatObj.url;
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
    that.SlideData = data.position;
    that.ListData = (that.ListPage > 1) ? that.ListData.concat(data.lists) : data.lists;
    that.Done = (data.lists.length == 0);
    that.setData();
    that.Loading[data.lists.length > 0 ? "Done" : "None"]();
    wx.stopPullDownRefresh();
    that.IsPD = false;
  },
  Refresh() {
    var that = this;
    that.SlideIndex = 0;
    that.Done = false;
    that.ListPage = 1;
    that.GetData();
  },
  Reach() {
    var that = this;
    if (!that.Loading.Status) { //正在加载中不继续获取下一页
      if (!!that.Done) {
        that.Loading.None();
      } else {
        that.ListPage = that.ListPage + 1;
        that.Loading.Ing();
        that.GetData();
      }
    }
  },
  Format(index) {
    var that = this;
    that.CatObj = that.Page.data.category[index];
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