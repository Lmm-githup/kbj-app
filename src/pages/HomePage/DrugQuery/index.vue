<template>
  <div style="height:100%;">
    <view-box body-padding-top="40px" class="drug-container">
    <!-- 导航栏 -->
      <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">
        药品查询
        <router-link :to="{name: 'findDrugDetail'}" slot="right" style="color: #000;">
          我的找药
        </router-link>
      </x-header>
      <!-- 搜索框 -->
      <group class="search-input">
        <!-- <x-input v-model="searchValue" placeholder="请输入药品名称">
          <span slot="right" class="fa fa-search search-icon" @click="searchDrug()"></span>
        </x-input> -->
          <van-field v-model="searchValue" placeholder="请输入药品名称或编号" >
            <a slot="right-icon" class="fa fa-search search-icon" @click="searchDrug()"></a>
          </van-field>
        <a class="scan-box" @click="handleScan">
          <img :src="ImgScan" class="scan-logo" alt>
          <span>扫一扫</span>
        </a>
      </group>
      <!-- 搜索记录 -->
      <div class="search-content">
        <h3 class="search-title">
          <span>搜索记录</span>
          <a
            class="fa fa-trash-o"
            v-if="searchList.length"
            @click="deleteHistory"
            aria-hidden="true"
          ></a>
        </h3>
        <div class="search-list">
          <a
            class="search-list-item"
            @click="searchDrug(item)"
            v-for="(item, index) in searchList"
            :key="index"
          >{{item}}</a>
        </div>
      </div>
      <!-- <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getData">
        <div class="drug-list" v-for="(item, index) in dataList" :key="index">
          <div class="drug-list-item" @click="openActionSheet(item)">
            <div class="img-box">
              <img :src="item.productImages" alt="" class="img">
            </div>
            <div class="content">
              <p>{{item.productName}}</p>
              <p class="size">{{item.productSpec}}</p>
              <p class="inventory">库存：{{item.stock || 0}}</p>
            </div>
          </div>
        </div>
      </van-list>-->
      <!-- 有药品 列表 -->
      <div class="drug-list" v-for="(item, index) in dataList" :key="index">
        <a class="drug-list-item" @click="openActionSheet(item)">
          <div class="img-box">
            <img :src="item.coverImg" alt class="img">
          </div>
          <div class="content">
            <p>{{item.productName}}</p>
            <p class="size">{{item.productSpec}}</p>
            <p class="inventory">库存：{{item.stock || 0}}</p>
          </div>
        </a>
      </div>
      <actionsheet v-model="show" :menus="menus" @on-click-menu="handleMenu" show-cancel></actionsheet>
      <div v-transfer-dom>
        <confirm
          show-input
          placeholder="请输入补货数量"
          :input-attrs="{type: 'number'}"
          v-model="confirmShow"
          @on-confirm="onConfirm"
          ref="confirm"
          title="补货信息填写"
        >
          <!-- <label>补货数量</label> -->
          <!-- <x-input placeholder="请输入补货数量"></x-input> -->
          <!-- @on-cancel="onCancel"
        
        @on-show="onShow5"
          @on-hide="onHide">-->
        </confirm>
      </div>
      <!-- 没有药品 -->
      <div class="drug-null" v-if="(!dataList || dataList.length === 0) && searchFlag">
        <!-- <div class="drug-null" v-if="true"> -->
        <!-- <img :src="ImgNoData" class="banner" alt=""> -->
        <!-- <div class="info">暂时没有此产品</div> -->
        <no-data></no-data>
        <a class="button" @click="findDrug">找药申请</a>
      </div>
    <!-- <v-quagga v-if="isScan" :onDetected="logIt"  :readerSize="readerSize" :readerTypes="['ean_reader']"></v-quagga> -->

    <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler" v-if="isShow">
      <!-- <span slot="no-results" class="null-data"> -->

      <!-- </span> -->
      <load-more slot="no-more" :show-loading="false" tip="没有更多了" background-color="#fbf9fe"></load-more>
    </infinite-loading>
  </view-box>
  </div>
</template>

