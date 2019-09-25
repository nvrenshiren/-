import imgLoader from '../../plus/imgloader/imgloader';
import NavBar from '../../plus/navbar/navbar';
import PubList from '../list/public';
module.exports = {
  Page: null,
  Data: {},
  Params: null,
  imgLoader: imgLoader,
  NavBar: NavBar,
  PubList: PubList,
  Video: null,
  init(Page) {
    var that = this;
    that.Page = Page;
    that.Params = that.Page.Params;
    that.imgLoader.init(that.Page);
    that.NavBar.init(that.Page);
    that.video = wx.createVideoContext("livevideo");
    //直播事件
    that.Page['LiveEvent'] = (e) => {
      that.On.call(that, e);
    };
  },
  On(e) {
    var that = this;
    var data = e.currentTarget.dataset;
    switch (data.name) {
      case "downimg":
        var pics = [];
        for (var item in that.imgLoader.Data) {
          pics.push(that.imgLoader.Data[item]);
        }
        pics = pics.map(item => {
          return item.src.split("?")[0];
        });
        wx.previewImage({
          current: data.src,
          urls: pics
        })
        break;
      case "play":
        //获取直播弹幕
        if (!that.HasTm) {//不重复执行
          that.GetTm();
          that.HasTm = true;
        }
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
      that.setData();
      //初始化NavBar
      that.NavBar.Format(that.Data);
      //添加进本地记录
      wx.toview(that.Params);
      //获取直播内容列表
      that.GetCon();
      //获取真实播放地址
      that.GetPath(that.Data.video).then(path => {
        that.Data.video = path;
        that.setData();
      });
    });
  },
  GetCon() {
    var that = this;
    that.PubList.init(that.Page);
    that.PubList.Format(wx.PW.Home + "index.php?m=live&c=index&a=content&liveid=" + that.Data.id + "&page=", false);
  },
  CheckType(path) { //检查路径类型,支持乐视,斗鱼,熊猫,火猫
    return !(path.indexOf("leshi") < 0) ? "LETV" : !(path.indexOf("lslv") < 0) ? "LELV" : !(path.indexOf("dytv") < 0) ? "DYDB" : !(path.indexOf("xmtv") < 0) ? "XMDB" : !(path.indexOf("hmtv") < 0) ? "HMDB" : !(path.indexOf("xiongmao") < 0) ? "XMTV" : !(path.indexOf("douyu") < 0) ? "DYTV" : !(path.indexOf("huomao") < 0) ? "HMTV" : !(path.indexOf("xhtv") < 0) ? "XHTV" : !(path.indexOf("xhlv") < 0) ? "XHLV" : "HTTP";
  },
  GetPath(path) {
    var Defer;
    var type = this.CheckType(path);
    switch (type) {
      case "HTTP":
        return new Promise((resolve, reject) => {
          resolve(path);
        });
        break;
      default:
        Defer = this.PHPAPI(path);
        break;
    }
    return Defer;
  },
  PHPAPI(path) {
    return new Promise((resolve, reject) => {
      wx.ajax.get({
        url: wx.PW.Home + "api.php?op=liveapi&video=" + path
      }).then(res => {
        resolve(res.src);
      });
    });
  },
  GetTm(lastid = 0) {
    var that = this;
    var endid = lastid;
    var getdata = (lastid) => {
      wx.ajax.get({
        url: wx.PW.Home + "index.php?m=live&c=index&a=tanmu&liveid=" + that.Data.id + "&lastid=" + lastid
      }).then(res => {
        var length = res.msg.length;
        if (length > 0) {
          res.msg.forEach((ele, index) => {
            endid = ele.id;
            setTimeout(() => {
              that.sendDanmu(ele.content);
            }, index * 2000);
          });
        }
      })
    }
    getdata(endid);
    setInterval(() => {
      getdata(endid);
    }, 20000);
  },
  sendDanmu(content) {
    var that = this;
    var getRandomColor = () => {
      let rgb = []
      for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length == 1 ? '0' + color : color
        rgb.push(color)
      }
      return '#' + rgb.join('')
    }
    that.video.sendDanmu({
      text: content,
      color: getRandomColor()
    });
  }

}