const gallery_col = wx.cloud.database().collection('gallery')

function getUUID() {
  let s = []
  let hexDigits = '0123456789abcdef'

  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  return s.join('')
}

Page({

  onLoad() {
    wx.startPullDownRefresh()
  },

  upload() {
    wx.chooseImage({
      success: res => this.uploadFile(res.tempFilePaths)
    })
  },

  async uploadFile(imgList) {
    wx.showLoading({
      title: '上传中...',
      mask: true
    })

    const duration = 1500

    const result = await Promise.all(imgList.map(filePath => {
      return wx.cloud.uploadFile({
        cloudPath: getUUID(),
        filePath
      })
    }))

    await Promise.all(result.map(item => {
      return gallery_col.add({
        data: {
          url: item.fileID
        }
      })
    }))

    wx.showToast({
      title: '上传成功！',
      mask: true,
      duration
    })

    setTimeout(() => wx.startPullDownRefresh(), duration)
  },

  getImgList() {
    gallery_col.get().then(e => {
      this.setData({
        imgList: e.data.map(item => item.url)
      })

      wx.stopPullDownRefresh()
    })
  },

  preview(e) {
    const index = e.currentTarget.dataset.index
    const urls = this.data.imgList
    wx.previewImage({
      urls,
      current: urls[index]
    })
  },

  onPullDownRefresh() {
    this.getImgList()
  }
})