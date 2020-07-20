const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const message_col = db.collection('message')
const _ = db.command

exports.main = async event => {
  const query = db.RegExp({
    regexp: event.content,
    options: 'i',
  })
  const { data } = await message_col.where(_.or([
    { content: query },
    { nickName: query },
    { city: query },
    { time: query }
  ])).get()

  return data
}