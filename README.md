---

marp: true
theme: gaia

---

# 微信小程序云开发Demo

Repository: https://github.com/chen-yt/cloudDemo

![w:300px](screenshots/code.jpg)

---

### 什么是云开发

[小程序云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

> 云开发为开发者提供完整的原生云端支持和微信服务支持，弱化后端和运维概念，无需搭建服务器，使用平台提供的 API 进行核心业务开发，即可实现快速上线和迭代，同时这一能力，同开发者已经使用的云服务相互兼容，并不互斥。

---

### 什么是云开发

简单来说，云开发提供一种 Serverless 服务，可以实现后端功能，类似的产品有 「Google App Engine」、「Bmob」 等，云开发有三大能力：「云存储」、「云数据库」、「云函数」。

学会云开发，你也可以是「全栈开发工程师」。

---

### 使用场景

#### 场景一

产品说要收集一下用户数据，于是我找后端要一个存图片的对象存储。

后端：没有！快滚！对象存储不用钱啊？

嗯，「云存储」真香，免费还方便。

---

### 使用场景

#### 场景二

在开发微信小程序时，经常会遇到使用微信开放能力的需求，例如：获得用户唯一标识、获取小程序码、推送服务通知消息等。这些接口通常需要通过 POST 微信HTTPS接口来实现。

BUT！！！

后端说：平安云服务器不能访问外网，需要开墙，开墙就要走架构变更通道。

Then，一个星期过去了，产品说，前端未按时交付。

走尼美的架构变更，我自己写个「云函数」它不香吗。

---

### 使用场景

#### 场景三

某次熬夜发版完成后，第二天，产品经理气急败坏，说首页引导图有一个错别字。

改个字还不简单，就是小程序发版又要走一遍该死的微信审核流程。

解决方案：文案较多的地方尽量记录在「云数据库」中，可实现动态修改。

---

### 使用场景

#### 使用云开发的小程序项目
- 神笔小安：图片静态资源、获取openid、动态生成小程序码、收集用户数据；
- 平荷正念：图片静态资源、获取openid；
- 平安AI音乐：动态生成小程序码；
- 平安AI创作：图片静态资源，动态文案；
- ...

---

### 云存储

类似对象存储，自带「CDN」，云存储包含以下功能：

- 存储管理：支持文件的上传、删除、移动、下载、搜索等，并可以查看文件的详情信息；
- 权限设置：可以灵活设置哪些用户是否可以读写该文件夹中的文件，以保证业务的数据安全；
- 上传管理：在这里可以查看文件上传历史、进度及状态；
- 文件搜索：支持文件前缀名称及子目录文件的搜索。

---

### 云存储API

```javascript
// 上传文件
wx.cloud.uploadFile({
  cloudPath,
  filePath
}).then(res => console.log(res.fileID))

// 下载文件
wx.cloud.downloadFile({
  fileID
})

// 删除文件
wx.cloud.deleteFile({
  fileList: [fileID, ...]
})
```

---

### 云数据库

类似MongoDB，非关系型数据库，可增删改查、权限控制、索引管理等。

#### 云存储Demo —— 留言板

```javascript
const message_col = wx.cloud.database().collection('message')

message_col.add({
  data: {
    ...userInfo,
    message,
    time: new Date().format('yyyy-MM-dd hh:mm:ss')
  }
})
```

---

### 云数据库API

```javascript
// 查询指令
db.where({
  done: true
})

// 删除指令
db.where({
  done: true
}).remove()

// 更新指令
db.where({
  done: true
}).update({
  done: false
})
```

---

### 云函数

云函数即在云端（服务器端）运行的函数，代码运行在云端 Node.js 中。

调用云函数类似于请求「express」接口，优势是云函数具有微信登录鉴权机制，当云函数被小程序端调用时，云函数的入参会被注入用户的「openid」。