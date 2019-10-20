<template>
  <view-box body-padding-top="40px" class="train-container">
    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}" class="header">
      培训中心
    </x-header>
    <tab custom-bar-width="75px">
      <tab-item selected @on-item-click="toggleTab">新品相关</tab-item>
      <tab-item @on-item-click="toggleTab">导购话术</tab-item>
      <tab-item @on-item-click="toggleTab">企业文化</tab-item>
      <!-- <tab-item @on-item-click="toggleTab">关联用药指导</tab-item> -->
    </tab>
    <div class="list">
      <!-- 新品相关 -->
      <van-cell is-link class="list-item" @click="goRoute(item)" v-for="(item, index) in listData" :key="index">
        <template slot="icon">
          <div class="drug-logo-box">
            <img :src="item.coverImg" class="drug-logo" alt="">
          </div>
        </template>
        <template slot="title">
          <h3 class="title">{{item.title}}</h3>
        </template>
        <template slot="label">
          <p class="date">{{item.gmtCreate}}</p>
        </template>
      </van-cell>
      <!-- 关联用药指导 -->
      <!-- <div class="relation-drug-list" v-show="currentIndex === 3">
        <div class="nav-bar">
          <div :class="`nav-bar-item ${subIndex === 0 ? 'is-active' : ''}`" @click="toggleSubTab(0)">门店关联用药</div>
          <div :class="`nav-bar-item ${subIndex === 1 ? 'is-active' : ''}`" @click="toggleSubTab(1)">主推关联用药</div>
        </div>
        <div 
          :class="`drug-list-item ${index === 0 ? '' : 'mt-10'}`" 
          v-for="(item, index) in 4" 
          :key="'type1' + index" 
          v-show="subIndex === 0">
          <div class="top">
            <span class="text-bold name">糖尿病药-降糖宁胶囊</span>
            <span style="margin: 0 10px;">0.4g * 36粒</span>
            <span class="text-bold">1盒</span>
          </div>
          <div class="bottom">
            <div>
              <div>一次4-6粒，</div>
              <div>一日3次</div>
            </div>
            <div>
              <span class="text-bold">口服</span>
            </div>
            <div>
              <span class="text-bold date">2019-01-01 21:33:20</span>
            </div>
          </div>
        </div>
        <div 
          :class="`drug-list-item ${index === 0 ? '' : 'mt-10'}`" 
          v-for="(item, index) in 3" 
          :key="'type2' + index" 
          v-show="subIndex === 1">
          <div class="top">
            <span class="text-bold name">糖尿病药-降糖宁胶囊</span>
            <span style="margin: 0 10px;">0.4g * 36粒</span>
            <span class="text-bold">1盒</span>
          </div>
          <div class="bottom">
            <div>
              <div>一次4-6粒，</div>
              <div>一日3次</div>
            </div>
            <div>
              <span class="text-bold">口服</span>
            </div>
            <div>
              <span class="text-bold date">2019-01-01 21:33:20</span>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    
    <infinite-loading :identifier="infiniteId"  @infinite="infiniteHandler">
      <span slot="no-results" class="null-data">
        <no-data></no-data>
      </span>
      <load-more slot="no-more" :show-loading="false" tip="没有更多了" background-color="#fbf9fe"></load-more>
    </infinite-loading>
  </view-box>
</template>

<script>
import Vue from 'vue';
import { XHeader, Tab, TabItem, LoadMore } from "vux";
import { Cell, CellGroup } from 'vant';
import ImgDrug from '@/assets/images/console/u6190.jpg';
import NoData from '@/components/common/NoData'
import InfiniteLoading from "vue-infinite-loading";
Vue.use(Cell)
  .use(CellGroup)
import { trainList } from "@/api/home";
export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    LoadMore,
    NoData,
    InfiniteLoading
  },
  data() {
    return {
      ImgDrug,
      currentIndex: 0,
      subIndex: 0,
      listData: [],
      currentPage: 1,
      infiniteId: +new Date()
    }
  },
  methods: {
    infiniteHandler($state) {
      // 通告类型 New product（新品相关）、Shopping guide（导购话术）、Enterprise culture（企业文化）
      let type = ['New product', 'Shopping guide', 'Enterprise culture']
      trainList({ 
        category: type[this.currentIndex],
        contentType: 'train',
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 200) {
					let { list, paginator } = res.data
          this.listData = this.listData.concat(list || [])
          if (this.currentPage <= paginator.totalPages) {
            $state.loaded()
            if (paginator.totalCounts <= 10) {
              $state.complete()
            }
          } else {
            $state.complete();
          }
          this.currentPage++;
				}
      })
    },
    toggleTab(index) {
      this.currentIndex = index
      this.currentPage = 1
      this.infiniteId = +new Date()
      this.listData = []
      // this.getData()
    },
    toggleSubTab(index) {
      this.subIndex = index
    },
    goRoute(item) {
      this.$router.push({ name: 'trainContent', query: { rowNo: item.rowNo } })
    }
  },
  created() {
    // this.getData()
  }
}
</script>

<style lang="less" scoped>
.train-container {
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
        font-weight: 400;
        font-size: 15px;
        color: #1b252e;
      }
      .info {
        margin-top: 10px;
        color: #333;
        font-size: 14px;
      }
      .date {
        font-size: 12px;
        color: #868686;
      }
    }
    .drug-logo-box {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      .drug-logo {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  .relation-drug-list {
    .nav-bar {
      display: flex;
      padding: 10px;
      .nav-bar-item {
        flex: 1;
        color: #333;
        background-color: #fff;
        text-align: center;
        padding: 5px;
        border: 1px solid #dfdfdf;
        &:not(:first-child) {
          border-left: 0;
        }
        &.is-active {
          color: #fff;
          background-color: #0183ff;
        }
      }
    }
    .drug-list-item {
      font-size: 12px;
      padding: 10px;
      background-color: #fff;
      .name {
        font-size: 13px;
      }
      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
    }
  }
}
.mt-10 {
  margin-top: 10px;
}
.text-bold {
  font-weight: bold;
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-bar-inner{
  background:rgba(0,202,172,1)
}
</style>
