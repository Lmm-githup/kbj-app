<template>
  <div class="relation-list-item">
    <div class="title">
      <div class="left">
        <img :src="ImgGiftFail" class="gift" alt="">
        <slot name="name"></slot>
        <!-- <span>山东阿胶特价促销</span> -->
      </div>
      <div class="right">
        <slot name="status"></slot>
        <!--<img :src="ImgArrow" class="arrow" alt="">-->
      </div>
    </div>
    <div class="info">
      <slot name="content"></slot>
    </div>
    <div class="fail-flag" v-if="showLogo">
      <!--<img :src="ImgFailFlag" class="flag-img" alt="">-->
    </div>
  </div>
</template>

<script>
import ImgGiftFail from '@/assets/images/relation/u1006.png'
import ImgArrow from '@/assets/images/relation/u938.png'
import ImgFailFlag from '@/assets/images/relation/u3058.png'
export default {
  data() {
    return {
      ImgGiftFail,
			ImgArrow,
			ImgFailFlag
    }
  },
  props: {
    showLogo: false
  }
}
</script>

<style lang="less" scoped>
.relation-list-item {
  background-color: #fff;
  margin-top: 10px;
  position: relative;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #dfdfdf;
    font-size: 14px;
    .left,
    .right {
      display: flex;
      align-items: center;
    }
    .gift {
      width: 12px;
      height: 12px;
      margin-right: 10px;
    }
    .arrow {
      width: 6px;
      height: 11px;
      margin-left: 10px;
    }
    .text-warning {
      color: #FF9933;
    }
  }
  .info {
    color: #5C5C5C;
    font-size: 12px;
    padding: 10px;
    >div {
      &:not(:first-child) {
        margin-top: 5px;
      }
    }
  }
  .fail-flag {
    position: absolute;
    top: 35px;
    right: 20px;
    .flag-img {
      width: 64px;
      height: 64px;
    }
  }
}
</style>
