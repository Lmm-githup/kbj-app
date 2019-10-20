import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';
// modules
import userModule from '@/store/modules/user';
import myMemberModule from '@/store/modules/mymember';
import homeModule from '@/store/modules/home'
import drugModule from '@/store/modules/drug'

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', //在非生产环境下，使用严格模式
  modules: {
    user: userModule,
    mymember: myMemberModule,
    home: homeModule,
    drug: drugModule
  },
  getters
});
