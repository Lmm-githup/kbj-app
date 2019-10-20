<template>
  <div class="ticket-container">
    <x-header :left-options="{showBack: true,backText: ''}"></x-header>
    <h3 class="title">您的康佰家专属健康顾问</h3>
    <h3 class="title">李坤给您分享一张</h3>
    <!-- 优惠券 -->
    <div class="ticket-banner">
      <div class="box">
        <span class="number">8</span> 折优惠券
      </div>
    </div>
    <!-- 领取 -->
    <x-button class="button" @click.native="submit">领取优惠券</x-button>
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
    submit() {
      this.$router.push({ name: 'ticketGetSuccess' })
      // this.$router.push({ name: 'ticketGetError' })
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
  }
  .ticket-banner {
    width: 262px;
    height: 199px;
    background: url('../../../assets/images/ticket/u1494.png') no-repeat;
    background-size: 262px 199px;
    margin: 40px auto;
    color: #fff;
    font-size: 20px;
    position: relative;
    .box {
      position: absolute;
      top: 85px;
      left: 75px;
    }
    .number {
      font-size: 34px;
    }
  }
  .button {
    width: 66.6%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    background: #f59715;
    font-size: 14px;
    margin: 0 auto;
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
