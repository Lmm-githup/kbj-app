<template>
<div style="height:100%;">
    <view-box  body-padding-top="40px" class="start-index">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">挂金商品</x-header>
    <van-search
      placeholder="请输入商品号、商品名称"
      v-model="value"
      show-action
      shape="round"
      @search="onSearch"
    >
      <a style="display:block" slot="action" @click="onSearch">搜索</a>
    </van-search>
    <div class="container">
      <div class="item" v-for="(item, index) in list" :key="index">
        <img :src="item.coverImg ? item.coverImg : defaultImg" alt>
        <div>商品号 {{item.productCode}}</div>
        <div>{{item.productName}}</div>
        <div>{{item.promotion}}</div>
        <!-- <div>{{item.startDate | dateFormat('YYYY/MM/DD')}} - {{item.endDate | dateFormat('YYYY/MM/DD')}}</div> -->
        <div>{{item.brand}}</div>
      </div>
    </div>
  </view-box>
</div>
</template>

<script>
import { XHeader, Group } from "vux";
import { getProList } from "@/api/statistics";
import { Search } from "vant";
import defaultImg from "@/assets/images/default.png"
import Vue from "vue";
Vue.use(Search);
export default {
  name: "goldProduct",
  components: {
    XHeader,
    Group
  },
  data() {
    return {
      defaultImg,
      list: [],
      value: ""
    };
  },
  methods: {
    onSearch() {
      this.init();
    },
    async init() {
      console.log(this.queryType);
      const res = await getProList({
        dataType: "gold",
        productName: this.value
      });
      console.log(res);
      if (res.code === 200) {
        this.list = res.data.list;
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped lang="less">
.start-index {
  /deep/ .van-cell__value--alone {
      display: flex;
      align-items: center;
    }
    /deep/.van-field__body {
      width: 100%;
    }
  .container {
    background: #fff;
    font-size: 12px;
    display: flex;
    padding: 5px;
    flex-wrap: wrap;
    padding: 10px;
    justify-content: space-between;
    .item {
      background: #fff;
      padding: 10px;
      margin: 5px;
      flex: 0 0 40%;
      border: 1px solid #f1f1f1;
      padding: 5px;
      margin: 5px;
      border-radius: 5px;
      font-size: 12px;
      text-align: center;
      > img {
        width: 100%;
      }
    }
  }
}
</style>
