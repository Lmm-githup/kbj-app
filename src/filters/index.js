import Vue from 'vue'
import { datefmt } from '@/utils/common'
// 过滤器
// 判空 过滤器
Vue.filter('nullset', function (value) {
  if (value === '' || value == null || value === 'null') {
    return '-'
  } else {
    return value
  }
})

// 手机号隐藏中间四位
Vue.filter('telFormat', function (tel) {
  if (!tel) return ''
  let reg = /^(\d{3})\d*(\d{4})$/
  return tel.replace(reg,'$1****$2')
})

// 身份证号只显示后六位
Vue.filter('idCardFormat', function (card) {
  if (!card) return ''
  let value
  console.log(card.length)
  if (card.length === 18) {
    value = '************' + card.substring(card.length - 6,card.length)
  } else if (card.length === 15) {
    value = '*********' + card.substring(card.length - 6,card.length)
  }
  return value
})

// 时间格式化 过滤器
Vue.filter('dateFormat', datefmt)
  // if (date == '' || date == null || date == 'null') {
  //   return ''
  // } else {
  //   let getDate = new Date(date);
  //   let o = {
  //     'M+': getDate.getMonth() + 1,
  //     'D+': getDate.getDate(),
  //     'H+': getDate.getHours(),
  //     'm+': getDate.getMinutes(),
  //     's+': getDate.getSeconds(),
  //     'q+': Math.floor((getDate.getMonth() + 3) / 3),
  //     'S': getDate.getMilliseconds()
  //   };
  //   if (/(Y+)/.test(fmt)) {
  //     fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  //   }
  //   for (let k in o) {
  //     if (new RegExp('(' + k + ')').test(fmt)) {
  //       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  //     }
  //   }
  //   return fmt;
  // }
