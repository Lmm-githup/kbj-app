<template>
  <div class="container">
    <x-header :left-options="{showBack: true,backText: ''}" class="header">
      我的名片
    </x-header>
    <div class="top">
      <div class="info">
        <div class="name">李淼</div>
        <div class="company">北京网络有限公司</div>
      </div>
    </div>
    <div class="bottom">
      <img :src="QRcode" class="qrcode" alt="">
    </div>
  </div>
</template>

<script>
import QRcode from '@/assets/images/console/u1932.png';
import { XHeader } from "vux";
export default {
  components: {
    XHeader
  },
  data(){
    return {
      QRcode
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .top {
    width: 100%;
    height: 282px;
    background: url('../../assets/images/console/u1928.png') no-repeat;
    background-position: 50% 100%;
    background-size: 214px 214px;
    background-color: #5077aa;
    display: flex;
    align-items: flex-end;
    .info {
      font-size: 18px;
      color: #fff;
      padding: 20px;
      .name {
        font-weight: 700;
        margin-bottom: 15px;
      }
    }
  }
  .bottom {
    padding: 50px 0;
    text-align: center;
    .qrcode {
      width: 119px;
      height: 122px;
    }
  }
}
</style>
