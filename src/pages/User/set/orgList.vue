<template>
  <div style="height:100%">
    <view-box body-padding-top="40px" class="org-index">
    <x-header slot="header" style="width:100%;position:fixed;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">{{type == 'setorg' ? '部门设置' : '部门选择'}}</x-header>
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
    <group>
      <cell border-intent v-for="(item, index) in list" :key="index" :title="item.orgName" is-link @click.native="selectOrg(item)"></cell>
    </group>
    <no-data v-if="!list.length" ></no-data>
     <actionsheet v-model="show" :menus="menus"  @on-click-menu="handleMenu" show-cancel></actionsheet>
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
import { getOrgList } from "@/api/user";
import NoData from "@/components/common/NoData";
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
      type: '',
      show: false,
      menus: [
        {
          label: '新建下级'
        },
        {
          label: '修改'
        },
        {
          label: '删除',
          type: 'warn'
        }
      ],
      selectItem: {}
    };
  },
  methods: {
    handleMenu(key, item) {
      console.log(key, item)
      if (item.label == '新建下级') {
        this.$router.push({
          path: "/addOrg",
          query: {
            rowNo: this.selectItem.rowNo,
            orgName: this.selectItem.orgName
          }
        });
      }
    },
    selectOrg(val) {
      if ( this.type == 'setorg') {
        this.show = true
        this.selectItem = val
      } else {
        this.$store.commit('ADD_ORG', {
          orgNoName: val.orgName,
          orgNo: val.rowNo
        })
        this.$router.go(-1)
      }
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
    // getData() {
    //   getOrgList().then(res => {
    //     if (+res.code === 200) {
    //       this.orgList = res.data.list
    //     } else {
    //       this.$vux.toast.show({
    //         text: res.msg,
    //         time: 2000,
    //         type: "text"
    //       });
    //     }
    //   });
    // }
  },
  mounted() {
    this.type = this.$route.query.type || ''
    this.getSearchData();
    this.infiniteHandler();
  }
};
</script>

<style scoped lang="less">
.org-index {
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
