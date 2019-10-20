// For Example
import * as api from '@/api/user'
import {
  setToken,
  removeToken,
  getToken
} from '@/utils/auth'
import {
  USER_INFO
} from '@/utils/storage'
import Utils from '@/utils/utils'
const utils = new Utils()

const state = {
  addOrg: {
    orgNoName: '',
    orgNo: ''
  },
  addPosition: {
    positionName: '',
    rowNo: ''
  },
  staffFrom: {},
  positionFrom: {},
  orgFrom: {},
  userInfo: {}
}


const mutations = {
  ADD_ORG: (state, data) => {
    state.addOrg = data
  },
  ADD_POSITION: (state, data) => {
    state.addPosition = data
  },
  SAVE_STAFF_FROM: (state, data) => {
    state.staffFrom = data
  },
  SAVE_POSITION_FROM: (state, data) => {
    state.positionFrom = data
  },
  SAVE_ORG_FROM: (state, data) => {
    state.orgFrom = data
  },
  SAVE_USER_INFO: (state, data) => {
    state.userInfo = data
  }
}

const actions = {
  // 登录
  LOGIN({
    commit
  }, userInfo) {
  	// console.log(userInfo);
    const {
      loginName,
      loginPwd,
      udId,
      mobileType
    } = userInfo  
    // console.log(loginName)
    return api.login({
      loginName,
      loginPwd,
      udId,
      mobileType
    }).then(res => {
      if (+res.code == 200) {
      	// console.log(res)
//    	alert("我是vuex里登录成功要储存token")
        utils.setLocalData(USER_INFO, res.data)
        setToken(res.data.token)
        const hasToken = getToken();
//      alert("我是vuex里面获取的token"+hasToken)
      }
      return res
    })
  },
  // 登出
  LOGOUT({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      api.logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  USER_INFO({
    commit
  }) { 
    return api.getUserInfo().then(res => {
      if (+res.data.code == 200) {
        commit('SET_USER_INFO', res.data.data)
      }
      console.log(res)
      return res.data
    })
  },
}
export default {
  state,
  mutations,
  actions
}
