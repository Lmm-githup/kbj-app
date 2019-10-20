<template>
  <div class="container">
    <div class="fiexd-head">
      <x-header :left-options="{showBack: true,backText: ''}">积分兑换</x-header>
      <van-search
        placeholder="请输入会员手机号"
        type="tel"
        v-model="mobile"
        show-action
        shape="round"
        @search="onSearch"
      >
        <a style="display:block" slot="action" @click="onSearch">搜索</a>
      </van-search>
      <div class="top">
        <div>
          <div class="number">{{expensePoints || 0}}</div>
          <div>消费积分</div>
        </div>
        <div>
          <div class="number">{{behaviorPoints || 0}}</div>
          <div>行为积分</div>
        </div>
      </div>
      <div class="sub-title-box">
        <div class="sub-title">积分兑换专区</div>
        <div>当前会员: {{memberName ||'无'}}</div>
      </div>
    
    <tab custom-bar-width="75px">
      <tab-item selected @on-item-click="toggleTab">礼品</tab-item>
      <tab-item @on-item-click="toggleTab">优惠券</tab-item>
    </tab>
    </div>
    <div class="list">
      <div
        class="ticket-list-item"
        v-if="currentIndex === 1"
        v-for="(item, index) in couponList"
        :key="index"
      >
        <img :src="bannerImg" class="banner">
        <div class="left">
          <div>
            <span
              class="number"
            >{{(item.couponType == '代金券' || item.couponType == '固定价格券') ? 
            '￥' + item.discountAmt :
             item.couponType == '折扣券'?
              item.discountRate * 10 + '折':
               0 }}</span>
          </div>
          <div style="font-size:12px;">{{item.couponName}}</div>
          <div style="font-size:12px;">{{item.pointType}}{{item.points}}</div>
        </div>
        <a class="right" @click="handleExchange(item)">立即兑换</a>
      </div>

      <!-- 奖品 -->
      <div
        class="prize-list"
        v-if="currentIndex === 0"
        v-for="(item, index) in giftList"
        :key="index"
      >
        <div class="prize-list-item">
          <div class="img-box">
            <img :src="item.coverImg" class="img">
          </div>
          <div style="font-size:12px;">{{item.productName}}</div>
          <div style="font-size:12px;">{{item.pointType}}{{item.points}}</div>
          <a style="font-size:12px;color:#037de0;display:block" @click="handleExchange(item)">立即兑换</a>
        </div>
      </div>
    </div>
    <no-data v-if="currentIndex === 1 && !couponList.length"></no-data>
    <no-data v-if="currentIndex === 0 && !giftList.length"></no-data>
  </div>
</template>

<script>
import { XHeader, Tab, TabItem } from "vux";
import bannerImg from "@/assets/images/ticket_banner.png";
import prizeImg from "@/assets/images/drug/u2455.png";
import NoData from "@/components/common/NoData.vue";
import { getConponList, exchangeCoupon, detailByMobile } from "@/api/home";
import { Search } from "vant";
import Vue from "vue";
Vue.use(Search);
export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    NoData
  },
  data() {
    return {
      bannerImg,
      prizeImg,
      currentIndex: 0,
      couponList: [],
      giftList: [],
      expensePoints: 0,
      behaviorPoints: 0,
      mobile: "",
      custNo: "",
      memberName: ""
    };
  },
  methods: {
    onSearch() {
      let reg = /^[1]([3-9])[0-9]{9}$/;
      if (!reg.test(this.mobile)) {
        this.$vux.toast.show({
          text: "请输入正确的手机号",
          time: 2000,
          type: "text"
        });
        return;
      }
      this.queryMoblie();
    },
    queryMoblie() {
      detailByMobile({
        mobile: this.mobile
      }).then(res => {
        if (+res.code === 200) {
          if (res.data) {
            this.expensePoints = res.data.memberIntegral;
            this.behaviorPoints = res.data.totalIntegral;
            this.custNo = res.data.custNo;
            this.memberName = res.data.memberName;
          } else {
            this.$vux.toast.show({
              text: "未找到该会员",
              time: 2000,
              type: "text"
            });
          }
          // this.userInfo = res.data;
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    handleExchange(item) {
      if (!this.custNo) {
        this.$vux.toast.show({
          text: "请查询要兑换的会员",
          time: 2000,
          type: "text"
        });
        return;
      }
      if (item.pointType == "消费积分" && item.points > this.expensePoints) {
        this.$vux.toast.show({
          text: `该会员消费积分不足${item.points}`,
          time: 2000,
          type: "text"
        });
        return;
      }
      if (item.pointType == "行为积分" && item.points > this.behaviorPoints) {
        this.$vux.toast.show({
          text: `该会员行为积分不足${item.points}`,
          time: 2000,
          type: "text"
        });
        return;
      }
      exchangeCoupon({
        ruleNo: item.ruleNo,
        getVoucherMember: this.custNo,
        poions: item.points,
        pointType: item.pointType
      }).then(res => {
        if (+res.code === 200) {
          this.$vux.toast.show({
            text: "兑换成功",
            time: 2000,
            type: "text"
          });
          this.queryMoblie();
          this.getList();
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    toggleTab(index) {
      console.log(this.currentIndex);
      this.currentIndex = index;
    },
    getList() {
      getConponList().then(res => {
        if (+res.code === 200) {
          this.couponList = res.data.coupon;
          this.giftList = res.data.gift;
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
.container {
  padding-top: 275px;
  .fiexd-head {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    /deep/ .van-cell__value--alone {
      display: flex;
      align-items: center;
    }
    /deep/.van-field__body {
      width: 100%;
    }
  }
  .top {
    background-color: #43362d;
    font-size: 13px;
    color: #7a7269;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
      padding: 15px 0;
      flex: 1;
      text-align: center;
    }
    .number {
      font-size: 24px;
      color: #e1b992;
    }
  }
  .sub-title-box {
    background: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;

    .sub-title {
      padding-left: 5px;
      border-left: 2px solid #ee7b38;
    }
  }
  .tab {
    padding: 15px;
    border-top: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
    display: flex;
    align-items: center;
    font-size: 13px;
    .tab-item {
      margin-right: 20px;
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .ticket-list-item {
      width: 50%;
      min-height: 50px;
      padding: 15px 5px 5px;
      position: relative;
      box-sizing: border-box;
      font-size: 13px;
      color: #fff;
      .banner {
        width: 175px;
      }
      .left {
        position: absolute;
        top: 18px;
        left: 30px;
        text-align: center;
        .number {
          font-size: 18px;
        }
      }
      .right {
        position: absolute;
        right: 14px;
        top: 17px;
        width: 13px;
        padding: 0 10px;
        line-height: 16px;
        display: block;
      }
    }
    .prize-list {
      width: 50%;
      padding: 5px;
      box-sizing: border-box;
      .prize-list-item {
        background-color: #fff;
        padding: 15px;
        .img-box {
          border: 1px solid #dfdfdf;
          border-radius: 4px;
          width: 100%;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          .img {
            max-width: 90%;
            max-height: 90%;
          }
        }
      }
    }
  }
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-bar-inner{
  background:rgba(143, 148, 154, 1)
}
</style>
