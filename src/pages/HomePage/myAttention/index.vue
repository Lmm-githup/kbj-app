<template>
  <div style="height:100%">
    <view-box body-padding-bottom="55px" body-padding-top="42px">
    <x-header
    slot="header"
      title="slot:overwrite-title"
      ref="myheader"
      :left-options="{showBack: true,backText: ''}"
      style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    >
      <div class="overwrite-title-demo" slot="overwrite-title">
        <button-tab v-model="headerTab">
          <button-tab-item @on-item-click="handleTab">关注会员动态</button-tab-item>
          <button-tab-item @on-item-click="handleTab">所有关注会员</button-tab-item>
        </button-tab>
      </div>
      <a style="display:block" class="header-after" slot="right" @click="showSearch = true">
        <i class="fa fa-search" style="font-size:20px;" aria-hidden="true"></i>
      </a>
    </x-header>
    <!-- <x-header
      title="slot:overwrite-title"
      :left-options="{showBack: false}"
      ref="myheader"
      style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    >
      <div class="mymember-title" slot="overwrite-title">
        <div class="search-bar">
          <div @click="showSearch = true">
            <div class="search-bar__main">
              <p class="txt">查询会员</p>
              <i class="fa fa-search" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div class="search-bar">
          <router-link :to="{name: 'addMember'}">
            <div class="search-bar__main">
              <p class="txt">新增会员</p>
              <i class="fa fa-plus" aria-hidden="true" style="color:#037de0"></i>
            </div>
          </router-link>
        </div>
      </div>
      <div class="header-after" slot="right"></div>
    </x-header>-->
    <!-- undone -->
    <div class="container" v-if="headerTab == 1">
      <mymember-item :list="List" :isAttention="true"></mymember-item>

      <infinite-loading @infinite="infiniteHandler" spinner="circles" :identifier="infiniteId">
        <no-data v-if="!List.length" slot="no-results"></no-data>
        <load-more v-else slot="no-results" :show-loading="false"  tip="没有更多了"></load-more>
        <no-data v-if="!List.length" slot="no-more"></no-data>
        <load-more v-else slot="no-more" :show-loading="false"  tip="没有更多了"></load-more>
      </infinite-loading>
    </div>
    <div class="container" v-if="headerTab == 0">
      <myattention-item :list="attentionList"></myattention-item>
      <infinite-loading @infinite="infiniteHandler1" spinner="circles" :identifier="infiniteId1">
        <no-data v-if="!attentionList.length" slot="no-results"></no-data>
        <load-more v-else slot="no-results" :show-loading="false" tip="没有更多了"></load-more>
        <no-data v-if="!attentionList.length" slot="no-more"></no-data>
        <load-more v-else slot="no-more" :show-loading="false" tip="没有更多了"></load-more>
      </infinite-loading>
    </div>
    <div v-transfer-dom>
      <popup v-model="showSearch" height="100%">
        <popup-header
          left-text="取消"
          right-text="清空"
          title="查询客户"
          :show-bottom-border="false"
          @on-click-left="showSearch = false"
          @on-click-right="restFrom"
        ></popup-header>
        <div class="inquire">
          <group class="inquire-item vux-1px-b">
            <x-input title="关联导购" v-model="fromData.userName" placeholder="请输入关联导购信息"></x-input>
            <selector
              title="可选排序"
              :options="orderList"
              v-model="fromData.orderByStr"
              placeholder="请选择排序项"
            ></selector>
            <selector title="会员状态：" :options="statusList" v-model="fromData.strStatus"></selector>
            <div class="inquire-tips">
              【活跃会员】：≤30天；
              <br>【次活跃会员】：31至60天；
              <br>【沉默会员】：61至120天；
              <br>【休眠会员】：121至180天；
              <br>【预流失会员】：181至365天；
              <br>【已流失会员】：>365天。
            </div>
            <cell title="会员积分：">
              <div class="inquire-input-group">
                <van-field type="number" placeholder="min" v-model="fromData.memberIntegralBegin"></van-field>
                <span class="line"></span>
                <van-field type="number" placeholder="max" v-model="fromData.memberIntegralEnd"></van-field>
                <span class="unit">分</span>
              </div>
            </cell>
            <x-input
              title="商品类别查询"
              ref="productTypeCode"
              v-model="fromData.productTypeCode"
              :min="2"
              :max="6"
              :is-type="validNumber"
              placeholder="请输入正确的数据格式"
            ></x-input>
          </group>
          <group class="inquire-item vux-1px-b" title="类别支持大类:01;中类:0101;小类:010101;数字格式查询">
            <cell title="商品：">
              <van-field type="number" placeholder="请输入商品" v-model="fromData.prodCode"></van-field>
            </cell>
            <datetime title="最近消费开始时间：" v-model="fromData.lastOrderStartTime"></datetime>
            <datetime title="最近消费结束时间：" v-model="fromData.lastOrderEndTime"></datetime>
            <cell title="医保余额：">
              <div class="inquire-input-group">
                <van-field type="number" placeholder="min" v-model="fromData.medicareMoneyBegin"></van-field>
                <span class="line"></span>
                <van-field type="number" placeholder="max" v-model="fromData.medicareMoneyEnd"></van-field>
                <span class="unit">元</span>
              </div>
            </cell>
          </group>
          <div class="submit-bar">
            <x-button type="primary" @click.native="getList">确认</x-button>
          </div>
        </div>
      </popup>
    </div>
  </view-box>
  </div>
