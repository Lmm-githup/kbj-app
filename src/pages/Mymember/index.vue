<template>
  <div style="height:100%;">
    <view-box body-padding-top="46px" body-padding-bottom="55px">
    <x-header
    slot="header"
      title="slot:overwrite-title"
      :left-options="{showBack: false}"
      ref="myheader"
      style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    >
      <div class="mymember-title" slot="overwrite-title">
        <div class="search-bar" style="margin-right:4px;">
          <a style="display:block" @click="showSearch = true">
            <div class="search-bar__main">
              <i class="fa fa-vimeo-square" aria-hidden="true"></i>
              <p class="txt">会员指定条件查询</p>
            </div>
          </a>
        </div>
        <div class="search-bar" style="margin-left:4px;display:none;">
          <router-link :to="{name: 'addMember'}">
            <div class="search-bar__main" style="border-color:#aeaeae">
              <p class="txt" style="color:#333;">新增会员</p>
              <i
                class="fa fa-plus"
                aria-hidden="true"
                style="color:#037de0;-webkit-text-stroke: 1px #f2f2f2;"
              ></i>
            </div>
          </router-link>
        </div>
      </div>
      <div class="header-after" slot="right" style="color:#f8bb64;font-size:16px;">
        <p class="batch-task" @click="handleCheck" v-if="!isCheck">批量维系</p>
        <p class="batch-task" @click="isCheck = false" v-else>取消</p>
      </div>
    </x-header>
    <!-- undone -->
    <div class="container" :class="{pdb50: isCheck}">
      <mymember-item
        :list="List"
        :isCheck="isCheck"
        :checkList="checkList"
        @updateCheckList="updateCheckList"
      ></mymember-item>
      <infinite-loading @infinite="infiniteHandler" spinner="circles" :identifier="infiniteId">
        <load-more slot="no-more" :show-loading="false" :tip="'没有更多了'"></load-more>
        <no-data slot="no-results"></no-data>
      </infinite-loading>
    </div>
    <!-- footer -->
    <div class="footer" v-if="isCheck">
      <div>
        <van-checkbox v-model="checkedAll">全选</van-checkbox>
      </div>
      <a class="shift" @click="openAddTaskPop">批量维系</a>
    </div>
    <!-- task pop start -->
    <div v-transfer-dom>
      <popup v-model="addTaskPop" height="60%">
        <x-header :left-options="{showBack: false}" title="维系管理"></x-header>
        <tab
          v-model="addTaskType"
          prevent-default
          @on-before-index-change="switchTabItem"
          class="vux-1px-t"
          active-color="#037de0"
          bar-active-color="#037de0"
        >
          <tab-item>自定义维系任务</tab-item>
          <tab-item>新增维系任务</tab-item>
        </tab>
        <div class="pop-panel" v-if="addTaskType === 1">
          <group>
            <x-input
              title="维系任务名称"
              :min="2"
              :max="20"
              ref="relaName"
              v-model="newTaskInfo.relaName"
              placeholder="请输入名称"
            ></x-input>
            <calendar
              v-model="newTaskInfo.startDate"
              title="维系任务开始时间"
              show-popup-header
              popup-header-title="选择时间"
              disable-past
            ></calendar>
            <calendar
              v-model="newTaskInfo.endDate"
              title="维系任务结束时间"
              show-popup-header
              popup-header-title="选择时间"
              disable-past
            ></calendar>
          </group>
          <div class="pop-panel-foot">
            <div class="left">
              <x-button class="cancel-btn" plain @click.native="cancelAddTask">取消</x-button>
            </div>
            <div class="right">
              <x-button type="primary" class="confirm-btn" @click.native="submitNewTask">确定</x-button>
            </div>
          </div>
        </div>
        <p class="task-nodata" v-else style="font-size:24px;text-align:center;">点击上面标签
          <br>选择你要进行的操作
        </p>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="customizeTaskPop" height="calc(60% - 46px)">
        <popup-header
          left-text="取消"
          right-text="确定"
          title="选择现有的自定义维系任务"
          :show-bottom-border="false"
          @on-click-left="customizeTaskPop = false;addTaskType = -1"
          @on-click-right="chooseTask"
        ></popup-header>
        <group gutter="0" v-if="taskList.length > 0">
          <radio :options="taskList" v-model="taskId"></radio>
        </group>
        <p class="nodata" v-else>暂无数据</p>
      </popup>
    </div>
    <!-- task pop end -->
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
            <div class="inquire-tips">【活跃会员】：≤30天；
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
  Tab,
  TabItem,
  Popup,
  Group,
  Radio,
  Cell,
  Selector,
  XInput,
  Datetime,
  XButton,
  Calendar,
  TransferDom
} from "vux";

