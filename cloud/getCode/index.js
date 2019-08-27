const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  let data = {}

  if (event.page) data.page = event.page
  if (event.width) data.width = event.width

  data.scene = event.scene ? event.scene : '0'

  try {
    const result = await cloud.openapi.wxacode.getUnlimited(data)
    
    return {
      result,
      event,
      data
    }
  } catch (err) {
    console.log(err)
    return {
      err,
      event,
      data
    }
  }
}