import * as api from '@/api/mymember'
const state = {
  permission: false,
  pdtNum: 0,
  memberInfo: undefined,
  filterData: [],
  filterCache: [],
  historysearch: [],
  direction: 'forward'
}

const mutations = {
  SET_PERMISSION: (state, data) => {
    state.permission = data
  },
  SET_PDTNUM: (state, data) => {
    state.pdtNum = data
  },
  SET_EDITMEMBER: (state, data) => {
    state.memberInfo = data
  },
  SET_FILTER: (state, data) => {
    state.filterData = data
  },
  SET_CACHE: (state, data) => {
    state.filterCache = data
  },
  SET_HISTORY_SEARCH: (state, keywords) => {
    state.historysearch.push(keywords)
  },
  CLEAR_HISTORY_SEARCH: (state) => {
    state.historysearch = []
  },
  CLEAR_EDITMEMBER: (state) => {
    state.memberInfo = undefined
  },
  UPDATE_DIRECTION(state, direction) {
    state.direction = direction
  }
}

const actions = {
  // 获取筛选信息
  GET_FILTER({
    commit
  }) {
    return new Promise((resolve, reject) => {
      api.getFilter().then(response => {
        const {
          data
        } = response
        data.forEach(el => {
          el.selectIndex = 0;
          el.popData.forEach(pl => {
            pl.selectFilterIndex = -1
            if (el.type === 'time') {
              pl.startTime = ""
              pl.endTime = ""
            }
          })
        });
        commit('SET_FILTER', data)
        commit('SET_CACHE', data)
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 修改筛选信息
  EDIT_FILTER({
    commit
  }, {
    data,
    type = ""
  }) {
    if (type === 'cache') {
      commit('SET_CACHE', data)
    } else {
      commit('SET_CACHE', data)
      commit('SET_FILTER', data)
    }
  },
  // 新增搜索历史
  SET_HISTORY_SEARCH({
    commit
  }, keywords) {
    commit('SET_HISTORY_SEARCH', keywords)
  },
  // 清除搜索历史
  CLEAR_HISTORY_SEARCH({
    commit
  }) {
    commit('CLEAR_HISTORY_SEARCH')
  },
  // 头部高度
  SET_PDTNUM({
    commit
  }, pdtNum) {
    commit('SET_PDTNUM', pdtNum)
  },
  // 当前会员信息
  SET_EDITMEMBER({
    commit
  }, data) {
    data.newMemTag = data.memTag !== null && data.memTag !== "" ?
      data.memTag.split(" ") : []
    commit('SET_EDITMEMBER', data)
  },
  // 清除当前会员信息
  CLEAR_EDITMEMBER({
    commit
  }) {
    commit('CLEAR_EDITMEMBER')
  },
  // 设置权限
  SET_PERMISSION({
    commit
  }, permission) {
    commit('SET_PERMISSION', permission)
  }
}

export default {
  state,
  mutations,
  actions
}
