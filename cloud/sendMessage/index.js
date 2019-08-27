Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
  return fmt
}

const cloud = require('wx-server-sdk')
cloud.init()

const clock_col = cloud.database().collection('clock')
const _ = cloud.database().command

async function sendMessage(item) {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: item._openid,
      templateId: 'TcFC-jbCuxrX-j6UF5GYSRhhNVd68qfslg7zaYubGxo',
      data: {
        thing1: {
          value: item.title
        },
        time2: {
          // 转换为东八区时区
          value: new Date(item.timestamp + 8 * 3600000).format('MM月dd日 hh:00')
        },
        thing6: {
          value: item.note
        }
      }
    })

    if (result.errCode === 0) {
      clock_col.doc(item._id).update({
        data: {
          status: 'done'
        }
      })
    }

    return result
  } catch (err) {
    clock_col.doc(item._id).update({
      data: {
        status: 'fail'
      }
    })

    return err
  }
}

exports.main = async (event, context) => {
  const { data } = await clock_col.where({
    status: 'pending',
    // 加多1分钟防止误差
    timestamp: _.lte(Date.now() + 6 * 60 * 1000)
  }).get()

  let result = []

  for (let i = 0; i < data.length; i++) {
    result.push(await sendMessage(data[i]))
  }

  return result
}