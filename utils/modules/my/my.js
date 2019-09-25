module.exports = {
  Page: null,
  Data: {},
  Params: {
    show: false,
    fontsize: 28,
    night: false
  },
  UserInfo: null,
  init(Page) {
    var that = this
    that.Page = Page
    // 事件代理
    that.Page['MyEvent'] = (e) => {
      that.On.call(that, e)
    }
    // 转发事件代理
    that.Page.onShareAppMessage = (res) => {
      return {
        title: '韶关头条小程序',
        path: 'pages/index/index',
        imageUrl: wx.PW.CDN + 'app/logo.png',
        success: function (res) {
          // 转发成功
        }
      }
    }
  },
  On(e) {
    var that = this
    var data = e.currentTarget.dataset
    switch (data.name) {
      case 'localdata':
        wx.link.blank(data)
        break
      case 'clean':
        wx.clearStorageSync()
        that.UserInfo = null
        that.Data.userbox.info = null
        that.Data.userbox.show = 0
        that.Data.loginbox.username = null
        that.Data.loginbox.password = null
        that.Data.loginbox.show = 1
        that.Data.storage = wx.getStorageInfoSync()
        that.setData()
        break
      case 'location':
        wx.openLocation({
          latitude: 24.808287000,
          longitude: 113.582698000,
          scale: 28,
          name: wx.PW.Name,
          address: '广东省韶关市武江区工业中路23号 汇展华城北塔1518-1520'
        })
        break
      case 'wxlogin':

        break
      case 'login':
        that.Login()
        break
      case 'getusername':
        that.Data.loginbox.username = e.detail.value
        that.setData()
        break
      case 'getpassword':
        that.Data.loginbox.password = e.detail.value
        that.setData()
        break
    }
  },
  Login() {
    var that = this
    wx.ajax.post({
      url: wx.PW.Home + 'index.php?m=member&c=index&a=login',
      data: {
        username: that.Data.loginbox.username,
        password: that.Data.loginbox.password,
        dosubmit: '1'
      }
    }).then(data => {
      if (!data.error) {
        that.GetInfo()
      }else {
        wx.toast(data.msg)
      }
    })
  },
  GetInfo() {
    var that = this
    wx.ajax.get({
      url: wx.PW.Home + 'index.php?m=member&c=index&a=init'
    }).then(data => {
      if (!data.error) {
        wx.setItem(wx.PW.User, data.msg)
        that.UserInfo = data.msg
        that.Data.userbox.info = that.UserInfo
        that.Data.userbox.show = 1
        that.Data.loginbox.username = null
        that.Data.loginbox.password = null
        that.Data.loginbox.show = 0
        that.setData()
      }else {
        wx.toast(data.msg)
      }
    })
  },
  GetData() {
    var that = this
    that.UserInfo = wx.getItem(wx.PW.User)
    that.Data = {
      storage: wx.getStorageInfoSync(),
      userbox: {
        info: that.UserInfo,
        show: !!that.UserInfo
      },
      loginbox: {
        username: null,
        password: null,
        show: !that.UserInfo
      },
      phonebox: {
        phone: null,
        now: 0,
        show: false
      }
    }
    that.setData()
  },
  setData() {
    var that = this
    that.Page.setData(that.Data)
  }
}
