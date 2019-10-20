// For Example

const state = {
  searchName: '',
  currentShopInfo: {}
}


const mutations = {
  getSearchDrugName: (state, data) => {
    state.searchName = data
  },
  getCurrentShopInfo: (state, data) => {
    state.currentShopInfo = data
  }
}


export default {
  state,
  mutations
}
