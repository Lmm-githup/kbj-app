<template>
 <div style="height:100%;">
    <view-box body-padding-top="40px" class="container">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">我的找药</x-header>
    <!-- <van-panel title="标题" desc="描述信息" status="状态"> -->
    <van-panel
      :title="item.productName"
      :status="item.status"
      class="panel"
      v-for="(item, index) in list"
      :key="index"
    >
      <!-- <p class="panel-item">药品名称: {{item.productName | nullset}}</p> -->
      <p class="panel-item">药品规格: {{item.specifications | nullset}}</p>
      <p class="panel-item">生产厂家: {{item.manufEnterprise | nullset}}</p>
      <p class="panel-item">数量: {{item.num | nullset}}</p>
      <p class="panel-item">联系人: {{item.contactName | nullset}}</p>
      <p class="panel-item">手机号: {{item.phone | telFormat}}</p>
      <p class="panel-item">单价: {{item.price | nullset}}</p>
      <p class="panel-item">备注: {{item.comments | nullset}}</p>
      <p class="panel-item">提交时间: {{item.created | dateFormat}}</p>
       <p class="panel-item">反馈有效期: {{item.validDate? item.validDate.substring(0, 10) : ''}}</p>
        <p class="panel-item">预计到货时间: {{item.expectDate? item.expectDate.substring(0, 10) : ''}}</p>
      <div class="drug-img-container">
        <div class="drug-img" v-for="(img, idx) in item.pictureList" :key="idx" v-if="idx < 4">
          <img :src="img">
          <!-- <img src="https://img.yzcdn.cn/vant/cat.jpeg"> -->
        </div>
      </div>
    </van-panel>
    <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler">
      <no-data v-if="!list.length" slot="no-results"></no-data>
      <load-more v-else slot="no-results" :show-loading="false" tip="没有更多了"></load-more>
       <no-data v-if="!list.length" slot="no-more"></no-data>
      <load-more v-else slot="no-more" :show-loading="false" tip="没有更多了"></load-more>
    </infinite-loading>
  </view-box>
 </div>
</template>

<script>
import Vue from "vue";
import { XHeader, LoadMore } from "vux";
import { Panel } from "vant";
import { postFindDrugHistory } from "@/api/drug";

import NoData from "@/components/common/NoData";
import InfiniteLoading from "vue-infinite-loading";

Vue.use(Panel);
// .use(Image)
export default {
  components: {
    XHeader,
    LoadMore,
    InfiniteLoading,
    NoData
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      infiniteId: +new Date()
    };
  },
  methods: {
    infiniteHandler($state) {
      postFindDrugHistory({}).then(res => {
        if (res.code === 200) {
          let { list, paginator } = res.data.data;
          // this.list = list
          console.log(list)
          this.list = this.list.concat(list || []);

          if (this.currentPage <= paginator.totalPages) {
            $state.loaded();
            if (paginator.totalCounts <= 10) {
              $state.complete();
            }
          } else {
            $state.complete();
          }
          this.currentPage++;
        }
      });
    }
  },
  created() {
    // this.getData()
  }
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow: auto;
  .panel {
    margin-top: 10px;
    .van-panel__content {
      padding: 15px;
      .panel-item {
        margin-bottom: 8px;
      }
    }
    .drug-img-container {
      display: flex;
      flex-wrap: wrap;
    }
    .drug-img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      height: 100px;
      padding: 10px;
      box-sizing: border-box;
      position: relative;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
