const envVersion = wx.getAccountInfoSync().miniProgram.envVersion

wx.$debug = envVersion === 'develop' || envVersion === 'trial'
// wx.$debug = false

wx.$navBarHeight = wx.getSystemInfoSync().statusBarHeight + 44

wx.$dirPath = `${wx.env.USER_DATA_PATH}/tmp/`

wx.$fs = wx.getFileSystemManager()

wx.$delay = duration => new Promise(res => setTimeout(() => res(), duration))

wx.$navigateTo = function ({ url }) {
  const userInfo = wx.getStorageSync('userInfo')

  if (!userInfo) {
    // 用户未同意条款
    this.navigateTo({
      url: '/pages/login/index?url=' + encodeURIComponent(url)
    })
  } else {
    this.navigateTo({ url })
  }
}

wx.$navigateBack = function () {
  if (getCurrentPages().length === 1) {
    this.redirectTo({
      url: '/pages/index/index'
    })
  } else {
    this.navigateBack()
  }
}

wx.$removeTemp = function () {
  const dirPath = this.$dirPath

  this.$fs.rmdir({
    dirPath,
    recursive: true,
    complete: res => {
      console.log(res)

      this.$fs.mkdir({
        dirPath,
        recursive: true,
        complete: console.log
      })
    }
  })
}