</template>

<script>
import {
  ViewBox,
  XHeader,
  LoadMore,
  PopupHeader,
  Popup,
  Group,
  Cell,
  Selector,
  XInput,
  Datetime,
  XButton,
  TransferDom,
  ButtonTab,
  ButtonTabItem
} from "vux";
import InfiniteLoading from "vue-infinite-loading";
import MymemberItem from "@/components/Mymember/MymemberItem";
import MyattentionItem from "@/components/myAttention/ListItem";

import { mapState, mapActions } from "vuex";
import Vue from "vue";  
import { Field } from "vant";
Vue.use(Field);

import { getList } from "@/api/mymember";

import { attentionList } from "@/api/myAttention";
import NoData from "@/components/common/NoData";

export default {
  name: "myAttention",
  directives: {
    TransferDom
  },
  components: {
    ViewBox,
    XHeader,
    LoadMore,
    PopupHeader,
    Popup,
    Group,
    Cell,
    Selector,
    XInput,
    Datetime,
    XButton,
    TransferDom,
    InfiniteLoading,
    MymemberItem,
    ButtonTab,
    ButtonTabItem,
    MyattentionItem,
    NoData
  },
  data() {
    return {
      showSearch: false,
      top: 0,
      pageSize: 10,
      currentPage: 1,
      currentPage1: 1,
      List: [],
      attentionList: [],
      hasMore: true,
      hasMore1: true,
      infiniteId: +new Date(),
      infiniteId1: +new Date(),
      statusList: [
        "活跃",
        "次活跃",
        "沉默",
        "休眠",
        "预流失会员",
        "已流失会员",
        "冻结"
      ],
      orderList: [
        { key: "CON_POINTS", value: "可用积分" },
        { key: "CON_DT", value: "最近消费时间" },
        { key: "MEDICARE_MONEY", value: "医保卡余额" }
      ],
      fromData: {
        userName: "",
        orderByStr: "",
        strStatus: "",
        memberIntegralBegin: "",
        memberIntegralEnd: "",
        prodCode: "",
        lastOrderStartTime: "",
        lastOrderEndTime: "",
        medicareMoneyBegin: "",
        medicareMoneyEnd: ""
      },
      params: {},
      params1: {},
      headerTab: 0,
      validNumber: function(val) {
        const reslut = {
          valid: false,
          msg: "请输入正确格式的数据"
        };
        if (val.length == 2) {
          reslut.valid = /^\d{2}$/.test(val);
        }
        if (val.length == 4) {
          reslut.valid = /^\d{4}$/.test(val);
        }
        if (val.length == 6) {
          reslut.valid = /^\d{6}$/.test(val);
        }
        return reslut;
      }
    };
  },
  computed: {},
  watch: {
    headerTab(nVal) {
      console.log(nVal);
      const fromData = this.fromData;
      if (nVal == 1) {
        this.currentPage = 1;
        this.List = [];
        for (const key in fromData) {
          if (fromData[key] !== "") {
            this.$set(this.params, key, fromData[key]);
          }
        }
        this.infiniteId += 1;
        // this.infiniteHandler();
      } else if (nVal == 0) {
        this.currentPage1 = 1;
        this.attentionList = [];
        for (const key in fromData) {
          if (fromData[key] !== "") {
            this.$set(this.params1, key, fromData[key]);
          }
        }
        this.infiniteId1 += 1;
        this.infiniteHandler1();
      }
    }
  },
  created() {},
  mounted() {
    this.getHeaderHight();
  },
  methods: {
    handleTab(i) {
      // if (i === 0) {
      //   this.restFrom()
      //   this.infiniteHandler()
      // } else if (i === 1) {
      //   this.restFrom1()
      //   this.infiniteHandler1()
      // }
    },
    infiniteHandler($state) {
      getList({
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        viewType: "my",
        emphasis: "Y",
        ...this.params
      }).then(res => {
        let { list, paginator } = res.data;
        if (this.currentPage <= paginator.totalPages) {
          this.hasMore = true;
          this.currentPage++;
          this.List.push(...list);
          $state.loaded();
        } else {
          this.hasMore = false;
          this.currentPage++;
          this.List.push(...list);
          $state.complete();
        }
      });
    },
    infiniteHandler1($state) {
      this.params1.emphasis = "Y";
      attentionList({
        pageSize: this.pageSize,
        currentPage: this.currentPage1,
        ...this.params1
      }).then(res => {
        let { list, paginator } = res.data;
        if (this.currentPage1 <= paginator.totalPages) {
          this.hasMore1 = true;
          this.currentPage1++;
          this.attentionList.push(...list);
          $state.loaded();
        } else {
          this.hasMore1 = false;
          this.currentPage1++;
          this.attentionList.push(...list);
          $state.complete();
        }
      });
    },
    getList() {
      if (!this.$refs.productTypeCode.valid) {
        this.$vux.toast.show({
          width: "10em",
          text: "商品类别格式错误",
          type: "warn"
        });
        return
      }
      const fromData = this.fromData;
      if (this.headerTab == 0) {
        this.currentPage1 = 1;
        this.attentionList = [];
        for (const key in fromData) {
          if (fromData[key] !== "") {
            this.$set(this.params1, key, fromData[key]);
          }
        }
        this.infiniteId1 += 1;
      } else {
        this.currentPage = 1;
        this.List = [];
        for (const key in fromData) {
          if (fromData[key] !== "") {
            this.$set(this.params, key, fromData[key]);
          }
        }
        this.infiniteId += 1;
      }

      this.showSearch = false;
    },
    restFrom() {
      this.currentPage1 = 1;
      this.List = [];
      this.params = {};
      for (const key in this.fromData) {
        this.$set(this.fromData, key, "");
      }
      this.showSearch = false;
      this.infiniteId += 1;
    },
    restFrom1() {
      this.currentPage = 1;
      this.attentionList = [];
      this.params1 = {};
      for (const key in this.fromData) {
        this.$set(this.fromData, key, "");
      }
      this.showSearch = false;
      this.infiniteId1 += 1;
    },
    getHeaderHight() {
      this.top = this.$refs.myheader.$el.clientHeight;
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .vux-header-title-area {
  margin-left: 80px;
  margin-right: 80px;
}
.overwrite-title-demo {
  margin-top: 5px;
}
.mymember-title {
  display: flex;
  justify-content: space-between;
  .search-bar {
    flex: 1;
    height: 30px;
    margin-top: 5px;
    &__main {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 15px;
      height: 30px;
      border: 1px solid #ff9933;
      border-radius: 30px;
      background-color: #f2f2f2;
      box-sizing: border-box;
      & > .txt {
        color: #ff9933;
        font-size: 12px;
      }
      & > .fa {
        margin-right: 4px;
        margin-left: 4px;
        color: #ff9933;
        -webkit-text-stroke: 1px #ff9933;
      }
    }
  }
}

.inquire-tips {
  font-size: 12px;
  padding: 0 15px 10px 15px;
  color: #5c5c5c;
}
.inquire-input-group {
  display: flex;
  align-items: center;
  /deep/ .van-field {
    width: 100px;
    &::before {
      content: none;
    }
  }
  .line {
    width: 30px;
    height: 1px;
    background-color: #5c5c5c;
  }
}
.unit {
  font-size: 14px;
  color: #333;
}
.submit-bar {
  margin-top: 30px;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}
//头部导航
.vux-button-group > a.vux-button-group-current{
  background: rgba(0,202,172,1)
}
.vux-button-group > a{
  color:rgba(0,202,172,1)
}
.vux-button-group > a.vux-button-tab-item-first:after{
  border:1px solid rgba(0,202,172,1)
}
.vux-button-group > a.vux-button-tab-item-last:after{
    border-right: 0.02667rem solid rgba(0,202,172,1);
    border-top: 0.02667rem solid rgba(0,202,172,1);
    border-bottom: 0.02667rem solid rgba(0,202,172,1);
}
/deep/.vux-popup-header-right{
  color:rgba(0,202,172,1)
}
/deep/.weui-btn_primary{
  background:rgba(0,202,172,1)
}
</style>