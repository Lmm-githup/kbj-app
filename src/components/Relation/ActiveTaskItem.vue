<template>
  <div class="relation-list-item">
    <div class="title">
      <div class="left">
        <img :src="ImgGift" class="gift" alt="">
        <!-- <span>维系标题</span> -->
        <slot name="name"></slot>
      </div>
      <div class="right">
        <slot name="status"></slot>
        <!-- <span class="text-warning">进行中</span> -->
        <!--<img :src="ImgArrow" class="arrow" alt="">-->
      </div>
    </div>
    <div class="info">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import ImgGift from '@/assets/images/relation/u947.png'
import ImgArrow from '@/assets/images/relation/u938.png'
export default {
  data() {
    return {
      ImgGift,
			ImgArrow,
    }
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
}
</style>
