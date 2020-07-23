const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const message_col = db.collection('message')
const _ = db.command

exports.main = async event => {
  const reg = db.RegExp({
    regexp: event.content,
    options: 'i',
  })
  const { data } = await message_col.where(_.or([
    { message: reg },
    { nickName: reg },
    { city: reg },
    { time: reg }
  ])).get()

  return data
}