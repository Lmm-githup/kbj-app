<template>
  <div class="drug-container">
   <view-box>
      <!-- 导航栏 -->
		<x-header slot="header" :left-options="{showBack: true,backText: ''}">
      商品详情
    </x-header>
    <van-swipe :autoplay="3000" class="swipe-banner">
      <!-- <van-swipe-item v-for="(image, index) in productImages" :key="index"> -->
      <van-swipe-item v-for="(image, index) in baseInfo.carouselImg" :key="index">
        <img v-lazy="image" :src="image" class="img"/>
      </van-swipe-item>
    </van-swipe>
    <h3 class="drug-title">{{baseInfo.productName | nullset}}</h3>
    <!-- tab 栏 -->
    <tab custom-bar-width="75px">
      <tab-item selected @on-item-click="toggleTab">商品信息</tab-item>
      <tab-item @on-item-click="toggleTab">关联用药信息</tab-item>
    </tab>
    <div v-show="currentIndex === 0" class="panel">
      <div class="items">
        <h5 class="name">功能主治</h5>
        <div class="intro">{{baseInfo.fucntions | nullset}}</div>
      </div>
      <div class="items">
        <h5 class="name">规格</h5>
        <div class="intro">{{baseInfo.standard | nullset}}</div>
      </div>
      <div class="items">
        <h5 class="name">使用说明</h5>
        <div class="intro">{{baseInfo.productUsage | nullset}}</div>
      </div>
      <div class="items">
        <h5 class="name">不良反应</h5>
        <div class="intro">{{baseInfo.reaction | nullset}}</div>
      </div>
      <div class="items">
        <h5 class="name">禁忌</h5>
        <div class="intro">{{baseInfo.avoid | nullset}}</div>
      </div>
      <div class="items">
        <h5 class="name">注意事项</h5>
        <div class="intro">{{baseInfo.attention | nullset}}</div>
      </div>
      <div class="items">
        <h5 class="name">生产厂家</h5>
        <div class="intro">{{baseInfo.manufacturer | nullset}}</div>
      </div>
    </div>
    <div v-show="currentIndex === 1" class="panel">
      <div v-if="relaInfo.length !== 0">
        <div class="items" v-for="(item, index) in relaInfo" :key="index">
          <h5 class="name">关联推荐</h5>
          <div class="intro p-null mt-15">
            <span class="primary">{{item.productName}}:</span>
            <span>{{item.relationTalking | nullset}}</span>
          </div>
        </div>
      </div>
      <no-data v-else></no-data>
    </div>
    <infinite-loading :identifier="infiniteId"  @infinite="infiniteHandler">
      <span slot="no-results" class="null-data">
        <!-- <no-data></no-data> -->
      </span>
      <span slot="no-more" class="null-data"></span>
      <!-- <span slot="no-more" class="null-data">没有更多数据了o(╥﹏╥)o</span> -->
    </infinite-loading>
   </view-box>
  </div>
</template>

<script>
import Vue from 'vue';
import { XHeader, Group, XInput, Tab, TabItem } from "vux";
import { Swipe, SwipeItem, Lazyload } from 'vant';
import Img1 from '@/assets/images/drug/u2542.png';
import Img2 from '@/assets/images/drug/u2546.png';
import NoData from '@/components/common/NoData'
import InfiniteLoading from "vue-infinite-loading";
Vue.use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
import { 
  postDrugDetail, 
  postDrugRelation
} from '@/api/drug'
export default {
  components: {
    XHeader,
    Group,
    XInput,
    Tab,
    TabItem,
    NoData,
    InfiniteLoading
  },
  data() {
    return {
      Img1,
      Img2,
      baseInfo: {
        productName: '',
        carouselImg: [],
        // productImages: [
        //   'https://img.yzcdn.cn/public_files/2017/09/05/c0dab461920687911536621b345a0bc9.jpg',
        //   'https://img.yzcdn.cn/2.jpg'
        // ]
      },
      productImages: [
        'https://img.yzcdn.cn/public_files/2017/09/05/c0dab461920687911536621b345a0bc9.jpg',
        'https://img.yzcdn.cn/2.jpg'
      ],
      relaInfo: [],
      productCode: '',
      currentIndex: 0,
      infiniteId: +new Date(),
      currentPage: 1
    }
  },
  methods: {
    getData() {
      postDrugDetail({
        productCode: this.productCode
      }).then(res => {
        if (res.code === 200) {
          this.baseInfo = Object.assign(this.baseInfo, res.data)
        } else {
            this.$vux.toast.show({
              text: res.msg,
              time: 2000,
              type: "text"
            });
          }
      }) 
    },
    infiniteHandler($state) {
      postDrugRelation({
        productId: this.productId,
        currentPage: this.currentPage,
        pageSize: 10000
      }).then(res => {
        if (res.code === 200) {
          // this.relaInfo = Object.assign(this.relaInfo, res.data)
          let { list, paginator } = res.data.data
          this.relaInfo = this.relaInfo.concat(list || [])
          if (this.currentPage <= paginator.totalPages) {
            $state.loaded()
          } else {
            $state.complete();
          }
          this.currentPage++;
        } else {
            this.$vux.toast.show({
              text: res.msg,
              time: 2000,
              type: "text"
            });
          }
      }) 
    },
    toggleTab (index) {
      this.currentIndex = index
      if (index === 1 && Object.keys(this.relaInfo).length === 0) {
        // this.getRelationDrug()
      }
    }
  },
  created() {
    console.log(this.$route.query.productCode)
    this.productCode = this.$route.query.productCode || ''
    this.productId = this.$route.query.productId || ''
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.drug-container {
  min-height: 100%;
  background-color: #f2f2f2;
  .swipe-banner {
    width: 100%;
    height: 200px;
    /deep/ .van-swipe__track {
      height: 200px;
      .van-swipe-item {
        text-align: center;
        .img {
          max-height: 200px;
        }
      }
    }
  }
  .drug-title {
    padding: 10px;
    background-color: #fff;
    font-size: 14px;
    color: #333;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .items {
    font-size: 14px;
    padding: 5px 10px;
    .name {
      display: flex;
      align-items: center;
      font-size: 14px;
      &::before {
        content: '';
        display: inline-block;
        margin: 0 5px;
        width: 10px;
        height: 3px;
        background-color: #037de0;
      }
    }
    .intro {
      padding-left: 20px;
      text-indent: 16px;
      color: #5C5C5C;
      .primary {
        color: #037de0;
      }
    }
  }
  .panel {
    background: #fff; 
    height: 315px;
    overflow: auto;
  }
  .img-container {
    display: flex;
    align-items: center;
    >div {
      width: 45%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .img-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 86px;
      background-color: #F2F2F2;
      margin: 10px 0;
      .img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .img-name {
      color: #333;
    }
  }
}
.p-null {
  padding: 0 !important;
}
.mt-15 {
  margin-top: 15px;
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-bar-inner{
  background:rgba(0,202,172,1)
}
</style>
