// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'normalize.css'
import '@/assets/font-awesome-4.7.0/css/font-awesome.min.css'
import 'amfe-flexible/index.js'
import { NavBar } from 'vant'
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router/index'
import App from './App'
import VueCookie from 'vue-cookie'
import Utils from './utils/utils'
import './filters/index'
import {
  LoadingPlugin,
  ToastPlugin,
  AlertPlugin,
  ConfirmPlugin
} from 'vux'
import './utils/appInterface'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin, {
  position: 'top'
})
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(VueCookie)
Vue.use(NavBar)

import "@/assets/common/default.less";
import "@/assets/font-awesome-4.7.0/less/font-awesome.less";

import store from './store'
import { ViewBox } from 'vux'

Vue.component('view-box', ViewBox)

// copy vux2 source code
const history = window.sessionStorage//history是储存
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)//储存的登陆首页是0

Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "D+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


// 避免请求报错 写个导航守卫
import {
  getToken
} from '@/utils/auth';//获取token
router.beforeEach((to, from, next) => {
  // copy vux2 source code start
  // console.log(to)
  // console.log(from)

  const toIndex = history.getItem(to.path)//1目前在哪‘/homepage’
  const fromIndex = history.getItem(from.path)//0从哪来的‘/’
  // console.log(toIndex)
  // console.log(fromIndex)

  let direction

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      direction = 'forward'
    } else {
      direction = 'reverse'
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    direction = 'forward'
  }
  store.commit('UPDATE_DIRECTION', direction)
  // copy vux2 source code end
  // next()
  const hasToken = getToken();
  if (hasToken) { 
    // 判断 cookie 是否存在 不存在即为未登录
    if (to.path !== '/login') {
      next()
    } else {
      next('/')
    }
  } else {
    if (to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  }
  // next()
})

FastClick.attach(document.body)
const utils = new Utils()
Vue.prototype.$utils = utils
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
