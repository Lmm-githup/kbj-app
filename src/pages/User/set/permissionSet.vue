<template>
  <div style="height:100%">
    <view-box class="position-index" body-padding-top="40px">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">职位/权限设置</x-header>
    <group>
      <cell
        v-for="(item, index) in positionList"
        :key="index"
        border-intent
        inline-desc
        is-link
        @click.native="selectOrg(item)"
      >
        <span slot="title" class="title-solt">
          <img src="/src/assets/images/my-icon.png" alt>
          {{item.positionName}}
        </span>
      </cell>
    </group>
    <infinite-loading @infinite="infiniteHandler" spinner="circles" :identifier="infiniteId">
      <no-data v-if="!positionList.length" slot="no-results"></no-data>
      <load-more v-else slot="no-results" :show-loading="false" tip="没有更多了"></load-more>
    </infinite-loading>
    <actionsheet v-model="show" :menus="menus" @on-click-menu="handleMenu" show-cancel></actionsheet>
    <div v-transfer-dom>
      <confirm
        ref="dialog"
        v-model="dialogShow"
        show-input
        hide-on-blur
        title="职位名称"
        @on-cancel="onCancelDialog"
        @on-confirm="onConfirmDialog"
        @on-show="onShowDialog"
      ></confirm>
    </div>
  </view-box>
  </div>
</template>

<script>
import {
  XHeader,
  Cell,
  Group,
  TransferDomDirective as TransferDom,
  Actionsheet,
  Confirm,
  LoadMore,
  ViewBox
} from "vux";
import { getPositionList, updatePositionType } from "@/api/user";
import InfiniteLoading from "vue-infinite-loading";
import NoData from "@/components/common/NoData";
export default {
  name: "orgList",
  components: {
    XHeader,
    Cell,
    Group,
    Actionsheet,
    Confirm,
    LoadMore,
    InfiniteLoading,
    NoData,
    ViewBox
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      positionList: [],
      show: false,
      dialogShow: false,
      menus: [
        {
          label: "权限设置"
        },
        {
          label: "修改"
        }
      ],
      selectItem: {},
      currentPage: 1,
      infiniteId: +new Date()
    };
  },
  methods: {
    onConfirmDialog(value) {
      updatePositionType({
        positionType: this.selectItem.positionType,
        positionTypeName: value
      }).then(res => {
        if (+res.code === 200) {
          this.$vux.toast.show({
            text: "修改成功",
            time: 1000,
            type: "text"
          });
          this.getData();
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    onCancelDialog() {},
    onShowDialog() {
      this.$refs.dialog.setInputValue(this.selectItem.positionTypeName);
    },
    handleMenu(key, item) {
      console.log(key, item);
      if (item.label == "权限设置") {
        this.$router.push({
          path: "/jurisdiction",
          query: {
            typeName: this.selectItem.positionTypeName,
            type: this.selectItem.positionType
          }
        });
      } else if (item.label == "修改") {
        this.dialogShow = true;
      }
    },
    selectOrg(val) {
      this.show = true;
      this.selectItem = val;
    },
    infiniteHandler($state) {
      getPositionList({ currentPage: this.currentPage }).then(res => {
        if (+res.code === 200) {
          let { list, paginator } = res.data;
          if (this.currentPage < paginator.totalPages) {
            this.currentPage++;
            this.positionList.push(...list);
            $state.loaded();
          } else {
            this.currentPage++;
            this.positionList.push(...list);
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
  mounted() {}
};
</script>

<style scoped lang="less">
.position-index {
  .title-solt {
    color: rgb(29, 69, 155);
    display: flex;
    align-items: center;
    color: #1d459b;
    font-size: 14px;
    > img {
      margin-right: 20px;
      width: 30px;
      height: 30px;
    }
  }
  .decs-solt {
    font-size: 12px;
    color: #5c5c5c;
  }
}
</style>
