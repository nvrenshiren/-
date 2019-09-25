import ComBox from '../../plus/combox/combox';
import PubList from '../list/public';
module.exports = {
  Page: null,
  ComBox: ComBox,
  PubList: PubList,
  PageParams: null,
  init(Page) {
    var that = this;
    that.Page = Page;
    that.PageParams = that.Page.Params;
    that.DataUrl = wx.PW.Home + "index.php?m=comment&c=index&a=init&commentid=" + that.PageParams.commentid + "&page=";
    that.PullDown = !!that.Page.options.window.enablePullDownRefresh;
    that.ComBox.init(that.Page);
    that.PubList.init(that.Page);
    that.PubList.Format(wx.PW.Home + "index.php?m=comment&c=index&a=init&commentid=" + that.PageParams.commentid + "&page=", true);
    //其他事件代理
    that.Page['ComEvent'] = (e) => {
      that.On.call(that, e);
    };
  },
  On(e) {
    var that = this;
    var data = e.currentTarget.dataset;
    switch (data.name) {
      case "ding": //顶
        wx.ajax.get({
          url: wx.PW.Home + "index.php?m=comment&c=index&format=json" + "&commentid=" + that.PageParams.commentid + "&a=support&id=" + data.id
        }).then(res => {
          if (res.status > 0) {
            var ListData = wx.pagedata().lists;
            ListData[data.index].support++;
            that.Page.setData({
              lists: ListData
            });
          }
          wx.toast(res.msg);
        });
        break;
      case "recom": //回复
        that.ComBox.Open(that.PageParams.commentid, data.id);
        break;
      case "combox":
        that.ComBox.Open(that.PageParams.commentid, 0);
        break;
    }
  }
}