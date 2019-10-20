<template>
  <div>
    <!-- <div style="height:44px;">
      <sticky
        ref="sticky"
        scroll-box="vux_view_box_body"
        :offset="pdtNum"
        :check-sticky-support="false"
        :disabled="disabled"
    >-->
    <div>
      <tab v-model="status">
        <tab-item @on-item-click="switchTabItem('已领取')">已领取</tab-item>
        <tab-item @on-item-click="switchTabItem('已使用')">已使用</tab-item>
        <tab-item @on-item-click="switchTabItem('已过期')">已过期</tab-item>
      </tab>
    </div>
    <!-- </sticky>
    </div>-->
    <div class="container">
      <div v-for="(item, index) in List" :key="index">
        <div
          class="coupon-item"
          :class="{disabled: voucherStatus == '已使用' || voucherStatus == '已过期'}"
          v-if="item.voucherType === '代金券'"
        >
          <div class="coupon-item__head">
            <span class="title">¥{{item.creditAmount}}</span>
            <span class="subtitle"></span>
          </div>
          <div class="coupon-item__main">
            <p class="title">{{item.creditAmount}}元优惠券</p>
            <p class="subtitle">
              ¥ {{item.creditAmount}}
              <span class="sign">满{{item.minimumAmount}}元可用</span>
            </p>
            <p
              class="after"
            >{{item.beginTime | dateFormat('YYYY-MM-DD')}} - {{item.endTime | dateFormat('YYYY-MM-DD')}}</p>
          </div>
          <div class="coupon-item__after disabled">
            <div v-if="voucherStatus == '已使用'" class="invalid">
              <img :src="used">
            </div>
            <div v-else-if="voucherStatus == '已过期'" class="expired">
              <img :src="expired">
            </div>
            <x-button
              v-else
              class="btn"
              mini
              plain
              @click.native="showBarCode(item.voucherNumber)"
            >立即使用</x-button>
          </div>
        </div>
        <div
          class="coupon-item discount"
          :class="{disabled: voucherStatus == '已使用' || voucherStatus == '已过期'}"
          v-else-if="item.voucherType === '折扣券'"
        >
          <div class="coupon-item__head">
            <span class="title">{{item.discountRate}}</span>
            <span class="subtitle">折</span>
          </div>
          <div class="coupon-item__main">
            <p class="title">{{item.discountRate}}折优惠券</p>
            <p class="subtitle">{{item.checkoutStore}}可用</p>
            <p
              class="after"
            >{{item.beginTime | dateFormat('YYYY-MM-DD')}} - {{item.endTime | dateFormat('YYYY-MM-DD')}}</p>
          </div>
          <div class="coupon-item__after">
            <div v-if="voucherStatus == '已使用'" class="invalid">
              <img :src="used">
            </div>
            <div v-else-if="voucherStatus == '已过期'" class="expired">
              <img :src="expired">
            </div>
            <x-button
              v-else
              class="btn"
              mini
              plain
              @click.native="showBarCode(item.voucherNumber)"
            >立即使用</x-button>
          </div>
        </div>
        <div
          class="coupon-item cash"
          :class="{disabled: voucherStatus == '已使用' || voucherStatus == '已过期'}"
          v-else-if="item.voucherType === '固定价格券'"
        >
          <div class="coupon-item__head">
            <span class="title">¥ {{item.specialAmount}}</span>
            <span class="subtitle"></span>
          </div>
          <div class="coupon-item__main">
            <p class="title">{{item.voucherType}}</p>
            <p class="subtitle"></p>
            <p
              class="after"
            >{{item.beginTime | dateFormat('YYYY-MM-DD')}} - {{item.endTime | dateFormat('YYYY-MM-DD')}}</p>
          </div>
          <div class="coupon-item__after">
            <div v-if="voucherStatus == '已使用'" class="invalid">
              <img :src="used">
            </div>
            <div v-else-if="voucherStatus == '已过期'" class="expired">
              <img :src="expired">
            </div>
            <x-button
              v-else
              class="btn"
              mini
              plain
              @click.native="showBarCode(item.voucherNumber)"
            >立即使用</x-button>
          </div>
        </div>
        <div
          class="coupon-item gift"
          :class="{disabled: voucherStatus == '已使用' || voucherStatus == '已过期'}"
          v-else-if="item.voucherType === '礼品券'"
        >
          <div class="coupon-item__head">
            <span class="title">{{item.voucherType}}</span>
            <span class="subtitle"></span>
          </div>
          <div class="coupon-item__main">
            <p class="title">{{item.voucherType}}</p>
            <p class="subtitle">{{item.checkoutStore}}可用</p>
            <p
              class="after"
            >{{item.beginTime | dateFormat('YYYY-MM-DD')}} - {{item.endTime | dateFormat('YYYY-MM-DD')}}</p>
          </div>
          <div class="coupon-item__after">
            <div v-if="voucherStatus == '已使用'" class="invalid">
              <img :src="used">
            </div>
            <div v-else-if="voucherStatus == '已过期'" class="expired">
              <img :src="expired">
            </div>
            <x-button
              v-else
              class="btn"
              mini
              plain
              @click.native="showBarCode(item.voucherNumber)"
            >立即使用</x-button>
          </div>
        </div>
      </div>
      <infinite-loading
        @infinite="infiniteHandler"
        spinner="circles"
        :identifier="infiniteId"
        ref="infiniteLoading"
      >
        <load-more slot="no-more" v-if="List.length" :show-loading="false" :tip="'没有更多了'"></load-more>
        <no-data slot="no-more" v-else ></no-data>
        <no-data slot="no-results"></no-data>
        
      </infinite-loading>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showModel" class="dialog-demo">
        <div class="dialog-title">优惠券编号</div>
        <div class="bar-code-num">
          <vue-barcode :value="curvoucherNumber"></vue-barcode>
        </div>
        <a style="display:block" @click="showModel=false">
          <span class="vux-close"></span>
        </a>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import {
  Sticky,
  Tab,
  TabItem,
  XButton,
  XDialog,
  LoadMore,
  TransferDomDirective as TransferDom
} from "vux";
import { mapState } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import { getMemberCoupon } from "@/api/mymember";
import NoData from "@/components/common/NoData";
import VueBarcode from "vue-barcode";
import used from "@/assets/images/relation/used.png";
import expired from "@/assets/images/relation/u3058.png";
export default {
  name: "memberCoupon",
  directives: {
    TransferDom
  },
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: {
    Sticky,
    Tab,
    TabItem,
    XButton,
    XDialog,
    InfiniteLoading,
    LoadMore,
    NoData,
    VueBarcode
  },
  data() {
    return {
      used,
      expired,
      disabled:
        typeof navigator !== "undefined" &&
        /iphone/i.test(navigator.userAgent) &&
        /ucbrowser/i.test(navigator.userAgent),
      status: 0,
      voucherStatus: "已领取",
      pageSize: 10,
      currentPage: 1,
      List: [],
      hasMore: true,
      infiniteId: +new Date(),
      showModel: false,
      curvoucherNumber: ""
    };
  },
  computed: {
    ...mapState({
      pdtNum: state => state.mymember.pdtNum
    })
  },
  watch: {},
  created() {},
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.sticky.bindSticky();
    // });
  },
  methods: {
    infiniteHandler($state) {
      let params = {
        memberId: this.custNo,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        voucherStatus: this.voucherStatus
      };
      getMemberCoupon(params).then(res => {
        let { list, paginator } = res.data;
        if (this.currentPage < paginator.totalPages) {
          this.hasMore = true;
          this.currentPage++;
          this.List.push(...list);
          $state.loaded();
        } else {
          this.hasMore = false;
          this.currentPage++;
          this.List.push(...list);
          if (
            paginator.totalCounts <= paginator.pageSize &&
            paginator.totalCounts > 0
          ) {
            $state.loaded();
          }
          $state.complete();
        }
      });
    },
    switchTabItem(e) {
      this.voucherStatus = e;
      this.currentPage = 1;
      this.List = [];
      this.infiniteId += 1;
    },
    showBarCode(e) {
      // edit disabled
      return;
      this.curvoucherNumber = e;
      this.showModel = true;
    }
  }
};
</script>
<style lang="less" scoped>
@import "~vux/src/styles/close";

