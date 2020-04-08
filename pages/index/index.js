const setting = wx.cloud.database().collection('setting').doc('dc65fe3e5e8e9b6c0054296d01cdcabf')

Page({
  onLoad() {
    this.getMenu()
  },

  getMenu() {
    setting.get().then(res => {
      this.setData({
        menu: res.data.menu
      })
    })
  }
})