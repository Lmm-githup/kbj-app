<template>
  <div style="height:100%;">
    <view-box ref="viewBox" :class="{whitebg: $route.meta.pdt}" class="member-header">
      <x-header
        ref="xheader"
        slot="header"
        :class="{hasbg: showBg}"
        :left-options="{backText: ''}"
        :title="title"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;"
      >
        <div
          class="header-after"
          slot="right"
          v-if="$route.meta.showRight == 'addFamilyCard' && permission"
        >
          <router-link :to="{name: 'addFamilyCard'}">
            新增
            <i
              class="fa fa-plus"
              aria-hidden="true"
              style="color:#037de0;-webkit-text-stroke: 1px #fff;"
            ></i>
          </router-link>
        </div>
        <div
          class="header-after"
          slot="right"
          v-if="$route.meta.showRight == 'goChat' && isShowChat"
          @click="goChat"
        >
          <i
            class="fa fa-comments-o"
            style="color: #fff;font-size:20px;"
            aria-hidden="true"
          ></i>
        </div>
      </x-header>
      <!-- <div v-if="$route.meta.pdt" :style="{height: pdtNum + 'px'}"></div> -->
      <mymember-top :custNo="$route.params.custNo"></mymember-top>
      <transition :name="viewTransition" mode="out-in">
        <router-view/>
      </transition>
    </view-box>

     <div v-transfer-dom>
      <x-dialog v-model="show" class="dialog-demo" :hide-on-blur="true" @on-hide="handleHide">
        <!-- <i class="fa fa-times close" aria-hidden="true" @click="show = false"></i> -->
         <van-icon  @click="show = false" class="close" name="cross" />
        <div class="content" ref="content" style="width: 100%; height: 100vh;background: #fff;"></div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { ViewBox, XHeader, TransferDom, XDialog } from "vux";
import { mapState, mapActions } from "vuex";
import { USER_INFO } from "@/utils/storage";
import MymemberTop from "@/components/Mymember/Top";
import { Icon } from 'vant';

Vue.use(Icon);
export default {
  name: "Layout",
  components: { ViewBox, XHeader, MymemberTop, XDialog },
  data() {
    return {
      showBg: false,
      scrollBox: "",
      isShowChat: false,
      userInfo: {},
      show: false
    };
  },
  directives: {
    TransferDom
  },
  computed: {
    ...mapState({
      permission: state => state.mymember.permission,
      pdtNum: state => state.mymember.pdtNum,
      direction: state => state.mymember.direction,
      memberInfo: state => state.mymember.memberInfo
    }),
    viewTransition() {
      if (!this.direction) return "";
      return "vux-pop-" + (this.direction === "forward" ? "in" : "out");
    },
    title: function() {
      if (this.$route.name === "researchLog") {
        if (this.$route.params.flag == "0") {
          return "问卷列表";
        }
      }
      if (this.$route.name === "Article") {
        if (this.$route.params.type == "complaint") {
          return "反馈记录";
        }
      }
      if (this.$route.name === "researchDetail") {
        return this.$route.params.title;
      }
      return this.$route.meta.title;
    }
  },
  watch: {
    memberInfo: {
      handler: function(val) {
        if (val) {
          console.log(
            this.$utils.getLocalData(USER_INFO, true).userCrmId,
            val.userNo
          );
          if (
            this.$utils.getLocalData(USER_INFO, true).userCrmId == val.userNo
          ) {
            this.isShowChat = true;
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.userInfo = this.$utils.getLocalData(USER_INFO, true);
    this.$nextTick(() => {
      this.SET_PDTNUM(this.$refs.xheader.$el.clientHeight);
      this.scrollBox = document.getElementById("vux_view_box_body");
      this.scrollBox.addEventListener("scroll", this.pageScroll);
    });
  },
  beforeDestroy() {
    this.scrollBox &&
      this.scrollBox.removeEventListener("scroll", this.pageScroll);
  },
  methods: {
    ...mapActions(["SET_PDTNUM"]),
    pageScroll() {
      this.$nextTick(() => {
        let _top = this.$refs.viewBox.getScrollTop();
        if (_top > 0) {
          this.showBg = true;
        } else {
          this.showBg = false;
        }
      });
    },
    handleHide() {
      this.$refs.content.innerHTML = "";
    },
    getIframe (link) {
      let myIframe = document.createElement( 'iframe');
      myIframe.setAttribute("src", link);
      myIframe.setAttribute("frameborder", 0)
      myIframe.setAttribute("height", '100%')
      myIframe.setAttribute("width", '100%')
      this.$refs.content.appendChild(myIframe)
    },
    goChat(item) {
     let url = `${process.env.chatURL}&guideId=${
        this.userInfo.userCrmId
      }&memberId=${this.memberInfo.custCrmId}`;
      // memberId 当前会员的custCrmId
      this.show = true
      this.$refs.content.innerHTML = ''
      this.getIframe(url)
      console.log(this.$refs.content)
      // window.location.href = item;
    }
  }
};
</script>
<style lang="less" scoped>
.dialog-demo {
  /deep/ .weui-dialog{
    width: 100%;
    max-width: 100%;
  }
  .close {
    position: absolute;
    right: 10px;
    top: 6px;
    font-size: 28px;
    color: #666;
    z-index: 6666;
  }
}
.member-header {
  /deep/ .vux-header {
    background-color: rgba(0,202,172,1) !important;
    transition: background-color 200ms;
    .vux-header-title {
      color: #fff !important;
    }
    .left-arrow:before {
      border-color: #fff;
    }
  }
  /deep/ .vux-header.hasbg {
    //background-color: #5077aa !important;滑动变颜色
    background-color:rgba(0,202,172,1) !important;
  }
  &.whitebg {
    /deep/ .vux-header {
      background-color: #fff !important;
      .vux-header-title {
        color: #101010 !important;
      }
      .left-arrow:before {
        border-color: #ccc;
      }
    }
  }
}
</style>