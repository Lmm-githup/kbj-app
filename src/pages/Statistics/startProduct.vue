<template>
  <div style="100%;">
    <view-box class="start-index">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">明星产品</x-header>
    <van-search
      placeholder="请输入商品号、商品名称"
      v-model="value"
      show-action
      shape="round"
      @search="onSearch"
    >
      <a style="display:block;" slot="action" @click="onSearch">搜索</a>
    </van-search>
    <div class="container">
      <!-- <div class="title">主推产品</div> -->
      <div class="list">
        <div class="item" v-for="(item,index) in list" :key="index">
          <img :src="item.coverImg" alt>
           <div>商品号 {{item.productCode}}</div>
        <div>{{item.productName}}</div>
        <div>{{item.promotion}}</div>
        <!-- <div>{{item.startDate | dateFormat('YYYY/MM/DD')}} - {{item.endDate | dateFormat('YYYY/MM/DD')}}</div> -->
        <div>{{item.brand}}</div>
        </div>
      </div>  
    </div>
    <div class="container" v-if="list2.length">
      <div class="title">当月最佳</div>
      <div class="list">
        <div class="item" v-for="(item,index) in list2" :key="index">
          <img :src="item.coverImg" alt>
          <div>{{item.productName}}</div>
        </div>
      </div>
    </div>
    <div class="container" v-if="list3.length">
      <div class="title">门店主推</div>
      <div class="list">
        <div class="item" v-for="(item,index) in list3" :key="index">
          <img :src="item.coverImg" alt>
          <div>{{item.productName}}</div>
        </div>
      </div>
    </div>
  </view-box>
  </div>
</template>

<script>
import { XHeader, Group } from "vux";
import { getProList } from "@/api/statistics";
import { Search } from "vant";
import Vue from "vue";
Vue.use(Search);
export default {
  name: "startProduct",
  components: {
    XHeader,
    Group
  },
  data() {
    return {
      list: [],
      list2: [],
      list3: [],
      value: ''
    };
  },
  methods: {
    onSearch() {
      this.init();
    },
    async init() {
      console.log(this.queryType);
      const res = await getProList({
        dataType: "star",
        productName: this.value
      });
      console.log(res);
      if (res.code === 200) {
        // this.list1 = []
        // this.list2 = []
        // this.list3 = []
        this.list = res.data.list;
        // list.forEach(v => {
        //   if (v.productType == "主推产品") {
        //     this.list1.push(v);
        //   } else if (v.productType == "当月最佳") {
        //     this.list2.push(v);
        //   } else if (v.productType == "门店主推") {
        //     this.list3.push(v);
        //   }
        // });
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
  background: #fff;
  /deep/ .van-cell__value--alone {
      display: flex;
      align-items: center;
    }
    /deep/.van-field__body {
      width: 100%;
    }
  .container {
    .title {
      text-align: center;
      color: rgb(29, 69, 155);
      font-size: 15px;
      font-weight: 700;
    }
    .list {
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        flex: 0 0 38%;
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
}
</style>
