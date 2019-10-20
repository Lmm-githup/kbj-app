<template>
  <div class="nodata">
    <img src="/src/assets/images/empty.svg" alt>
    <div>暂无数据</div>
    <div class="slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "noData"
};
</script>

<style lang="less">
.nodata {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 20%; 
  > img {
    width: 35%;
  }
  > div {
    color: rgb(191, 191, 191);
  }
  .slot {
    margin-top: 20px;
  }
}
</style>
