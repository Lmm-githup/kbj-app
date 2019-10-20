import axios from 'axios';
import router from '@/router';
import {
  getToken,
  removeToken
} from '@/utils/auth';
import {
  ToastPlugin
} from 'vux'
import Vue from 'vue'
import Utils from '@/utils/utils'
const utils = new Utils()
Vue.use(ToastPlugin)

import { Toast } from 'vant';

Vue.use(Toast);

axios.defaults.timeout = 180000;

axios.defaults.baseURL = process.env.baseURL;//npm run dev就调用的是开发环境的地址npm run build就调用的是生产环境的地址
// axios.defaults.transformRequest = [function (data) {
//   //数据序列化
//   return qs.stringify(data);
// }];
axios.interceptors.request.use(
  config => {
    Toast.clear(true);
    // Vue.$vux.loading.show({
    //   text: '加载中...'
    // });
    Toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: '加载中'
    })
    // setTimeout(() => {
    //   Vue.$vux.loading.hide()
    // }, 1000)
    // Do something before request is sent
    // if (store.getters.token) {
    // 让每个请求携带token
    let TOKEN = getToken();
    config.headers['Authorization'] = `DGBAPI ${TOKEN || ''}`;
    config.headers['Content-Type'] = 'application/json'
    // }
    // console.log('congfig', config);
    return config;
  },
  error => {
    // Do something with request error
    console.error(error)
    return Promise.reject(error)
  }
);
axios.interceptors.response.use(response => {
  // Do something with response data
  Toast.clear(true);
  if (+response.data.code === 401) {
    utils.removeLocalData([])
    removeToken()
    router.push({
      name: 'login'
    });
    return response.data
  }
  // add by.xyq Fail state management
  if (+response.data.code !== 200) {
    console.log('fail', response.data);
    let msg = response.data.msg
    if (!response.data.msg) {
      msg = '发生未知错误'
    }
    Vue.$vux.toast.show({
      text: msg,
      time: 3000,
      type: "text",
      width: "12em"
    });
    return response.data;
  }
  return response.data;
}, error => {
  // add by.xyq Error state management
  Toast.clear(true);
  console.error(error.response)
  Vue.$vux.toast.show({
    text: error.response.data.msg,
    time: 2000,
    type: "text"
  });
  return Promise.resolve(error.response);
});


export default function request(method, url, data) {
  method = method.toLocaleLowerCase()
  if (method === 'post') {
    return axios.post(url, data)
  } else if (method === 'get') {
    return axios.get(url, {
      params: data
    })
  }
};
