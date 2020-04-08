const message_col = wx.cloud.database().collection('message')

Page({

  onLoad() {
    wx.startPullDownRefresh()
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
      console.log(userInfo)

      message_col.add({
        data: {
          ...userInfo,
          message: this.text,
          time: new Date().format('yyyy-MM-dd hh:mm:ss')
        }
      }).then(() => {
        const duration = 1500

        wx.showToast({
          title: '留言成功！',
          mask: true,
          duration
        })

        this.setData({
          value: ''
        })

        setTimeout(() => wx.startPullDownRefresh(), duration)
      })

    } else {
      // 用户拒绝授权
      wx.showToast({
        title: '拒绝授权无法留言哦～',
        icon: 'none'
      })
    }
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