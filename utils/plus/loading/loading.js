module.exports = {
    Page: null,
    Text: "加载中......",
    Status: true,
    init(Page) {
        var that = this;
        that.Page = Page;
        that.setData();
    },
    None() {
        var that = this;
        that.Text = "无更多数据";
        that.Status = false;
        that.setData();
    },
    Ing() {
        var that = this;
        that.Text = "加载中......";
        that.Status = true;
        that.setData();
    },
    Done() {
        var that = this;
        that.Text = "上拉加载更多";
        that.Status = false;
        that.setData();
    },
    setData(params = {}) {
        var that = this;
        that.Page.setData({
            loading: {
                text: !!params.text ? params.text : that.Text,
                status: !!params.status ? params.status : that.Status
            }
        })
    }

}