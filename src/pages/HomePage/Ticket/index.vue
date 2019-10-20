<template>
  <div class="ticket-container">
    <div class="ticket-header">
      <x-header :left-options="{showBack: true,backText: ''}">券管理</x-header>
      <div class="ticket-info">
        <div class="ticket-info-item">
          <div>本月发放的张数</div>
          <div class="ticket-number">{{ticketInfo.minimumAmount}}</div>
        </div>
        <div class="ticket-info-item">
          <div>本月使用的张数</div>
          <div class="ticket-number">{{ticketInfo.quantity}}</div>
        </div>
        <div class="ticket-info-item">
          <div>本月关联销售额</div>
          <div class="ticket-number">{{ticketInfo.orderSales}}</div>
        </div>
      </div>
    </div>
    <!-- tab 栏 -->
    <tab custom-bar-width="75px">
      <tab-item selected @on-item-click="toggleTab">进行中</tab-item>
      <tab-item @on-item-click="toggleTab">已过期</tab-item>
    </tab>
    <!-- tab content -->
    <div class="ticket-list" v-show="currentIndex === 0">
      <!-- 进行中 -->
      <div class="ticket-item" v-for="(item, index) in ticketUnderwayData.data" :key="index">
        <div class="ticket-item-top">
          <!-- 左边 -->
          <div class="ticket-item-left">
            <div class="price is-active" v-if="item.couponType=='折扣券'">
              <span class="number">{{item.discountRate * 10}}</span>折
            </div>
            <div class="price is-active" v-else-if="item.couponType=='礼品券'">
              <span class="number">{{item.amt}}</span>元
            </div>
            <div class="price is-active" v-else-if="item.couponType=='固定价格券'">
              <span class="number">{{item.amt}}</span>元
            </div>
            <div class="price is-active" v-else>
              <span class="number">{{item.discountAmt}}</span>元
            </div>
            <div>{{item.couponType}}</div>
          </div>
          <!-- 右边 -->
          <div class="ticket-item-right">
            <div class="limit">{{item.ruleName}}</div>
            <div class="remain">剩余张数：{{item.stock ? item.stock : 0}}</div>
            <div
              class="date"
            >{{item.ruleStartDate | dateFormat('YYYY年MM月DD')}}-{{item.ruleEndDate | dateFormat('YYYY年MM月DD')}}</div>
          </div>
        </div>
        <div class="ticket-item-bottom">
          <!-- 分割线 -->
          <div class="ticket-item-line"></div>
          <div class="button-group">
            <a class="button-item" @click="showQRcode(item)">面对面发券</a>
            <div class="button-line"></div>
            <a class="button-item" @click="showPlugin(item)">发放此券</a>
            <div class="button-line"></div>
            <a class="button-item" @click="goRoute(item)">分析</a>
          </div>
        </div>
      </div>
    </div>
    <div class="ticket-list" v-show="currentIndex === 1">
      <!-- 已过期 -->
      <div class="ticket-item" v-for="(item, index) in ticketExpireData.data" :key="index">
        <div class="ticket-item-top">
          <div class="ticket-item-left">
            <div class="price">
              <span class="number">{{item.discountAmt}}</span>元
            </div>
            <div>{{item.couponType}}</div>
          </div>
          <div class="ticket-item-right">
            <div class="limit">{{item.ruleName}}</div>
            <div class="remain">剩余张数：{{item.stock}}</div>
            <div
              class="date"
            >{{item.fixedStartDate | dateFormat('YYYY年MM月DD ')}}-{{item.fixedEndDate | dateFormat('YYYY年MM月DD ')}}</div>
          </div>
        </div>
      </div>
    </div>
    <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler">
      <no-data slot="no-results"></no-data>
      <load-more slot="no-more" :show-loading="false" tip="没有更多了" background-color="#fbf9fe"></load-more>
    </infinite-loading>
    <van-dialog
      v-model="show"
      title="发放此券"
      class="send-ticket-dialog"
      @confirm="confirm"
      show-cancel-button>
      <van-stepper v-model="value" :step="1" :min="1" :max="maxValue" :integer="true"/>
    </van-dialog>
    <div v-transfer-dom>
      <x-dialog v-model="showToast" class="ticket-dialog-demo" hide-on-blur>
        <div class="img-box">
          <!-- <img :src="QRcodeImg" style="max-width:100%"> -->
          <qrcode :value="qrcodeValue" :options="{ width: '100%' }"></qrcode>
        </div>
        <a @click="showToast=false" style="padding:10px;display:block">
          <span class="vux-close"></span>
        </a>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {
  XHeader,
  Group,
  Tab,
  TabItem,
  LoadMore,
  XDialog,
  TransferDomDirective as TransferDom
} from "vux";
import { Dialog, Stepper } from 'vant'
import { getTicketList, getTicketTotal, postSendCoupon } from "@/api/ticket";
import NoData from "@/components/common/NoData";
import { datefmt } from "@/utils/common";
import InfiniteLoading from "vue-infinite-loading";
import { shareInfo } from "@/utils/shareConfig";
import { USER_INFO } from "@/utils/storage";
// import '@/utils/appInterface'
import Utils from "@/utils/utils";
const utils = new Utils();
import QRcodeImg from "@/assets/images/console/u1932.png";

