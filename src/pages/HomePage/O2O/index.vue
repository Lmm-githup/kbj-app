<template>
 <div style="height:100%">
    <view-box body-padding-top="40px" class="container">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}" class="header">
      O2O订单信息
    </x-header>
    <div class="list" v-if="list.length > 0">
      <van-cell is-link class="list-item" @click="goRoute(item)" v-for="(item, index) in list" :key="index">
        <template slot="title">
          <h3 class="title">订单编号：{{item.orderNo}}</h3>
        </template>
        <template slot="label">
          <p class="price">订单金额：{{item.totalAmount || 0}}元</p>
          <p class="date">下单时间：{{item.orderTime | dateFormat}}</p>
        </template>
      </van-cell>
    </div>
    <infinite-loading :identifier="infiniteId"  @infinite="infiniteHandler">
      <span slot="no-results" class="null-data">
        <no-data></no-data>
      </span>
      <load-more slot="no-more" :show-loading="false" tip="没有更多了" background-color="#fbf9fe"></load-more>
    </infinite-loading>
  </view-box>
 </div>
</template>

<script>
import Vue from 'vue';
import { XHeader, LoadMore } from "vux";
import { Cell, CellGroup } from 'vant';
import { getList } from "@/api/order";
import NoData from '@/components/common/NoData'
import InfiniteLoading from "vue-infinite-loading";
Vue.use(Cell)
  .use(CellGroup)
export default {
  components: {
    XHeader,
    NoData,
    InfiniteLoading,
    LoadMore
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      list: [],
      hasMore: true,
      infiniteId: +new Date()
    }
  },
  mounted() {},
  methods: {
    goRoute(item) {
      this.$router.push({ 
        name: 'o2oDetail',
        query:{
          orderNo: item.orderNo
        }
      })
    },
    infiniteHandler($state) {
      getList({
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        orderSrc: 'O2O'
      }).then(res => {
        let { list, paginator } = res.data;
        this.currentPage++;
        this.list.push(...list);
        if (this.currentPage < paginator.totalPages) {
          this.hasMore = true;
          $state.loaded();
        } else {
          this.hasMore = false;
          $state.complete();
        }
        if (this.hasMore) {
            // 初始化 加载组件
            this.infiniteId = +new Date();
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow: auto;
}
.list-item {
  margin-top: 10px;
  align-items: center;
  .title,
  .price {
    font-size: 14px;
    color: #1b252e;
    font-weight: 400;
  }
  .date {
    margin-top: 5px;
  }
}
.nodata {
  font-size: 12px;
  color: #5c5c5c;
  text-align: center;
  margin: 42px;
}
</style>
