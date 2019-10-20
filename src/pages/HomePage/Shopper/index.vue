<template>
  <div style="height:100%">
    <view-box body-padding-top="40px" class="shopper-container">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}" class="header">
      导购意见箱
    </x-header>
    <tab custom-bar-width="75px">
      <tab-item selected @on-item-click="toggleTab">已提交</tab-item>
      <tab-item @on-item-click="toggleTab">已反馈</tab-item>
      <tab-item @on-item-click="toggleTab">草稿箱</tab-item>
    </tab>
    <div class="list">
      <!-- 已提交 -->
      <van-cell 
        is-link
        :to="{ name: 'contentOpinion', query: { opinionId: item.opinionId, guideId: item.guideId } }"
        class="list-item" v-for="(item, index) in optionSubmit" :key="index" v-show="currentIndex === 0">
        <template slot="title">
          <h3 class="title">{{item.type}}-{{item.subType}}</h3>
        </template>
        <template slot="label">
          <p class="info">{{item.titleName}}</p>
          <p class="date">{{item.startTime | dateFormat}}</p>
        </template>
      </van-cell>
      <no-data v-if="!optionSubmit.length && currentIndex === 0"></no-data>
      <!-- 已反馈 -->
      <van-cell
        is-link
        :to="{ name: 'contentOpinion', query: { opinionId: item.opinionId, guideId: item.guideId } }"
        class="list-item" v-for="(item, index) in optionFeedback" :key="index" v-show="currentIndex === 1">
        <template slot="title">
          <h3 class="title">{{item.type}}-{{item.subType}}</h3>
        </template>
        <template slot="label">
          <p class="info">{{item.titleName}}</p>
          <p class="date">{{item.startTime | dateFormat}}</p>
        </template>
      </van-cell>
      <no-data v-if="!optionFeedback.length && currentIndex ===1"></no-data>
      <!-- 草稿箱 -->
      <van-cell is-link class="list-item" @click="goRoute(item.rowNo)" v-for="(item, index) in optionDraft" :key="index" v-show="currentIndex === 2">
        <template slot="title">
          <h3 class="title">{{item.category}}-{{item.subCategory}}</h3>
        </template>
        <template slot="label">
          <p class="info">{{item.title}}</p>
          <p class="date">{{item.gmtCreate | dateFormat}}</p>
        </template>
      </van-cell>
      <no-data v-if="!optionDraft.length && currentIndex ===2"></no-data>
    </div>
    <!-- 写意见 -->
    <div class="bottom-button" v-show="currentIndex !== 2" >
      <a class="button" @click="goRoute1">写意见</a>
    </div>
  </view-box>
  </div>
</template>

<script>
import Vue from 'vue';
import { XHeader, Tab, TabItem } from "vux";
import { Cell, CellGroup } from 'vant';
import { getDraftList,getOptionList } from '@/api/shopper';
import rigthArrow from '@/assets/images/console/u487.png';
import NoData from '@/components/common/NoData'
Vue.use(Cell)
  .use(CellGroup)
export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    NoData
  },
  data() {
    return {
      rigthArrow,
      currentIndex: 0,
      optionDraft: [],
      optionSubmit: [],
      optionFeedback: [],
      currentPage: 1,
      pageSize: 1000
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.toggleTab(0);
  },
  methods: {
    async getDraftList() {
      let { code, data } = await getDraftList({currentPage: this.currentPage, pageSize: this.pageSize});
      code === 200 ? (this.optionDraft = data.list) : "";
    },
    async getOptionList(subType) {
      let { code, data } = await getOptionList({ subType: subType});
      if(code === 200 ){
        (subType == '待反馈' ? this.optionSubmit = data : this.optionFeedback = data);
      }
    },
    toggleTab(index) {
      this.currentIndex = index;
      if(index == 0){
        this.getOptionList('待反馈');
      }else if(index == 1){
        this.getOptionList('已反馈');
      }else if(index == 2){
        this.getDraftList();
      }
    },
    goRoute(rowNo) {
      this.$router.push({ name: 'writeOpinion',query: {rowNo: rowNo}})
    },
    goRoute1 () {
      this.$router.push({ name: 'writeOpinion'})
    }
  }
}
</script>

<style lang="less" scoped>
.shopper-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
  position: relative;
  .list {
    // flex: 1;
    // height: 500px;
    overflow: auto;
    // padding-bottom: 70px;
    .list-item {
      margin-top: 10px;
      background-color: #fff;
      align-items: center;
      .title {
        font-size: 15px;
        color: rgba(0,202,172,1);
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
  }
  .bottom-button {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 20px;
    background-color: #fff;
    .button {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      background-color: rgba(0,202,172,1);
      border-radius: 4px;
      display: block;
    }
  }
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-bar-inner{
  background:rgba(0,202,172,1)
}
</style>
