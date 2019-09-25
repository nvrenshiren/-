module.exports = {
    Page: null,
    Subshow: false,
    Index: 0,
    init(Page) {
        var that = this;
        that.Page = Page;
        that.Page['SubnavEvent'] = (e) => {
            that.On.call(that, e);
        };
        that.setData({
            subshow: that.Subshow,
            index: that.Index
        });
    },
    On(e) {
        var that = this;
        var data = e.currentTarget.dataset;
        switch (data.name) {
            case "shownav":
                that.Subshow = true;
                break;
            case "changeList":
                wx.pageScrollTo({
                    scrollTop: 0
                })
                that.Subshow = false;
                that.Index = data.index;
                that.Page.Plus.List.Format(that.Index);
                break;
        }
        that.setData()
    },
    setData(params = {}) {
        var that = this;
        that.Page.setData({
            subnav: {
                subshow: !!params.subshow ? params.subshow : that.Subshow,
                index: !!params.index ? params.index : that.Index
            }
        });
    }

}