<template>
  <div class="main-index">
    <tabbar @on-index-change="handleTab">
      <tabbar-item v-if="messageTotal > 0" :badge="messageTotal" :selected="currentIndex == 0">
        <i slot="icon" class="fa fa-commenting-o" aria-hidden="true"></i>
        <span slot="label">提醒</span>
      </tabbar-item>
      <tabbar-item v-if="messageTotal == 0" :selected="currentIndex == 0">
        <i slot="icon" class="fa fa-commenting-o" aria-hidden="true"></i>
        <span slot="label">提醒</span>
      </tabbar-item>
      <tabbar-item :selected="currentIndex == 1">
        <i slot="icon" class="fa fa-address-card-o" aria-hidden="true"></i>
        <span slot="label">我的会员</span>
      </tabbar-item>
      <tabbar-item :selected="currentIndex == 2">
        <i slot="icon" class="fa fa-th-large" aria-hidden="true"></i>
        <span slot="label">工作台</span>
        <!--style="postion:relative" style="position:absolute;transform: translate(-50%,-50%);;font-size:1rem;"-->
      </tabbar-item>
      <tabbar-item :selected="currentIndex == 3">
        <i slot="icon" class="fa fa-bar-chart" aria-hidden="true"></i>
        <span slot="label">统计</span>
      </tabbar-item>
      <tabbar-item :selected="currentIndex == 4">
        <i slot="icon" class="fa fa-user-o" aria-hidden="true"></i>
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Icon } from "vux";
import { mapState, mapMutations, mapActions } from "vuex";
import { messageTotal } from "@/api/home";
import {
  MESSAGE_TOTAL,
  CURRENT_INDEX,
  USER_INFO,
  MESSAGE_FLAG
} from "@/utils/storage";
export default {
  name: "homeTabbar",
  components: {
    Tabbar,
    TabbarItem,
    Icon
  },
  data() {
    return {
      currentIndex: 2,
      messageTotal: "0",
      userInfo: {}
    };
  },
  created() {
    this.userInfo = this.$utils.getLocalData(USER_INFO, true);
    this.queryMessageTotal();
    this.currentIndex = this.$utils.getLocalData(CURRENT_INDEX) || 2;
  },
  methods: {
    ...mapActions(["QUERY_MSG"]),
    handleTab(i) {
      // this.UPDETE_TABBAR_INDEX(i)
      this.$utils.setLocalData(CURRENT_INDEX, i);
      switch (i) {
        case 0:
          this.$router.push({ path: "/Message" });
          break;
        case 1:
          this.$router.push({ path: "/Mymember" });
          break;
        case 2:
          this.$router.push({ path: "/HomePage" });
          break;
        case 3:
          this.$router.push({ path: "/Statistics" });
          break;
        case 4:
          this.$router.push({ path: "/User" });
          break;
        default:
          break;
      }
    },
    queryMessageTotal() {
      let flags = this.$utils.getLocalData(MESSAGE_FLAG)
      // console.log("1"+flags)
      if (!flags || flags == 'undefined') {
        flags = [1, 1, 1, 1, 1, 1, 1, 1];//消息里面有八条信息
        this.$utils.setLocalData(MESSAGE_FLAG, flags);
      } else {
        flags = this.$utils.getLocalData(MESSAGE_FLAG, true)
      }
      messageTotal({
        flags: flags
      }).then(res => {
        if (+res.code === 200) {
          this.$utils.setLocalData(MESSAGE_TOTAL, res.data.num);//把消息的个数存起来
          this.messageTotal = this.$utils.getLocalData(MESSAGE_TOTAL);
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "../assets/common/default.less";
.main-index {
  /deep/.weui-loading_toast{
    display: none!important;
  }
  color: @theme-color;
  font-size: 14px;
  /deep/ .weui-tabbar__item{
    height: 6vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 1vh;
    padding-top: 1vh;
  }
}
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i{
      color: rgba(0, 202, 172, 1) !important;
}
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label > span{
    color: rgba(0, 202, 172, 1) !important;
}
</style>