.dialog-demo {
  .weui-dialog {
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .bar-code-num {
    width: 100%;
    margin: 36px auto;
    font-size: 24px;
    text-align: center;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}

.container {
  padding: 10px 15px;
}
.coupon-item {
  display: flex;
  border-radius: 6px;
  background-color: #fff;
  height: 88px;
  overflow: hidden;
  margin-bottom: 15px;
  &.disabled {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
  &__head {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 75px;
    background: linear-gradient(#3b70e0, #2958ba);
    &::after {
      position: absolute;
      content: " ";
      top: 0;
      right: 0;
      bottom: 0;
      width: 3px;
      padding: 2px;
      background-image: radial-gradient(#fff 35%, transparent 35%);
      background-size: 12px 12px;
      background-position: 1px 0;
      background-repeat: repeat-y;
    }
    .title {
      font-size: 18px;
      color: #fff;
    }
    .subtitle {
      font-size: 12px;
      color: #fff;
      margin-bottom: -4px;
    }
  }
  &__main {
    position: relative;
    flex: 1;
    padding: 4px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &::after {
      position: absolute;
      content: " ";
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background-image: linear-gradient(
        to bottom,
        #c7c7c7 0%,
        #c7c7c7 50%,
        transparent 50%
      );
      background-size: 1px 10px;
      background-repeat: repeat-Y;
    }
    .title {
      font-size: 12px;
      color: #333;
    }
    .subtitle {
      font-size: 16px;
      color: #3b71e0;
      .sign {
        font-size: 12px;
      }
    }
    .after {
      font-size: 12px;
      color: #5c5c5c;
    }
  }
  &__after {
    position: relative;
    width: 98px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.disabled {
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      -o-filter: grayscale(100%);
      filter: grayscale(100%);
      filter: gray;
    }
    &::before {
      position: absolute;
      content: " ";
      top: -6px;
      left: -6px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #f8f8f8;
      z-index: 1;
    }
    &::after {
      position: absolute;
      content: " ";
      bottom: -6px;
      left: -6px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #f8f8f8;
      z-index: 1;
    }
    .btn {
      border-radius: 30px;
      border-color: #037de0;
      color: #037de0;
    }
    .invalid,
    .expired {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      img {
        display: block;
        width: 60px;
        height: 60px;
      }
    }
  }
  &.discount {
    .coupon-item__head {
      background: linear-gradient(#5d22d4, #2245a0);
    }
    .coupon-item__main {
      .title {
        font-size: 16px;
      }
    }
  }
  &.cash {
    .coupon-item__head {
      background: linear-gradient(#ffc600, #ff9500);
    }
    .coupon-item__main {
      .title {
        font-size: 16px;
        color: #ff9c12;
      }
    }
    .btn {
      border-color: #ff9c12;
      color: #ff9c12;
    }
  }
  &.gift {
    .coupon-item__head {
      background: linear-gradient(#eecf85, #e3af36);
    }
  }
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-ink-bar{
  background:rgba(0,202,172,1)
}
</style>