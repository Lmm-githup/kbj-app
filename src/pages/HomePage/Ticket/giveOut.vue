<template>
  <div class="ticket-container">
    <div class="ticket-header">
      <x-header 
        :left-options="{showBack: true,backText: ''}" 
        :right-options="{showMore: true}" 
        @on-click-more="showMenus = true">
        优惠券发放
      </x-header>
    </div>
    <div class="section">
      <h2 class="title">分享优惠券给会员</h2>
      <div class="banner-box">
        <div>
          <span class="number">8</span> 折优惠券
        </div>
      </div>
      <div class="tips">
        <p>八折优惠券 限制10张</p>
        <p>有效期：2019年1月1日-2019年1月10日</p>
      </div>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus" show-cancel @on-click-menu="send"></actionsheet>
    </div>
  </div>
</template>

<script>
import { XHeader, Actionsheet, TransferDomDirective as TransferDom } from "vux";
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Actionsheet
  },
  data() {
    return {
      menus: ['发送给朋友'],  
      showMenus: false
    }
  },
  methods: {
    send(value) {
      console.log('send', value)
      if (value === 0) {
        this.$router.push({ name: 'ticketGet' })
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ticket-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: #f2f2f2;
  .ticket-header {
    color: #fff;
    background: linear-gradient(135deg, rgba(1, 131, 255, 1) 0%, rgba(1, 131, 255, 1) 0%, rgba(14, 88, 226, 1) 100%, rgba(14, 88, 226, 1) 100%);
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
  .section {
    flex: 1;
    background: url('../../../assets/images/ticket/u1306.png');
    .title {
      margin-top: 50px;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }
    .banner-box {
      width: 268px;
      height: 220px;
      margin: 0 auto;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      background: #000;
      background: url('../../../assets/images/ticket/u1323.png') no-repeat;
      background-size: 268px 220px;
      position: relative;
      >div {
        position: absolute;   
        top: 85px; 
        left: 110px;
        font-style: italic;
        .number {
          font-size: 36px;
        }
      }
    }
    .tips {
      margin-top: 20px;
      margin-left: 30px;
      font-size: 16px;
    }
  }
}
</style>
