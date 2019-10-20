import Vue from 'vue'

import Utils from './utils'

import { Toast } from 'vant'

Vue.use(Toast)

const utils = new Utils()

const INTERFACE_LIST = {

  shareLetapp(options) {
    APP_INTERFACE.shareLetapp(options)
  },
  getUdid() {
    APP_INTERFACE.getUdid(options)
  }
}

// androidInvoker iosInvoker
let APP_INTERFACE = null

window.APP_COMMON_ENTRY = (methodName, params) => {
  let deviceType = utils.deviceType()
  alert('系统:', deviceType)
  let wid = []
  for (let k in window) {
    wid.push(k)
  }
  console.log(JSON.stringify(params))
  alert(JSON.stringify(wid))
  if (deviceType === 'android') {
    if (!('androidShare' in window)) {
      // return
    }
    alert('出现安卓系统！')
    alert(JSON.stringify(androidShare))
    APP_INTERFACE = androidShare
  } else if (deviceType === 'ios') {
    if (!('iosShare' in window)) {
      // return
    }
    alert('出现IOS系统！')
    alert(JSON.stringify(iosShare))
    APP_INTERFACE = iosShare
  } else {
    alert('出现非安卓和IOS系统！')
    // return
  }

  if (!methodName) {
    // 用来外部检测方法是否存在
    return APP_INTERFACE
  }
  console.log(APP_INTERFACE[methodName])
  if (!APP_INTERFACE[methodName]) {
    alert('APP_INTERFACE未定义方法名 ' + methodName)
    return
  }

  if (!INTERFACE_LIST[methodName]) {
    alert('INTERFACE_LIST未定义方法名 ' + methodName)
    return
  }
  alert('有方法', INTERFACE_LIST[methodName](JSON.stringify(params)))
  try {
    if (typeof params !== 'object') {
      return INTERFACE_LIST[methodName](params)
    } else {
      return INTERFACE_LIST[methodName](JSON.stringify(params))
    }
  } catch (e) {
    return ''
  }
}