import VueQrcode from "@chenfengyuan/vue-qrcode";

Vue.component(VueQrcode.name, VueQrcode);
Vue.use(Dialog)
.use(Stepper)
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Group,
    Tab,
    TabItem,
    NoData,
    LoadMore,
    XDialog,
    InfiniteLoading
  },
  data() {
    return {
      QRcodeImg,
      status: "进行中",
      currentIndex: 0,
      ticketInfo: {
        minimumAmount: 0, // 未使用张数
        quantity: 0, // 使用张数
        orderSales: 0, // 关联的订单金额
        grantNum: 0 // 发放张数
      },
      // 进行中的 优惠券
      ticketUnderwayData: {
        data: []
      },
      // 已过期 优惠券
      ticketExpireData: {
        data: []
      },
      currentPage: 1,
      pageSize: 10,
      // paginator: {
      //   currentPage: 1,
      //   pageSize: 10,
      //   totalCounts: 0,
      //   totalPages: 0
      // },
      hasMore: true,
      infiniteId: +new Date(),
      showToast: false,
      userCrmId: "",
      qrcodeValue: "sceneId=&voucherId=&voucherScode=",
      show: false,
      value: 0,
      maxValue: 0,
      item: {}
    };
  },
  computed: {
    isShow() {
      let flag = true;
      if (this.currentIndex === 0) {
        flag = this.ticketUnderwayData.data.length === 0;
      } else {
        flag = this.ticketExpireData.data.length === 0;
      }
      return flag;
    }
  },
  methods: {
    // 获取所有规则的统计信息
    getDetailData() {
      // 2019-01-01
      let endTime = datefmt(new Date(), "YYYY-MM-DD");
      let beginTime = endTime.split("-");
      beginTime[2] = "01";
      beginTime = beginTime.join("-");
      getTicketTotal({
        ruleId: "",
        beginTime,
        endTime
      }).then(res => {
        if (res.code === 200) {
          if (res.data) {
            Object.assign(this.ticketInfo, res.data);
          }
        }
      });
    },
    // 获取券列表
    infiniteHandler($state) {
      getTicketList({
        status: this.status,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
        if (res.code === 200) {
          let { list, paginator } = res.data;

          if (this.currentIndex === 0) {
            this.ticketUnderwayData.data = this.ticketUnderwayData.data.concat(
              list || []
            );
          } else {
            this.ticketExpireData.data = this.ticketExpireData.data.concat(
              list || []
            );
          }

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
    },
    // tab 切换
    toggleTab(index) {
      if (index === 0) {
        this.status = "进行中";
        this.ticketUnderwayData.data = [];
      } else if (index === 1) {
        this.status = "已过期";
        this.ticketExpireData.data = [];
      }
      this.currentIndex = index;
      this.infiniteId = +new Date();
      this.currentPage = 1;

      // this.getListData()
    },
    showQRcode(item) {
      let { path } = shareInfo;
      // sceneId=值&voucherId=值&voucherScode=值
      this.qrcodeValue = `sceneId=${this.userCrmId}&voucherId=${
        item.ruleNo
      }&voucherScode=`;
      this.showToast = true;
    },
    goRoute(item) {
      this.$router.push({
        name: "ticketDetail",
        query: { ruleId: item.ruleNo }
      });
    },
    confirm () {
      let _this = this
      let item = this.item
      postSendCoupon({
        ruleNo: item.ruleNo,
        num: _this.value
      }).then(res => {
        if (res.code === 200) {
          this.$vux.toast.text("发放成功!");
          let deviceType = utils.deviceType();
          let { userName, path, hdImageData, miniprogramType } = shareInfo;
          let sceneId = _this.$utils.getLocalData(USER_INFO, true)
            .userCrmId;
          path = `${path}?sceneId=${sceneId}&voucherId=${
            item.ruleNo
          }&voucherScode=${res.data.serialNo}`;
          let title = item.ruleName;
          let params = {
            userName,
            path,
            hdImageData,
            miniprogramType,
            title
          };
          if (deviceType === "android") {
            window.androidShare.shareLetapp(
              userName,
              path,
              hdImageData,
              miniprogramType,
              title
            );
          } else if (deviceType === "ios") {
            window.iosShare.shareLetapp(JSON.stringify(params));
          }
        } else {
          _this.$vux.toast.text(res.msg);
        }
      });
    },
    showPlugin(item) {
      if (!item.stock) {
        this.$vux.toast.text("该优惠券剩余张数为0，不能发放此优惠券！");
        return;
      }
      this.item = item
      this.maxValue = item.stock
      this.show = true

      return
      // this.$vux.confirm.prompt("", {
      //   title: "确认分享券限制张数",
      //   confirmText: "确认",
      //   onShow() {
      //     console.log("promt show");
      //     // _this.$vux.confirm.setInputValue('请输入')
      //   },
      //   onHide() {
      //     console.log("prompt hide");
      //   },
      //   onCancel() {
      //     console.log("prompt cancel");
      //   },
      //   onConfirm(value) {
      //     let reg = /^[1-9]\d*$/;
      //     if (!reg.test(value)) {
      //       _this.$vux.toast.text("请输入0以上的数字");
      //       return;
      //     }
      //     if (value > item.stock) {
      //       _this.$vux.toast.text("超过剩余的张数，发放失败！");
      //       return;
      //     }
      //     console.log(item);
      //     console.log(value);
          
      //     // _this.$router.push({ name: 'ticketGiveOut' })
      //   }
      // });
    }
  },
  created() {
    this.getDetailData();
    // this.getListData()
    this.userCrmId = this.$utils.getLocalData(USER_INFO, true).userCrmId;
  }
};
</script>
<style lang="less">
@import "~vux/src/styles/close";
.ticket-dialog-demo {
  .weui-dialog {
    width: 66.66%;
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    padding: 30px;
    padding-bottom: 0;
    // width: 240px;
    // height: 300px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>


<style lang="less" scoped>
.ticket-container {
  height: 100%;
  overflow: auto;
  background-color: #f2f2f2;
  .ticket-header {
    color: #fff;
    background:rgba(0,202,172,1)
  }
  /deep/ .vux-header {
    background-color: transparent !important;
    .vux-header-title {
      color: #fff !important;
    }
    .left-arrow {
      &::before {
        border-color: #fff;
      }
    }
  }
  .ticket-info {
    display: flex;
    align-items: center;
    padding: 10px 0;
    .ticket-info-item {
      flex: 1;
      text-align: center;
      .ticket-number {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  // 券 列表
  .ticket-list {
    padding: 0 5%;
    .ticket-item {
      color: #515151;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 4px 4px 4px #ccc;
      margin: 10px 0;
      .ticket-item-top {
        display: flex;
        padding: 8px;
      }
      .ticket-item-left {
        flex: 2;
        text-align: center;
        .price {
          color: #aeaeae;
          font-size: 16px;
          margin-bottom: 5px;
          &.is-active {
            color: #ff962d;
          }
        }
        .number {
          font-size: 32px;
        }
      }
      .ticket-item-right {
        flex: 3;
        .limit {
          font-size: 16px;
        }
        .remain {
          font-size: 14px;
          margin-top: 5px;
        }
        .date {
          font-size: 12px;
          margin-top: 8px;
          color: #797979;
        }
      }
      .ticket-item-line {
        width: 100%;
        height: 2px;
        background: url("../../../assets/images/ticket/u11267.png");
      }
      // 按钮
      .button-group {
        display: flex;
        height: 40px;
        line-height: 40px;
        width: 100%;
        .button-item {
          flex: 1;
          text-align: center;
          font-size: 16px;
          cursor: pointer;
        }
        .button-line {
          width: 2px;
          height: 31px;
          margin-top: 4px;
          background: url("../../../assets/images/ticket/u1258.png");
        }
      }
    }
  }
}
/deep/.send-ticket-dialog {
  .van-stepper {
    text-align: center;
    margin: 20px 0;
    .van-stepper__input {
      width: 75px;
    }
  }
}
.text-normal {
  font-size: 14px;
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
  border:2px solid rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-bar-inner{
  background:rgba(143, 148, 154, 1)
}
</style>
