<template>
  <div style="height:100%;">
    <view-box>
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">
      <template v-if="dataType == 1">门店排名</template>
      <template v-if="dataType == 2">片区合计排名</template>
      <template v-if="dataType == 3">大区合计排名</template>
    </x-header>
    <!-- <group > -->
    <div class="box">
      <div class="title">
        <div class="rank-title w-15" >排名</div>
        <div class="rank-title" v-if="dataType == 1">门店名</div>
        <div class="rank-title" v-if="dataType == 2">片区名</div>
        <div class="rank-title" v-if="dataType == 3">大区/片区名</div>
        <div class="rank-title">总会员数</div>
        
        <div class="rank-title" v-if="dataType == 3 || dataType == 2">门店数</div>
        <div class="rank-title">归属总人数</div>
        <div class="rank-title">拉新总人数</div>
        <div class="rank-title">归属到店人数</div>
        <div class="rank-title">归属总销售额</div>
        <div class="rank-title">归属总毛利额</div>
      </div>
      <a class="content" v-for="(item, index) in rankList" :key="index" >
        <div class="rank-item w-15">
          <img class="iconfont-img" v-if="index === 0" :src="FirstImg" alt="">
          <img class="iconfont-img" v-if="index === 1" :src="SecondImg" alt="">
          <img class="iconfont-img" v-if="index === 2" :src="ThreeImg" alt="">
          <span v-if="index !== 0 && index !== 1 && index !== 2">{{item.rank}}</span>
        </div>
        <div :class="item.drillDown == 'Y'? 'isY': ''" class="rank-item" v-if="dataType == 1">{{item.orgName || ''}}</div>
        <div :class="item.drillDown == 'Y'? 'isY': ''" class="rank-item" v-if="dataType == 2">{{item.orgName || ''}}</div>
        <div :class="item.drillDown == 'Y'? 'isY': ''" class="rank-item" v-if="dataType == 3">{{item.orgName || ''}}</div>
        <div class="rank-item">{{item.sumNum || 0}}</div>
        
        <div class="rank-item" v-if="dataType == 3 || dataType == 2">{{item.storeNum || 0}}</div>
        <div class="rank-item">{{item.memNum || 0}}</div>
        <div class="rank-item">{{item.newNum || 0}}</div>
        <div class="rank-item">{{item.conMemNum || 0}}</div>
        <div class="rank-item">{{item.salesVal || 0}}</div>
        <div class="rank-item">{{item.salesProfit || 0}}</div>
      </a>
    </div>
    <!-- </group> -->
  </view-box>
  </div>
</template>

<script>
import { XHeader, Group } from "vux";
import { getMemberRankDetail } from "@/api/statistics";
import FirstImg from '@/assets/images/first.png';
import SecondImg from '@/assets/images/second.png';
import ThreeImg from '@/assets/images/three.png';
export default {
  name: "editPassword",
  components: {
    XHeader,
    Group
  },
  data() {
    return {
      FirstImg,
      SecondImg,
      ThreeImg,
      dataType: "",
      queryDataType: "",
      orgCrmId: "",
      rankList: []
    };
  },
  methods: {
    async init() {
      const res = await getMemberRankDetail({
        dataType: this.queryDataType + "",
        orgCrmId: this.orgCrmId
      });
      if (res.code === 200 && res.data.list.length) {
        this.dataType = res.data.list[0].dataType
        this.rankList = res.data.list;
      }
    }
  },
  mounted() {
    this.orgCrmId = this.$route.query.orgCrmId;
    this.queryDataType = this.$route.query.dataType;
    this.init();
  }
};
</script>

<style scoped lang="less">
  .box {
    margin-top: 15px;
    //padding: 10px 0;
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    background: #fff;
    .title,
    .content {
      width: 100%;
      display: flex;
    }
    .rank-title,
    .rank-item {
      border-bottom: 1px solid #dfdfdf;
      width: 30%;
      white-space: normal;
      flex-shrink: 0;
      text-align: center;
      margin: 0 auto;
      .iconfont-img {
        width: 16px;
        height: 16px;
        vertical-align: middle;
      }
    }
    .rank-title {
      padding: 15px 5px;
      font-size: 12px;
      font-weight: 700;
      color: #000;
    }
    .rank-item {
      color: #333;
      padding: 10px 5px;
      font-size: 12px;
    }
    .w-15 {
      width: 15% !important;
    }
    .isY{
      color:#19a3fa;
    }
  }
  /*隐藏滚动条*/
  ::-webkit-scrollbar {
     width: 0 !important;
     height:0;
   }

</style>