import { Checkbox, CheckboxGroup, Field } from "vant";

Vue.use(Checkbox)
  .use(CheckboxGroup)
  .use(Field);

import Vue from "vue";
import InfiniteLoading from "vue-infinite-loading";
import MymemberItem from "@/components/Mymember/MymemberItem";
import NoData from "@/components/common/NoData";

import { mapState, mapActions } from "vuex";

import {
  getList,
  getGuideCustomTask,
  addMemberToTask,
  addTask
} from "@/api/mymember";

export default {
  name: "Mymember",
  directives: {
    TransferDom
  },
  components: {
    ViewBox,
    XHeader,
    LoadMore,
    PopupHeader,
    Tab,
    TabItem,
    Popup,
    Group,
    Radio,
    Cell,
    Selector,
    XInput,
    Datetime,
    XButton,
    Calendar,
    TransferDom,
    InfiniteLoading,
    MymemberItem,
    NoData
  },
  data() {
    return {
      showSearch: false,
      top: 0,
      pageSize: 10,
      currentPage: 1,
      List: [],
      hasMore: true,
      infiniteId: +new Date(),
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
        productTypeCode: "",
        memberIntegralBegin: "",
        memberIntegralEnd: "",
        prodCode: "",
        lastOrderStartTime: "",
        lastOrderEndTime: "",
        medicareMoneyBegin: "",
        medicareMoneyEnd: ""
      },
      params: {},
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
      },
      isCheck: false,
      checkedAll: false,
      checkList: [],
      addTaskPop: false,
      addTaskType: -1,
      customizeTaskPop: false,
      taskList: [],
      taskId: "",
      newTaskInfo: {
        custNo: "",
        relaName: "",
        startDate: "TODAY",
        endDate: "TODAY",
        customerRelaServiceDtoList: []
      }
    };
  },
  computed: {},
  watch: {
    checkedAll: function(newVal) {
      console.log(newVal);
      this.checkList = [];
      if (newVal) {
        this.List.forEach((item, index) => {
          this.checkList.push(index);
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getHeaderHight();
  },
  methods: {
    ...mapActions(["CLEAR_EDITMEMBER"]),
    infiniteHandler($state) {
      getList({
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        viewType: "my",
        ...this.params
      }).then(res => {
        if (res.code === 200) {
          let { list, paginator } = res.data;
          let newList = this.listInit(list);
          list.forEach(v => {
            v.isCheck = true;
          });
          if (this.currentPage < paginator.totalPages) {
            this.hasMore = true;
            this.currentPage++;
            this.List.push(...list);
            $state.loaded();
          } else {
            this.hasMore = false;
            this.currentPage++;
            this.List.push(...list);
            if (
              paginator.totalCounts <= paginator.pageSize &&
              paginator.totalCounts > 0
            ) {
              $state.loaded();
            }
            $state.complete();
          }
        } else {
          this.hasMore = false;
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
        return;
      }
      const fromData = this.fromData;
      this.currentPage = 1;
      this.List = [];
      for (const key in fromData) {
        if (fromData[key] !== "") {
          this.$set(this.params, key, fromData[key]);
        }
      }
      this.infiniteId += 1;
      this.showSearch = false;
    },
    restFrom() {
      this.currentPage = 1;
      this.List = [];
      this.params = {};
      for (const key in this.fromData) {
        this.$set(this.fromData, key, "");
      }
      this.showSearch = false;
      this.infiniteId += 1;
    },
    listInit(list) {
      list.forEach(el => {
        return (el.newMemTag =
          el.memTag !== null && el.memTag !== "" ? el.memTag.split(" ") : []);
      });
      return list;
    },
    getHeaderHight() {
      this.CLEAR_EDITMEMBER();
      this.top = this.$refs.myheader.$el.clientHeight;
    },
    handleCheck() {
      this.isCheck = true;
    },
    updateCheckList(value) {
      console.log("TCL: updateCheckList -> updateCheckList", value);
      this.checkList = value;
    },
    async openAddTaskPop() {
      // 打开维系管理
      let { code, data } = await getGuideCustomTask({
        currentPage: 1,
        pageSize: 1000,
        type: 2,
        status: 0
      });
      if (code === 200 && data && data.list) {
        this.taskList = [];
        data.list.forEach(el => {
          this.taskList.push({
            key: el.relaId,
            value: el.relaName
          });
        });
      }
      if (this.taskId || this.addTaskType === 0) {
        this.customizeTaskPop = true;
      }
      this.addTaskPop = true;
    },
    switchTabItem(e) {
      // 打开自定义维系 | 新增维系
      this.addTaskType = e;
      if (e === 0) {
        this.customizeTaskPop = true;
      }
    },
    async chooseTask() {
      if (this.taskId) {
        // 选择自定义维系
        let _customerRelaServiceDtoList = [];
        this.checkList.forEach(index => {
          let { custNo } = this.List[index];
          _customerRelaServiceDtoList.push({ custNo });
        });
        let { code, data } = await addMemberToTask({
          customerRelaServiceDtoList: _customerRelaServiceDtoList,
          relationId: this.taskId
        });
        code === 200
          ? (this.$vux.toast.show({
              time: 1500,
              text: data.message
            }),
            (this.addTaskPop = false))
          : "";
      }
      this.customizeTaskPop = false;
    },
    async submitNewTask() {
      // 提交新增自定义维系任务
      if (!this.$refs.relaName.valid || !this.newTaskInfo.relaName) {
        this.$vux.toast.text("请填写任务名称", "bottom");
        return;
      }
      let start = new Date(this.newTaskInfo.startDate);
      let end = new Date(this.newTaskInfo.endDate);
      if (start.getTime() > end.getTime()) {
        if (this.newTaskInfo.endDate) {
          this.newTaskInfo.startDate = this.newTaskInfo.endDate;
          this.$vux.toast.text("请检查时间区间", "bottom");
          return;
        }
      }

      let _customerRelaServiceDtoList = [];
      this.checkList.forEach(index => {
        let { custNo, memberName, birthday, mobile, sex } = this.List[index];
        let customerRelaServiceDtoListItem = {
          memberName,
          custNo,
          status: "待维系"
        };
        !!birthday ? (customerRelaServiceDtoListItem.birthday = birthday) : "";
        !!mobile ? (customerRelaServiceDtoListItem.mobile = mobile) : "";
        !!sex ? (customerRelaServiceDtoListItem.sex = sex) : "";
        _customerRelaServiceDtoList.push(customerRelaServiceDtoListItem);
      });

      this.newTaskInfo.customerRelaServiceDtoList = _customerRelaServiceDtoList;
      
      let { code, data } = await addTask({ ...this.newTaskInfo });
      if (code === 200) {
        this.$vux.toast.text(data.message);
        this.cancelAddTask();
      }
    },
    cancelAddTask() {
      // 取消新增
      this.addTaskPop = false;
      this.addTaskType = -1;
      this.newTaskInfo.custNo = "";
      this.newTaskInfo.relaName = "";
      this.newTaskInfo.startDate = "TODAY";
      this.newTaskInfo.endDate = "TODAY";
      this.newTaskInfo.customerRelaServiceDtoList = [];
    },
  }
};
</script>
<style lang="less" scoped>
.batch-task {
  font-size: 12px;
  color:rgba(0,202,172,1)
}

.pdb50 {
  padding-bottom: 50px;
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
      border: 1px solid rgba(0,202,172,1);
      border-radius: 30px;
      background-color: #f2f2f2;
      box-sizing: border-box;
      & > .txt {
        color: rgba(0,202,172,1);
        font-size: 12px;
      }
      & > .fa {
        margin-right: 4px;
        margin-left: 4px;
        color: rgba(0,202,175,1);
        -webkit-text-stroke: 1px rgba(0,202,175,1);
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
    padding-top: 0;
    padding-bottom: 0;
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
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}
.vux-popup-header {
  font-size: 18px;
}

.inquire-item {
  font-size: 14px;
  /deep/ .weui-cells {
    font-size: 14px !important;
    margin-top: 0;
  }
}

.footer {
  position: fixed;
  bottom: 8vh;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 100;
  border-top: 1px solid #eee;
  padding: 10px 20px;
  box-shadow: 0 -2px 2px #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .shift {
    display: inline-block;
    border: 1px solid rgba(0,202,172,1);
    padding: 1px 20px;
    border-radius: 50px;
    color: rgba(0,202,172,1);
  }
}

.pop-panel-foot {
  margin-top: 20px;
  display: flex;
  .left {
    flex: 1;
    padding: 0 30px;
    text-align: center;
  }
  .right {
    flex: 1;
    padding: 0 30px;
    text-align: center;
  }
  .cancel-btn {
    margin-right: 15px;
  }
  .confirm-btn {
    margin-left: 15px;
  }
}
.task-nodata {
  font-size: 12px;
  color: #5c5c5c;
  text-align: center;
  margin: 42px;
}
//单选框的颜色
/deep/.van-checkbox__icon--checked .van-icon {
    color: #fff;
    border-color: rgba(0,202,175,1);
    background-color: rgba(0,202,175,1);
}
/deep/.vux-popup-header-right{
  color:rgba(0,202,172,1)
}
/deep/.weui-btn_primary{
  background:rgba(0,202,172,1)
}
</style>