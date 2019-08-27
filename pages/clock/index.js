const clock_col = wx.cloud.database().collection('clock')

Page({
  onLoad() {
    this.lastValueLength = 0
  },

  inputTime(e) {
    let { value, cursor } = e.detail

    if (value.length === cursor && value.length > this.lastValueLength) {
      if (value.length === 2 || value.length === 5) {
        value += ' '

        this.setData({
          value
        })
      }
    }

    this.lastValueLength = value.length
  },

  subscribe(e) {
    wx.requestSubscribeMessage({
      tmplIds: ['TcFC-jbCuxrX-j6UF5GYSRhhNVd68qfslg7zaYubGxo'],
      success: res => {
        if (res['TcFC-jbCuxrX-j6UF5GYSRhhNVd68qfslg7zaYubGxo'] === 'accept') {
          const { title, time, note } = e.detail.value

          try {
            let temp = time.split(' ')
            let timestamp = new Date(`2020/${temp[0]}/${temp[1]} ${temp[2]}:00:00`).getTime()

            if (!timestamp) throw 'date format error'

            console.log({
              title,
              timestamp,
              note
            })

            clock_col.add({
              data: {
                title,
                timestamp,
                note,
                status: 'pending'
              }
            }).then(e => {
              wx.showToast({
                title: '设置提醒成功！',
                icon: 'none'
              })
            })
          } catch (e) {
            wx.showToast({
              title: '请检查输入内容～',
              icon: 'none'
            })
          }
        } else {
          // 用户拒绝订阅
          wx.showToast({
            title: '没有提醒权限',
            icon: 'none'
          })
        }
      }
    })
  }
})