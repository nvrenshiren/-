var SysInfo = wx.getSystemInfoSync();
//设置自定义全局
Object.setPrototypeOf(wx, {
  PW: {
    Openid: null,
    UserInfo: null,
    Category: null,
    Location: null,
    SysInfo: SysInfo,
    Home: "https://news.sowhat.cc/",
    Name: "韶关头条",
    Url: "https://news.sowhat.cc/app/",
    CDN: "https://news.sowhat.cc/",
    Logo: "widget://image/logo.png",
    WeatherUrl: "https://free-api.heweather.com/x3/weather",
    WeatherKey: "b2e7566fdc79406da6567afe810253f8",
    City: "武汉",
    ios: !(SysInfo.system.indexOf("iOS") < 0),
    FavData: "favcon",
    ViewData: "viewcon",
    Cookie: "cookie",
    CookiePre: "GoOst",
    User: "user"
  },
  ajax: require('../api/ajax'),
  link: require('../api/link'),
  $(selector, callback, index = 0) {
    var nodesRef = wx.createSelectorQuery().selectAll(selector);
    if (typeof (callback) == "function") {
      nodesRef.fields({
        dataset: true,
        size: true,
        rect: true,
        scrollOffset: true,
        properties: ['class', 'style']
      }).exec((res) => {
        callback(res[0][index]);
      });
    } else { //没写回调的全返回nodesRef对象,额外去调用
      return nodesRef;
    }
  },
  setItem(key, value) {
    wx.setStorageSync(key, value);
  },
  getItem(key) {
    var result = wx.getStorageSync(key);
    return result;
  },
  removeItem(key) {
    wx.removeStorageSync(key);
  },
  clearItem() {
    wx.clearStorageSync()
  },
  toast(txt, icon = "") {
    wx.showToast({
      title: txt,
      icon: icon,
      duration: 2000
    })
  },
  //页面相关扩展
  getpage(route = null) {
    var pages = getCurrentPages();
    var selector;
    if (!!route) {
      var route = ["pages", route, route].join("/");
      selector = pages.filter(page => page.route == route)[0];
    } else {
      selector = pages[pages.length - 1];
    }
    return selector;
  },
  exec(route = null, exec = null) {
    var page = this.getpage(route);
    //跨页面执行脚本---页面必须打开的;
    typeof (exec) == "function" && typeof (page.execScript) == "function" && page.execScript(exec);
  },
  pagedata(route = null) {
    var page = this.getpage(route);
    return page.data;
  },
  pageparams(route = null) {
    var page = this.getpage(route);
    return page.data.params;
  },
  getOpenId(callback) {
    var that = this
    if (that.PW.Openid) {
      callback(null, that.PW.Openid)
    } else {
      wx.login({
        success: function (data) {
          wx.request({
            url: config.openIdUrl,
            data: {
              code: data.code
            },
            success: function (res) {
              console.log('拉取openid成功', res)
              that.PW.Openid = res.data.openid
              callback(null, that.PW.Openid)
            },
            fail: function (res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  //cookie
  checkhead(header) {
    var cookie;
    if (cookie = header["set-cookie"]) {
      this.setcookie(cookie);
    }
  },
  getcookie() {
    var cookies = wx.getItem(wx.PW.Cookie);
    cookies = !!cookies ? cookies : {};
    var rn = [];
    for (const key in cookies) {
      rn.unshift(`${key}=${cookies[key]}`);
    }
    return rn.join(";");
  },
  setcookie(cookie) {
    var old = wx.getItem(wx.PW.Cookie);
    var cleck = !!old ? old : {};
    var cookies = cookie.split(",").filter(item => item.indexOf(wx.PW.CookiePre) == 0).map((item) => {
      return item.split(";")[0]
    });
    cookies.forEach(element => {
      var [key, value] = element.split("=");
      cleck[key] = value;
    });
    wx.setItem(wx.PW.Cookie, cleck);
  },
  //文章相关
  toview(pageparams) {
    var Old = wx.getItem(wx.PW.ViewData);
    var New = !!Old ? Old.filter(item => (item.url != pageparams.url)) : [];
    New.unshift(pageparams);
    wx.setItem(wx.PW.ViewData, New);
    console.log(wx.getStorageInfoSync());
  },
  intkey(obj) {
    return JSON.parse(unescape(unescape(JSON.stringify(obj))));
  }
});