<script>
import ImgScan from "@/assets/images/drug/u2403.png";
import ImgNoData from "@/assets/images/drug/u2519.png";
import ImgDrug from "@/assets/images/drug/u2455.png";
import {
  XHeader,
  Group,
  XInput,
  Actionsheet,
  Confirm,
  XButton,
  LoadMore,
  TransferDomDirective as TransferDom
} from "vux";
import { postDrug, postDrugReplenishment } from "@/api/drug";
import Vue from "vue";
import { Field } from 'vant';
import VueQuagga from "vue-quaggajs";
// import { List } from 'vant';
import NoData from "@/components/common/NoData";
import { USER_INFO } from "@/utils/storage";
import InfiniteLoading from "vue-infinite-loading";
import Utils from "@/utils/utils";
const utils = new Utils();

// register component 'v-quagga'
Vue.use(VueQuagga).use(Field);
// .use(List)

export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Group,
    XInput,
    Actionsheet,
    Confirm,
    XButton,
    LoadMore,
    InfiniteLoading,
    NoData
  },
  data() {
    return {
      ImgScan,
      ImgNoData,
      ImgDrug,
      show: false,
      searchFlag: false, // 是否搜索过
      isScan: false,
      searchData: {},
      dataList: [],
      // searchValue: '(NZY)青葙子',
      searchValue: "",
      searchList: [],
      readerSize: {
        width: 640,
        height: 480
      },
      detecteds: [],
      menus: [
        { key: 0, label: "附近门店库存" },
        { key: 1, label: "查看商品详情" }
        // { key: 2,  label: '申请补货' }
      ],
      confirmShow: false,
      productCode: "",
      procudeRowNo: "",
      productCount: 0,
      orgCrmId: "",
      currentPage: 1,
      paginator: {},
      infiniteId: +new Date(),
      isShow: false
    };
  },
  methods: {
    handleMenu(menuKey, menuItem) {
      // 查看商品详情
      if (menuItem) {
        if (menuItem.key === 0) {
          this.$store.commit("getSearchDrugName", this.searchValue);
          this.$router.push({ 
            name: "drugShop",
            query: {
              productCode: this.productCode,
              productId: this.procudeRowNo
            }
           });
        }
        if (menuItem.key === 1) {
          this.$store.commit("getSearchDrugName", this.searchValue);
          this.$router.push({
            name: "drugDetail",
            query: {
              productCode: this.productCode,
              productId: this.procudeRowNo
            }
          });
        }
        if (menuItem.key === 2) {
          if (this.productCount > 0) {
            this.$vux.toast.show({
              text: `当前药品还有库存，暂不需补货！`,
              time: 2000,
              type: "text"
            });
            return;
          }
          this.confirmShow = true;
        }
      }
    },
    deleteHistory() {
      this.searchList = [];
      localStorage.removeItem("drugList");
    },
    findDrug() {
      this.$store.commit("getSearchDrugName", this.searchValue);
      this.$router.push({ name: "findDrug" });
    },
    handleScan() {
      console.log("1")
      console.log(window)
      let deviceType = utils.deviceType();
      if (
        deviceType === "android" &&
        window.androidShare &&
        window.androidShare.sendScan
      ) {
        window.androidShare.sendScan();
      } else if (
        deviceType === "ios" &&
        window.iosShare &&
        window.iosShare.sendScan
      ) {
        window.iosShare.sendScan();
      }

      // this.isScan = true
    },
    logIt(data) {
      console.log("detected", data);
      if (data.codeResult.code) {
        this.$vux.toast.show({
          text: `扫码成功!${data.codeResult.code}`,
          time: 2000,
          type: "text"
        });
      } else {
        this.$vux.toast.show({
          text: `识别失败`,
          time: 2000,
          type: "text"
        });
      }
      this.isScan = false;
    },
    async searchDrug(item) {
      console.log("item", item);
      // 点击搜索icon 输入框为空
      if (!this.searchValue.trim() && !item) {
        this.$vux.toast.show({
          text: "请输入药品名称",
          time: 2000,
          type: "text"
        });
        return;
      }
      // 搜索历史记录来搜索
      if (item) this.searchValue = item;

      if (!this.searchList.find(item => item === this.searchValue)) {
        this.searchList.unshift(this.searchValue);
        if (this.searchList.length > 5)
          this.searchList = this.searchList.slice(0, 5);
        localStorage.setItem(
          "drugList",
          JSON.stringify(this.searchList.join(","))
        );
      }

      // 重置数据
      this.currentPage = 1;
      this.paginator = {};
      this.dataList = [];
      this.searchFlag = false;
      this.isShow = true;
      this.infiniteId = +new Date();
    },
    infiniteHandler($state) {
      postDrug({
        productName: this.searchValue,
        sourceMarking: "",
        // orgCrmId: this.orgCrmId,
        orgCrmId: '8888',
        stockStatus: 1,
        currentPage: this.currentPage,
        pageSize: 10
      }).then(res => {
        if (res.code === 200) {
          this.searchFlag = true;
          if (res.data && res.data.list) {
            // this.dataList = res.data.list
            let { list, paginator } = res.data;
            this.dataList = this.dataList.concat(list || []);
            this.paginator = paginator;
            if (this.currentPage <= paginator.totalPages) {
              $state.loaded();
              if (paginator.totalCounts <= 10) {
                $state.complete();
              }
            } else {
              $state.complete();
            }
            this.currentPage++;
          } else {
            if (!this.paginator.totalCounts) {
              this.dataList = [];
              this.isShow = false;
            } else {
              $state.complete();
            }
          }
        }
      });
    },
    openActionSheet(item) {
      console.log("TCL: openActionSheet -> item", item);
      this.productCode = item.productCode;
      this.procudeRowNo = item.rowNo;
      this.productCount = item.stock;
      this.show = true;
    },
    onConfirm(value) {
      console.log("1Tracking: onConfirm -> value", value);
      if (!value) {
        this.$vux.toast.show({
          text: "请输入正确的补货数量!",
          time: 2000,
          type: "text"
        });
      }
      postDrugReplenishment({
        productCode: this.productCode,
        stock: value
      }).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            text: "补货成功!",
            time: 2000,
            type: "text"
          });
        }
      });
    },
    getScanCallback(params) {
      alert(JSON.stringify(params));
    }
  },
  created() {
    let searchList = localStorage.getItem("drugList");
    console.log(searchList)
    let userInfo = JSON.parse(this.$utils.getLocalData(USER_INFO));
    this.orgCrmId = userInfo.orgCode;
    if (searchList) {
      this.searchList = JSON.parse(searchList).split(",");
      console.log(this.searchList)
      console.log("TCL: created -> this.searchList", this.searchList);
    } else {
      this.searchList = [];
    }
  },
  mounted() {
    if (this.$store.state.drug.searchName) {
      this.searchValue = this.$store.state.drug.searchName;
      this.searchDrug();
      this.$store.commit("getSearchDrugName", "");
    }
    window.scanCallbcak = params => {
      // alert(JSON.stringify(params));
      this.searchValue = params.toString();
      this.searchDrug();
    };
  }
};
</script>

