<template>
  <view-box body-padding-top="42px" class="callboard-container">
    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}" class="header">
      活动管理
    </x-header>
    <div class="list">
      <!-- 已提交 -->
      <van-cell is-link class="list-item" @click="goRoute(item)" v-for="(item, index) in list" :key="index">
        <template slot="title">
          <h3 class="title">{{item.dataValue}}</h3>
        </template>
        <template slot="label">
          <p class="date">更新时间: {{item.gmtModified | dateFormat}}</p>
        </template>
      </van-cell>
    </div>
  </view-box>
</template>

<script>
import Vue from 'vue';
import { XHeader } from "vux";
import { Cell, CellGroup } from 'vant';
Vue.use(Cell)
  .use(CellGroup)
import { activityTotal } from '@/api/home';
export default {
  components: {
    XHeader
  },
  data() {
    return {
      list: [],
      paginator: {}
    }
  },
  methods: {
    getData() {
      activityTotal().then(res => {
        if (res.code === 200) {
          this.list = res.data || []
        }
      })
    },  
    goRoute(item) {
      this.$router.push({ name: 'activityDetail', query: { type: item.dataKey,name: item.dataValue } })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.callboard-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
  position: relative;
  .list {
    .list-item {
      margin-top: 10px;
      background-color: #fff;
      align-items: center;
      .title {
        font-weight: 700;
        font-size: 16px;
        color: #1b252e;
      }
      .date {
        font-size: 12px;
        color: #868686;
      }
    }
  }
}
</style>
