<template>
  <div style="height:100%;">
    <view-box body-padding-top="50px">
    <x-header
    slot="header"
      :left-options="{showBack: true,backText: ''}"
      class="header"
      style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    >会员消息提醒</x-header>

    <div class="container">
      <group>
        <cell v-for="(item, index) in list" :key="index" @click.native="goChat(item.chat_h5page)">
          <template slot="icon">
            <img class="imgs" :src="item.headimgurl? item.headimgurl : noImg" alt>
          </template>
          <template slot="title">
            <span style="margin-left:15px;margin-right:5px;">{{item.membername}}</span>
          </template>
          <i style="color:red;" v-if="item.gunReadState == 1" class="fa fa-bell" aria-hidden="true"></i>
          <template slot="inline-desc">
            <span style="margin-left:15px;margin-right:5px;">{{item.lastDate | dateFormat}}</span>
          </template>
        </cell>
      </group>
      <infinite-loading @infinite="infiniteHandler" spinner="circles" :identifier="infiniteId">
        <no-data v-if="!list.length" :show-loading="false" slot="no-results"></no-data>
        <load-more v-else slot="no-results" :show-loading="false" tip="没有更多了"></load-more>
        <no-data v-if="!list.length" :show-loading="false" slot="no-more"></no-data>
        <load-more v-else slot="no-more" :show-loading="false" tip="没有更多了"></load-more>
      </infinite-loading>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="show" class="dialog-demo" :hide-on-blur="true" @on-hide="handleHide">
        <!-- <i class="fa fa-times close" aria-hidden="true" @click="show = false"></i> -->
        <van-icon  @click="show = false" class="close" name="cross" />
        <div class="content"  ref="content" style="width: 100%; height: 100%;background: #fff;"></div>
      </x-dialog>
    </div>
  </view-box>
  </div>
</template>

<script>
import Vue from "vue";
import InfiniteLoading from "vue-infinite-loading";
import NoData from "@/components/common/NoData";
import noImg from "@/assets/images/no-img.jpg";
import {
  XHeader,
  LoadMore,
  ViewBox,
  TransferDom,
  Group,
  Cell,
  XDialog
} from "vux";
import { getRemindList, confirmRemind, chatHistory } from "@/api/message";
import { Icon } from 'vant';

Vue.use(Icon);


export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    InfiniteLoading,
    LoadMore,
    ViewBox,
    NoData,
    Group,
    Cell,
    XDialog
  },
  data() {
    return {
      infiniteId: +new Date(),
      currentPage: 1,
      list: [],
      noImg,
      show: false
    };
  },
  watch: {},
  methods: {
    getIframe(link) {
      let myIframe = document.createElement("iframe");
      myIframe.setAttribute("src", link);
      myIframe.setAttribute("frameborder", 0);
      myIframe.setAttribute("height", "100%");
      myIframe.setAttribute("width", "100%");
      myIframe.setAttribute("scrolling", "no");
      myIframe.setAttribute("ref", "iframe");
      myIframe.style.width = 100 + "%";
      myIframe.style.overflowX = "hidden";
      myIframe.style.overflowY = "scroll";
      myIframe.style.webkitOverflowScrolling = "touch";

      this.$refs.content.appendChild(myIframe);
    },
    goChat(item) {
      console.log(item);
      this.show = true;
      this.$refs.content.innerHTML = "";
      this.getIframe(item);
      console.log(this.$refs.content);
      // window.location.href = item;
    },
    handleHide() {
      this.$refs.content.innerHTML = "";
    },
    infiniteHandler($state) {
      chatHistory({
        currentPage: this.currentPage,
        pageSize: 20
      }).then(res => {
        if (+res.code === 200) {
          if (res.data) {
            let { list, paginator } = res.data;
            if (this.currentPage < paginator.totalPages) {
              this.currentPage++;
              this.list.push(...list);
              $state.loaded();
            } else {
              this.currentPage++;
              this.list.push(...list);
              $state.complete();
            }
          } else {
            $state.complete();
          }
          
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    }
  },

  created() {}
};
</script>

<style lang="less" scoped>
.imgs {
  width: 50px;
  height: 50px;
  border-radius: 5px;
}
.badge-value {
  display: inline-block !important;
}
.vertical-middle {
  vertical-align: middle;
}
/deep/.dialog-demo {
  .weui-dialog {
    width: 100%;
    height: 100%;
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
</style>