<style lang="less" scoped>
.drug-container {
  // min-height: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f2f2f2;
  .search-input {
    /deep/ .weui-cells {
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent !important;
      &::before,
      &::after {
        display: none;
      }
      .van-cell {
        flex: 1;
        padding: 4px 15px;
        border: 1px solid rgba(0,202,172,1);
        border-radius: 20px;
        background-color: #fff;
      }
      .van-field {
        font-size: 13px;
      }
    }
    .scan-box {
      font-size: 12px;
      color: rgba(0,202,172,1);
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-left: 20px;
      .scan-logo {
        width: 22px;
        height: 22px;
      }
    }
  }
  .search-content {
    padding: 0 20px;
    margin-top: 30px;
    .search-title {
      font-size: 15px;
      font-weight: normal;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .search-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .search-list-item {
        padding: 3px 10px;
        border-radius: 15px;
        background-color: #fff;
        margin-top: 10px;
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }
  }
  .drug-list {
    .drug-list-item {
      display: flex;
      align-items: center;
      background: #fff;
      margin-top: 10px;
      padding: 10px;
      .img-box {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        .img {
          max-height: 100%;
        }
      }
      .content {
        flex: 1;
        padding: 0 10px;
        font-size: 14px;
        .size {
          font-size: 12px;
        }
        .inventory {
          text-align: right;
          font-weight: 700;
        }
      }
    }
  }
  .drug-null {
    margin-top: 20px;
    padding: 50px 0 250px 0;
    text-align: center;
    position: relative;
    // background-color: #fff;
    .banner {
      width: 158px;
      height: 110px;
    }
    .info {
      font-size: 16px;
      color: #515151;
    }
    .button {
      display: block;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 16px;
      color: #fff;
      background-color: #0c5ee6;
      padding: 10px 0;
    }
  }
}

</style>
