const gallery_col = wx.cloud.database().collection('gallery')

async function getImg() {
  const { data } = await gallery_col.get()
  if (data && data.length > 0) return data[data.length - 1].url
}

Page({
  data: {
    imgUrl: ''
  },

  async onLoad() {
    this.ctx = wx.createCameraContext()
    this.setData({
      imgUrl: await getImg()
    })
  },

  takePhotos() {
    this.ctx.takePhoto({
      quality: 'low',
      success: res => {
        const { tempImagePath: imgUrl } = res
        const suffix = imgUrl.split('.')[1]
        this.setData({
          imgUrl
        })
        this.uploadFile(imgUrl, suffix)
      }
    })
  },

  async uploadFile(filePath, suffix) {
    const { fileID } = await wx.cloud.uploadFile({
      cloudPath: getUUID() + '.' + suffix,
      filePath
    })

    gallery_col.add({
      data: {
        url: fileID
      }
    })
  },

  enterGallery() {
    wx.navigateTo({
      url: '/pages/gallery/index'
    })
  }
})

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