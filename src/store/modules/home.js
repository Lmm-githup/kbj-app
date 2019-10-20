// For Example
import * as api from '@/api/home'
import {
  MESSAGE_TOTAL
} from '@/utils/storage'
import Utils from '@/utils/utils'
const utils = new Utils()

const state = {
  messageTotal: 0
}


const mutations = {
  UPDATE_MSG: (state, data) => {
    utils.setLocalData(MESSAGE_TOTAL, data)
  }
}

const actions = {
  QUERY_MSG({
    commit
  }, userNo) { 
    return api.messageTotal({
      userNo
    }).then(res => {
      if (+res.code === 200) {
        commit('UPDATE_MSG', res.data.num)
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
