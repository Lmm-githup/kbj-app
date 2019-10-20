<template>
  <div id="app" style="height: 100%;">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "~vux/src/styles/1px.less";

body {
  font-family: "Microsoft YaHei";
  background-color: #f8f8f8;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  font-size: 14px !important;
}
.vux-header {
  background: #fff !important;
}
#vux_view_box_body {
  padding-top: 44px !important;
  height: 100% !important;
  .vux-header {
    width: 100% !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    right: 0!important;
    z-index: 100 !important;
  }
}
.vux-header-title-area,
.vux-header .vux-header-title {
  color: #101010 !important;
}
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i,
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #037de0 !important;
}
.weui-tabbar {
  background: #fff !important;
}
.editPassword-index .weui-cells {
  background-color: transparent !important;
}
.editPassword-index .weui-cell {
  padding: 0.4rem !important;
}
.editPassword-index .weui-input,
.weui-textarea,
.weui-input::placeholder {
  font-size: 15px !important;
  display: block !important;
}
.editPassword-index .weui-cells:before {
  border-top: none !important;
}
.editPassword-index .weui-cell:before {
  left: 0 !important;
}
.vux-label-desc {
  font-size: 12px !important;
  color: #999 !important;
}
.weui-cells {
  font-size: 16px !important;
}
.baseinfo-container .vux-cell-value {
  font-size: 12px;
}
.weui-dialog__btn_primary {
  color: #037de0 !important;
}
</style>
