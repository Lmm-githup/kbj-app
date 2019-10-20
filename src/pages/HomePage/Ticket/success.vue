<template>
  <div class="ticket-container">
    <x-header :left-options="{showBack: true,backText: ''}"></x-header>
    <h3 class="title">恭喜您获得</h3>   
    <h3 class="title">
        <span class="number">8</span> 折优惠券
    </h3>   
    <!-- 优惠券 -->
    <div class="ticket-banner">
      <div class="box">
        <p class="line-1">
          <span class="number">8</span> 折优惠券
        </p>
        <p>有效期：</p>
        <p>2019/5/1-2019/5/10</p>
      </div>
    </div>
    <p class="tip">优惠券已经存入您的会员中心</p>
    <!-- 领取 -->
    <x-button class="button" @click.native="goRoute">查看优惠券</x-button>
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
    goRoute() {
      this.$router.push({ name: 'ticket' })
    }
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
    .number {
      font-size: 34px;
    }
  }
  .ticket-banner {
    width: 288px;
    height: 122px;
    background: url('../../../assets/images/ticket/u1520.png') no-repeat;
    background-size: 288px 122px;
    margin: 50px auto 20px;
    color: #fff;
    font-size: 13px;
    position: relative; 
    .box {
      position: absolute;
      top: 10px;
      left: 35px;
      text-align: left;
      .line-1 {
        font-size: 20px;
      }
      .number {
        font-size: 28px;
      }
    }
  }
  .tip {
    font-size: 14px;
    color: #333;
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
