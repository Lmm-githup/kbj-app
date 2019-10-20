<template>
  <div style="height:100%;">
    <view-box body-padding-top="40px" class="drug-shop-container">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}" class="header">
      有货门店
    </x-header>
    <!-- 搜索栏 -->
    <div class="search">
      <group>
        <x-input v-model="orgName" placeholder="请输入门店名称搜索">
          <a slot="right" @click="search" class="fa fa-search search-icon"></a>
        </x-input>
      </group>
    </div>
    <div class="shop-list">
      <div class="list-item" v-for="(item, index) in list" :key="index">
        <h3 class="name">{{item.orgName | nullset}}</h3>
        <div class="flex-box mt-10">
          <div class="address">{{item.address | nullset}}</div>
          <div class="distance">
            <span class="fa fa-map-marker"></span>
            <span>{{item.distance | nullset}}km</span>
          </div>
        </div>
        <div class="flex-box mt-10">
          <!-- <div class="date"><span class="fa fa-clock-o"></span> 营业时间：8:00-20:30</div> -->
          <div class="date">{{item.orgType}}</div>
          <a class="go" @click="goRoute(item)">
            去这里
          </a>
        </div>
        <div class="flex-box mt-10 bottom">
          <div class="tel"><span class="fa fa-phone"></span> {{item.phone | nullset}}</div>
          <div class="detail">库存: {{item.stock}}</div>
        </div>
      </div>
    </div>
    <infinite-loading :identifier="infiniteId"  @infinite="infiniteHandler" v-if="hasIp">
      <span slot="no-results" class="null-data">
        <no-data></no-data>
      </span>
      <load-more slot="no-more" :show-loading="false" tip="没有更多了" background-color="#fbf9fe"></load-more>
    </infinite-loading>
  </view-box>
  </div>
</template>

<script>
import * as $ from 'jquery'
import { 
  XHeader, 
  Group, 
  Cell, 
  XInput,
  LoadMore,
  TransferDomDirective as TransferDom 
} from "vux";
import { postDrugNearbyList } from '@/api/drug'
import NoData from '@/components/common/NoData'
import InfiniteLoading from "vue-infinite-loading";
import { getLocation } from '@/utils/getLocation';
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Group, 
    Cell, 
    XInput,
    LoadMore,
    NoData,
    InfiniteLoading
  },
  data: () => ({
    list: [],
    orgName: '',
    currentPage: 1,
    pageSize: 10,
    infiniteId: +new Date(),
    localtion: {
      point: {
        x: '',  // 经度 longitude
        y: '' // 纬度 latitude
      }
    },
    hasIp: false // 先获取ip 在获取列表
  }),
  methods: {
    search () {
      this.list = []
      this.currentPage = 1
      this.infiniteId = +new Date()
    },
    infiniteHandler ($state) {
      let { x, y } = this.localtion.point
      postDrugNearbyList({
        // longitude: '117.819244', // 经度
        longitude: x, // 经度
        // lat: '24.44493', // 纬度
        lat: y, // 纬度
        orgName: this.orgName,
        // pageSize: this.pageSize,
        pageSize: 10000,
        productCode: this.$route.query.productCode,
        // pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
        if(res.code === 200) {
          let { list, paginator } = res.data
          this.list = this.list.concat(list.map(item => {
            if (item.distance) {
              item.distance = (Number(item.distance)).toFixed(2)
            }
            return item
          }) || [])
          if (this.currentPage <= paginator.totalPages) {
            $state.loaded()
            if (paginator.totalCounts <= 10000) {
              $state.complete();
            }
          } else {
            $state.complete();
          }
          this.currentPage++;
        }
      }) 
    },
    goRoute(item) {
      this.$store.commit('getCurrentShopInfo', item)
      let ip = {
        shopIp: {
          latitude: item.lat,
          longitude: item.longitude,
        },
        userIp: {
          latitude: this.localtion.point.y,
          longitude: this.localtion.point.x,
        }
      }
      this.$router.push({ name: 'shopMap', query: { ip: JSON.stringify(ip) } })
    }
  },
  created() {
    let _this = this
    let domScript = document.createElement('script')
    domScript.src = 'https://pv.sohu.com/cityjson?ie=utf-8'
    domScript.onload = () => {

      _this.localtion.ip = returnCitySN.cip
      
      $.getJSON("https://api.map.baidu.com/location/ip?callback=?", {
        'ak' : 'lApvxfMWyOB9So5CZUOupRGg7wLYlbGx',
        'coor' : 'bd09ll',
        'ip' : _this.localtion.ip
      }, function(data) {
        let { address, address_detail, point } = data.content

        _this.localtion.province = address_detail.province;
        _this.localtion.city = address_detail.city;
        _this.localtion.district = address_detail.district;
        _this.localtion.point = point;

        _this.hasIp = true
      })
    }
    document.head.append(domScript)
  }
}
</script>

<style lang="less" scoped>
.drug-shop-container {
  height: 100%;
  overflow: auto;
  .header {
    background-color: rgba(0,202,172,1)!important;
    border:none;
    /deep/.vux-header-title {
      color: #fff!important;
    } 
  }
  // 搜索栏
  .search {
    padding: 10px 0;
    background-color: rgba(0,202,172,1);
    /deep/ .weui-cells {
      margin: 0;
      background-color: transparent;
      position: relative;
      line-height: 20px;
      &::before,
      &::after {
        display: none;
      }
      .weui-cell {
        padding: 2px 10px;
        width: 70%;
        margin: 0 auto;
        background-color: #fff;
        border: 1px solid #dfdfdf;
        border-radius: 30px;
      }
      .weui-input {
        font-size: 13px;
        color: #333;
        &::placeholder {
          font-size: 13px;
        }
      }
    }
  }
  .shop-list {
    .list-item {
      background-color: #fff;
      margin-bottom: 10px;
      font-size: 14px;
      padding: 15px;
      .bottom {
        border-top: 1px solid #dfdfdf;
        padding-top: 10px;
      }
      .name {
        font-size: 16px;
        color: #333;
        font-weight: 700;
      }
      .address  {

      }
      .distance  {

      }
      .date  {
        color: #6B6B6B;
      }
      .go  {
        width: 66px;
        height: 23px;
        line-height: 23px;
        background-color: #408cd8;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        display: block;
      }
      .date  {

      }
      .tel  {

      }
      .detail  {

      }
    }
  }
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .mt-10 {
    margin-top: 10px;
  }
}
</style>
