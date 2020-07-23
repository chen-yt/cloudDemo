const chat_col = wx.cloud.database().collection('chat')

Page({
  onLoad() {
    chat_col.watch({
      onChange: res => {
        this.setData({
          chatList: res.docs
        })
      },
      onError() { }
    })
  },

  inputText(e) {
    this.text = e.detail.value
  },

  send(e) {
    if (!this.text) {
      wx.showToast({
        title: '请输入您想说的话哦～',
        icon: 'none'
      })
      return
    }
    const { userInfo } = e.detail
    if (userInfo) {
      chat_col.add({
        data: {
          ...userInfo,
          chat: this.text,
          time: new Date().format('yyyy-MM-dd hh:mm:ss')
        }
      })
      this.setData({
        value: ''
      })
    } else {
      wx.showToast({
        title: '拒绝授权无法聊天哦～',
        icon: 'none'
      })
    }
  }
})