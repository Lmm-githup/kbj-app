<template>
  <div class="ticket-container">
    <x-header :left-options="{showBack: true,backText: ''}"></x-header>
    <h3 class="title">优惠券已经被抢光啦</h3>   
    <!-- 优惠券 -->
    <div class="ticket-banner"></div>
    <p class="tip">成为康佰家会员享受更多独享权！！！</p>
    <!-- 领取 -->
    <x-button class="button">康佰家会员中心</x-button>
    <!-- 领取列表 -->
    <div class="list">
      <div class="list-item" v-for="(item, index) in 6" :key="index">
        <span>•</span> 会员 <span>150******86</span> 抢到了一张优惠券
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, XButton } from "vux";

export default {
  components: {
    XHeader,
    XButton
  },
  data(){
    return {

    }
  },
  methods: {
      
  }
}
</script>

<style lang="less" scoped>
.ticket-container{
  min-height: 100%;
  background: url('../../../assets/images/ticket/u1306.png');
  text-align: center;
  /deep/ .vux-header {
    background-color: transparent !important;
    .vux-header-title {
      color: #000 !important;
    }
    .left-arrow {
      &::before {
        border-color: #000;
      }
    }
  }
  .title {
    color: #333;
    font-size: 18px;
  }
  .ticket-banner {
    width: 294px;
    height: 272px;
    background: url('../../../assets/images/ticket/u1541.png') no-repeat;
    background-size: 294px 272px;
    margin: -20px auto 0;
    color: #fff;
    font-size: 20px;
    position: relative;
  }
  .tip {
    font-size: 16px;
    font-weight: 700;
    color: #FF962D;
  }
  .button {
    width: 66.6%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    background: #f59715;
    font-size: 14px;
    margin: 30px auto 0;
  }
  .list {
    width: 66.6%;
    max-height: 150px;
    overflow: auto;
    margin: 50px auto 0;
    font-size: 12px;
    color: #5E5E5E;
    .list-item {
      &:not(:first-child) {
        margin-top: 10px;
      }
    }
  }
}
</style>
