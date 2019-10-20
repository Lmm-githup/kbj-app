<template>
  <div style="height:100%">
    <view-box  body-padding-top="40px">
    <x-header slot="header" :left-options="{showBack: true,backText: ''}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">{{'部门设置'}}</x-header>
    <group class="filter-box second-row">
      <!-- 大区 -->
      <popup-radio :options="region.options" v-model="region.value">
        <template slot-scope="props" slot="each-item">
          <p>{{ props.label }}</p>
        </template>
      </popup-radio>
      <!-- 片区 -->
      <popup-radio :options="area.options" v-model="area.value">
        <template slot-scope="props" slot="each-item">
          <p>{{ props.label }}</p>
        </template>
      </popup-radio>
    </group>
    <actionsheet v-model="show" :menus="menus" @on-click-menu="handleMenu" show-cancel></actionsheet>
    <div v-transfer-dom>
      <confirm
        v-model="deleteShow"
        title="操作提示"
        @on-cancel="deleteShow = false"
        @on-confirm="onConfirmDelete"
      >
        <p style="text-align:center;">{{ '确定要删除此部门吗?' }}</p>
      </confirm>
    </div>
    <group class="container">
      <cell
        border-intent
        v-for="(item, index) in list"
        :key="index"
        :title="item.orgName"
        is-link
        @click.native="selectOrg(item)"
      ></cell>
      <no-data v-if="!list.length" ></no-data>
      <!-- <infinite-loading @infinite="infiniteHandler" spinner="circles" :identifier="infiniteId">
        <no-data v-if="!list.length" slot="no-results"></no-data>
        <load-more
          v-else
          slot="no-results"
          :show-loading="false"
          tip="没有更多了"
          background-color="#fbf9fe"
        ></load-more>
      </infinite-loading>-->
    </group>
  </view-box>
  </div>
</template>

<script>
import {
  ViewBox,
  LoadMore,
  XHeader,
  Cell,
  Group,
  TransferDomDirective as TransferDom,
  Actionsheet,
  Confirm,
  CellBox,
  PopupRadio,
  Popup,
  Radio
} from "vux";
import { getOrgList, deleteOrg } from "@/api/user";
import NoData from "@/components/common/NoData";
import InfiniteLoading from "vue-infinite-loading";
export default {
  name: "orgList",
  components: {
    XHeader,
    Cell,
    Group,
    Actionsheet,
    Confirm,
    CellBox,
    PopupRadio,
    Popup,
    Radio,
    InfiniteLoading,
    NoData,
    LoadMore,
    ViewBox
  },
  directives: {
    TransferDom
  },
  watch: {
    "region.value"(newVal) {
      if (!newVal) {
        this.area.options = [{ key: "", value: "所有片区" }];
        return;
      }
      this.search.orgIntType = 2;
      this.search.parentRow = newVal;
      this.getSearchData();
      this.area.value = "片区";
      this.parentRow = newVal;
      this.orgIntType = 2;
      this.handleSelect();
    },
    "area.value"(newVal) {
      if (!newVal || newVal == "片区") {
        return;
      }
      this.store.value = "门店";
      this.search.parentRow = newVal;
      this.orgIntType = 3;
      this.handleSelect();
    }
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      orgIntType: 1,
      parentRow: "",
      search: {
        orgIntType: 1,
        parentRow: ""
      },
      searchList: [],
      region: {
        value: "大区",
        options: [{ key: "", value: "所有大区" }]
      },
      area: {
        value: "片区",
        options: [{ key: "", value: "所有片区" }]
      },
      store: {
        value: "门店",
        options: [{ key: "", value: "所有门店" }]
      },
       infiniteId: +new Date(),
      type: "",
      show: false,
      menus: [
        {
          label: "新建下级"
        },
        {
          label: "修改"
        },
        {
          label: "删除",
          type: "warn"
        }
      ],
      selectItem: {},
      deleteShow: false
    };
  },
  methods: {
    onConfirmDelete() {
      deleteOrg({ rowNo: this.selectItem.rowNo }).then(res => {
        if (+res.code === 200) {
          this.$vux.toast.show({
            text: "删除成功",
            time: 1000,
            type: "text"
          });
          this.handleSelect();
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    handleMenu(key, item) {
      console.log(key, item);
      if (item.label == "新建下级") {
        this.$router.push({
          path: "/addOrg",
          query: {
            rowNo: this.selectItem.rowNo,
            orgName: this.selectItem.orgName
          }
        });
      } else if (item.label == "修改") {
        this.$router.push({
          path: "/addOrg",
          query: {
            type: "edit",
            item: JSON.stringify(this.selectItem)
          }
        });
      } else if (item.label == "删除") {
        this.deleteShow = true;
      }
    },
    selectOrg(val) {
      this.show = true;
      this.selectItem = val;
    },
    handleSelect() {
      this.currentPage = 1;
      this.list = [];
      this.infiniteHandler();
    },

    infiniteHandler(flag, $state) {
      getOrgList({
        currentPage: this.currentPage,
        pageSize: 1000,
        orgIntType: this.orgIntType,
        parentRow: this.parentRow
      }).then(res => {
        if (+res.code === 200) {
          let { list, paginator } = res.data;
          this.list.push(...list);
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    getSearchData() {
      getOrgList({
        currentPage: 1,
        pageSize: 10000,
        orgIntType: this.search.orgIntType,
        parentRow: this.search.parentRow
      }).then(res => {
        if (+res.code === 200) {
          let { list, paginator } = res.data;
          list.forEach(v => {
            v.key = v.rowNo;
            v.value = v.orgName;
          });
          if (this.search.orgIntType == 1 && list.length) {
            this.region.options.push(...list);
          } else if (this.search.orgIntType == 2 && list.length) {
            this.area.options.push(...list);
          }
        }
      });
    }
  },
  mounted() {
    this.getSearchData();
    this.infiniteHandler();
  }
};
</script>

<style scoped lang="less">
.container {
  flex: 1;
  overflow: auto;
  margin-top: 20px;
  /deep/ .weui-cells {
    margin-top: 0;
  }
}

.filter-box {
  /deep/ .weui-cells {
    display: flex;
    align-items: center;
    font-size: 13px;
    .weui-cell {
      padding-left: 0;
      padding-right: 0;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      &::before {
        display: none;
      }
      .weui-cell__ft {
        width: 100%;
        text-align: center;
        top: 45%;
        right: 6px;
        &::after {
          transform: rotate(135deg);
        }
      }
    }
  }
}
</style>
