const fs = wx.getFileSystemManager()

Page({
  getCode (e) {
    wx.showLoading({
      title: '生成中...',
      mask: true
    })

    console.log(e.detail.value)
    let data = e.detail.value

    if (data.width) {
      if (parseInt(data.width) > 1280 || parseInt(data.width) < 280) {
        wx.showToast({
          title: '宽度不在范围内',
          icon: 'none'
        })
        return
      }
    }

    wx.cloud.callFunction({
      name: 'getCode',
      data
    }).then(res => {
      this.buffer2Src(res.result.result.buffer).then(src => {
        this.setData({
          codeUrl: src
        })

        wx.hideLoading()
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '云函数调用错误',
        icon: 'none'
      })
    })
  },

  buffer2Src (buffer) {
    let rd_string = Math.random().toString(36).substr(2)
    let filePath = `${wx.env.USER_DATA_PATH}/${rd_string}.jpg`

    return new Promise((resolve, reject) => {
      fs.writeFile({
        data: buffer,
        filePath,
        encoding: 'binary',
        success: res => {
          resolve(filePath)
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            title: 'buffer转src出错',
            icon: 'none'
          })
        }
      })
    })
  },

  save () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.codeUrl,
      success: () => wx.showToast({
        title: '保存成功'
      }),
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '没有权限保存',
          icon: 'none'
        })
      }
    })
  }
})