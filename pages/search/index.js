const message_col = wx.cloud.database().collection('message')

Page({
  onLoad() {
    wx.startPullDownRefresh()
    this.searchText = ''
  },

  handleInput(e) {
    this.searchText = e.detail.value
  },

  async search() {
    wx.showLoading({
      title: '搜索中...',
    })
    const { result: messageList } = await wx.cloud.callFunction({
      name: 'search',
      data: {
        content: this.searchText
      }
    })
    this.setData({
      messageList
    })
    wx.hideLoading()
  },

  getMessageList() {
    message_col.get().then(e => {
      this.setData({
        messageList: e.data
      })

      wx.stopPullDownRefresh()
    })
  },

  onPullDownRefresh() {
    this.getMessageList()
  }
})