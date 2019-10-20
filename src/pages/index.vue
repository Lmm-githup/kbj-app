<template>
  <div class="main-index" style="height: 100%;">
    <!-- 内容 -->
    <router-view></router-view>
    <!-- 底部菜单 -->
    <home-tabbar></home-tabbar>
  </div>
</template>

<script>
import HomeTabbar from './homeTabbar'
export default {
  name: "index",
  components: {
    HomeTabbar
  },
  data() {
    return {
      tabbarIndex: 2
    };
  },
  methods: {
    handleTab(val) {
      this.tabbarIndex = val;
    }
  }
};
</script>

<style scoped lang="less">
@import "../assets/common/default.less";
.main-index {
  color: @theme-color;
  font-size: 14px;
}
</style>
