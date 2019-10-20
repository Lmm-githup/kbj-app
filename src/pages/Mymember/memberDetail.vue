<template>
  <div>
    <div class="member-collect" v-if="memberInfo">
      <div class="member-collect__title">
        <p class="main">会员消费能力指标</p>
        <div class="after">
          <span class="above">
            <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
            高于水平
          </span>
          <span class="below">
            <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
            低于水平
          </span>
        </div>
      </div>
      <div class="member-collect__grid vux-1px-t">
        <div class="item vux-1px-r">
          <span class="name">消费平均单价</span>
          <span class="num below">
            ¥ {{memberInfo.unitPrice || 0}}
            <br>
            <i class="fa fa-thumbs-o-up" aria-hidden="true" v-if="memberInfo.unitPriceFlag === 1"></i>
            <i class="fa fa-thumbs-o-down" aria-hidden="true" v-else></i>
          </span>
        </div>
        <div class="item vux-1px-r">
          <span class="name">消费平均购件数</span>
          <span class="num below">
            {{memberInfo.memPiece || 0}}
            <br>
            <i class="fa fa-thumbs-o-up" aria-hidden="true" v-if="memberInfo.memPieceFlag === 1"></i>
            <i class="fa fa-thumbs-o-down" aria-hidden="true" v-else></i>
          </span>
        </div>
        <div class="item">
          <span class="name">消费平均客品数</span>
          <span class="num below">
            {{memberInfo.memProdPiece || 0}}
            <br>
            <i
              class="fa fa-thumbs-o-up"
              aria-hidden="true"
              v-if="memberInfo.averageDiscountFlag === 1"
            ></i>
            <i class="fa fa-thumbs-o-down" aria-hidden="true" v-else></i>
          </span>
        </div>
      </div>
      <div class="member-collect__grid vux-1px-t">
        <div class="item vux-1px-r">
          <span class="name">消费平均客单价</span>
          <span class="num below">
            {{memberInfo.unitProdPrice || 0}}
            <br>
            <i class="fa fa-thumbs-o-up" aria-hidden="true" v-if="memberInfo.totalAmountFlag === 1"></i>
            <i class="fa fa-thumbs-o-down" aria-hidden="true" v-else></i>
          </span>
        </div>
        <div class="item vux-1px-r">
          <span class="name">消费次数</span>
          <span class="num below">
            {{memberInfo.buyTimes || 0}}
            <br>
            <i class="fa fa-thumbs-o-up" aria-hidden="true" v-if="memberInfo.buyTimesFlag === 1"></i>
            <i class="fa fa-thumbs-o-down" aria-hidden="true" v-else></i>
          </span>
        </div>
        <div class="item">
          <span class="name">月平均消费次数</span>
          <span class="num below">
            {{memberInfo.buyTimesMonth}}
            <br>
            <i class="fa fa-thumbs-o-up" aria-hidden="true" v-if="memberInfo.lastOrderTime === 1"></i>
            <i class="fa fa-thumbs-o-down" aria-hidden="true" v-else></i>
          </span>
        </div>
      </div>
    </div>
    <!-- <div style="height:44px;margin-top:10px;">
      <sticky
        ref="sticky"
        scroll-box="vux_view_box_body"
        :offset="pdtNum"
        :check-sticky-support="false"
        :disabled="disabled"
    >-->
    <div class="member-tabs">
      <tab v-model="logType" prevent-default @on-before-index-change="switchLogTabItem">
        <!-- <tab-item>消费偏好</tab-item> -->
        <tab-item>购买记录</tab-item>
        <tab-item>维系记录</tab-item>
      </tab>
    </div>
    <!-- </sticky>
    </div>-->
    <div class="member-log">
      <div v-if="logType === 2" style="padding-top:10px;">
        <div class="member-charts-title">价格段</div>
        <v-chart prevent-render @on-render="renderVChartOne" ref="chartOne" id="chartOne"></v-chart>
        <div class="member-charts-title">折扣段</div>
        <v-chart prevent-render @on-render="renderVChartTwo" ref="chartTwo" id="chartTwo"></v-chart>
        <div class="member-charts-title">商品分类偏好</div>
        <v-chart prevent-render @on-render="renderVChartThree" ref="chartThree" id="chartThree"></v-chart>
        <div class="member-charts-title">购买时间偏好</div>
        <v-chart prevent-render @on-render="renderVChartFour" ref="chartFour" id="chartFour"></v-chart>
      </div>
      <div v-else-if="logType === 0" style="padding-top:10px;">
        <div class="order-item" v-for="(item, index) in memberOrderList" :key="index">
          <div class="order-item__head">
            <p class="title">{{item.storeName}}</p>
            <span class="tips">{{item.orderTime | dateFormat}}</span>
          </div>
          <div class="order-item__sub-head">小票号：{{item.orderNo}}</div>
          <div class="order-item__main">
            <div class="desc">
              <p
                class="order-item__detail"
                v-for="(detail,index) in item.orderDetailViewList"
                :key="index"
              >
                {{detail.productName + detail.productSpec + detail.productUnit}}
                <span
                  class="num"
                >X {{detail.productNum}}</span>
              </p>
            </div>
          </div>
        </div>
        <no-data v-show="memberOrderList.length === 0"></no-data>
      </div>
      <div v-else-if="logType === 1" style="padding-top:10px;">
        <div class="task-item" v-for="(item, index) in memberTaskList" :key="index">
          <div class="task-item__head vux-1px-b">{{item.relaName}}</div>
          <div class="task-item__main">
            <p>维系有效期：{{item.startDate | dateFormat('YYYY-MM-DD')}}~{{item.endDate | dateFormat('YYYY-MM-DD')}}</p>
            <p>维系类型：自定义维系</p>
          </div>
          <div class="task-item__foot" v-if="!item.taskStatus">
            <group class="handle">
              <x-switch
                title="已接听"
                prevent-default
                @on-click="changeTaskStatus('taskStatus', item, index)"
                class="item"
                :value="item.taskStatus === '已接听' ? true : false"
              ></x-switch>
            </group>
            <group class="handle">
              <x-switch
                title="未接听"
                prevent-default
                @on-click="changeTaskStatus('callFlag', item, index)"
                class="item"
                :value="item.callFlag === '未接听' ? true : false"
              ></x-switch>
            </group>
            <group class="handle">
              <x-switch
                title="流失"
                prevent-default
                @on-click="changeTaskStatus('taskResult', item, index)"
                class="item"
                :value="item.taskResult === '流失' ? true : false"
              ></x-switch>
            </group>
          </div>
        </div>
        <no-data v-show="memberTaskList.length === 0"></no-data>
      </div>
    </div>
    <div class="member-footer" :style="{bottom: 0}">
      <div class="member-footer__item">
        <a class="handle-btn" :href="'tel:' + memberInfo.mobile">
          <i class="fa fa-phone" aria-hidden="true"></i>
          <span>电话</span>
        </a>
      </div>
      <div class="member-footer__item">
        <a class="handle-btn" @click="editFollow(memberInfo.emphasis)">
          <i
            class="fa fa-heart"
            aria-hidden="true"
            :style="{color: memberInfo.emphasis && memberInfo.emphasis === 'Y' ? '#f3499c' : '#fff'}"
          ></i>
          <span>{{memberInfo.emphasis && memberInfo.emphasis === 'Y' ? '已关注' : '关注'}}</span>
        </a>
      </div>
      <div class="member-footer__item">
        <a class="handle-btn" @click="openAddTaskPop">
          <i class="fa fa-compress" aria-hidden="true"></i>
          <span>维系</span>
        </a>
      </div>
    </div>
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
        <p class="task-nodata" v-else style="font-size:16px;text-align:center;">点击上面标签
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
        <group gutter="0">
          <radio :options="taskList" @on-change="changeTask"></radio>
        </group>
      </popup>
    </div>
  </div>
</template>

<script>
import { USER_INFO } from "@/utils/storage";

import { mapState, mapActions } from "vuex";
import {
  getMemberInfo,
  getMemberOrder,
  getMemberTask,
  editFollow,
  getGuideCustomTask,
  addMemberToTask,
  addTask,
  editTaskStatus
} from "@/api/mymember";
import {
  Tab,
  TabItem,
  Sticky,
  VChart,
  VBar,
  XSwitch,
  Popup,
  XHeader,
  PopupHeader,
  Group,
  Radio,
  XInput,
  XButton,
  Calendar,
  TransferDomDirective as TransferDom
} from "vux";

import NoData from "@/components/common/NoData";

export default {
  name: "memberDetail",
  directives: {
    TransferDom
  },
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: {
    Tab,
    TabItem,
    Sticky,
    VChart,
    VBar,
    XSwitch,
    Popup,
    XHeader,
    PopupHeader,
    Group,
    Radio,
    XInput,
    XButton,
    Calendar,
    TransferDom,
    NoData
  },
  data() {
    return {
      userInfo: {},
      logType: 0,
      disabled:
        typeof navigator !== "undefined" &&
        /iphone/i.test(navigator.userAgent) &&
        /ucbrowser/i.test(navigator.userAgent),
      memberInfo: null,
      addTaskPop: false,
      addTaskType: -1,
      customizeTaskPop: false,
      currentId: 0,
      taskList: [],
      taskId: 0,
      newTaskInfo: {
        custNo: "",
        relaName: "",
        startDate: "TODAY",
        endDate: "TODAY",
        customerRelaServiceDtoList: []
      },
      priceData: [
        { key: "0-50", value: 20 },
        { key: "50-100", value: 80 },
        { key: "100-150", value: 60 },
        { key: "150-200", value: 40 },
        { key: "200-250", value: 100 }
      ],
      discountData: [
        { key: "0-10", value: 20 },
        { key: "10-20", value: 80 },
        { key: "20-30", value: 60 },
        { key: "30-40", value: 40 },
        { key: "40-50", value: 100 }
      ],
      catData: [
        { key: "糖尿病类", value: 20 },
        { key: "心脑血管类", value: 35 }
      ],
      timeData: [{ key: "10-12", value: 50 }, { key: "12-14", value: 94 }],
      memberOrderList: [],
      memberTaskList: []
    };
  },
  computed: {
    ...mapState({
      permission: state => state.mymember.permission,
      pdtNum: state => state.mymember.pdtNum
    })
  },
  watch: {},
  created() {},
  mounted() {
    this.userInfo = this.$utils.getLocalData(USER_INFO, true);
    this.getInfo();
    this.getMemberOrder();
  },
  filters: {
    toStatusText(status) {
      let statusText = "";
      switch (status) {
        case 1:
          statusText = "未处理";
          break;
        case 2:
          statusText = "待发货";
          break;
        case 3:
          statusText = "待收货";
          break;
        case 4:
          statusText = "已完成";
          break;
        case 5:
          statusText = "已退货";
          break;
        case 6:
          statusText = "已取消";
          break;

        default:
          break;
      }
      return statusText;
    }
  },
  beforeDestroy() {
    console.log("test");
  },
  methods: {
    ...mapActions(["SET_EDITMEMBER", "SET_PERMISSION"]),
    async getInfo() {
      let { data } = await getMemberInfo({ custNo: this.custNo });
      this.memberInfo = data;
      data.userNo == this.userInfo.userCrmId
        ? this.SET_PERMISSION(true)
        : this.SET_PERMISSION(false);
      this.SET_EDITMEMBER(data);
    },
    async getMemberOrder() {
      let { code, data } = await getMemberOrder({ custNo: this.custNo });
      code === 200 ? (this.memberOrderList = data.list || []) : "";
    },
    async getMemberTask() {
      let { code, data } = await getMemberTask({ custNo: this.custNo });
      code === 200 ? (this.memberTaskList = data) : "";
    },
    renderVChartOne({ chart }) {
      chart.source(this.priceData, {
        value: {
          min: 0,
          max: 100
        }
      });
      chart.coord({
        transposed: true
      });
      chart.interval().position("key*value");
      // 绘制文本
      this.priceData.map(function(obj) {
        chart.guide().text({
          position: [obj.key, obj.value],
          content: obj.value + "%",
          style: {
            fill: "#fff",
            textAlign: "start"
          },
          offsetX: -32
        });
      });
      chart.render();
    },
    renderVChartTwo({ chart }) {
      chart.source(this.discountData, {
        value: {
          min: 0,
          max: 100
        }
      });
      chart.coord({
        transposed: true
      });
      chart.interval().position("key*value");
      // 绘制文本
      this.discountData.map(function(obj) {
        chart.guide().text({
          position: [obj.key, obj.value],
          content: obj.value + "%",
          style: {
            fill: "#fff",
            textAlign: "start"
          },
          offsetX: -32
        });
      });
      chart.render();
    },
    renderVChartThree({ chart }) {
      chart.source(this.catData, {
        value: {
          min: 0,
          max: 100
        }
      });
      chart.coord({
        transposed: true
      });
      chart.interval().position("key*value");
      // 绘制文本
      this.catData.map(function(obj) {
        chart.guide().text({
          position: [obj.key, obj.value],
          content: obj.value + "%",
          style: {
            fill: "#fff",
            textAlign: "start"
          },
          offsetX: -32
        });
      });
      chart.render();
    },
    renderVChartFour({ chart }) {
      chart.source(this.timeData, {
        value: {
          min: 0,
          max: 100
        }
      });
      chart.coord({
        transposed: true
      });
      chart.interval().position("key*value");
      // 绘制文本
      this.timeData.map(function(obj) {
        chart.guide().text({
          position: [obj.key, obj.value],
          content: obj.value + "%",
          style: {
            fill: "#fff",
            textAlign: "start"
          },
          offsetX: -32
        });
      });
      chart.render();
    },
    async submitNewTask() {
      debugger;
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

      let customerRelaServiceDtoListItem = {
        memberName: this.memberInfo.memberName,
        custNo: this.memberInfo.custNo,
        status: "待维系"
      };

      !!this.memberInfo.birthday ? customerRelaServiceDtoListItem.birthday : "";
      !!this.memberInfo.mobile ? customerRelaServiceDtoListItem.mobile : "";
      !!this.memberInfo.sex ? customerRelaServiceDtoListItem.sex : "";

      this.newTaskInfo.customerRelaServiceDtoList.push(
        customerRelaServiceDtoListItem
      );

      let { code, data } = await addTask({ ...this.newTaskInfo });
      if (code === 200) {
        this.$vux.toast.text(data.message);
        this.cancelAddTask();
      }
    },
    async openAddTaskPop(item) {
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
        let { code } = await addMemberToTask({
          custNo: this.custNo,
          relationId: this.taskId
        });
        code === 200
          ? (this.$vux.toast.show({
              time: 1500,
              text: "添加成功"
            }),
            (this.addTaskPop = false))
          : "";

        this.taskId = "";
      }
      this.customizeTaskPop = false;
      this.addTaskType = -1;
    },
    changeTask(e) {
      // 修改自定义任务维系
      this.taskId = e;
    },
    cancelAddTask() {
      // 取消新增
      this.addTaskPop = false;
      this.addTaskType = -1;
      this.currentId = 0;
      this.newTaskInfo.name = "";
      this.newTaskInfo.starttime = "TODAY";
      this.newTaskInfo.endtime = "TODAY";
    },
    switchLogTabItem(e) {
      this.logType = e;
      if (e === 0) {
        this.getMemberOrder();
      } else if (e === 1) {
        this.getMemberTask();
      }
    },
    async changeTaskStatus(type, item, index) {
      let params = {
        custNo: this.custNo,
        relaId: item.relaId,
        taskStatus: "已接听",
        callFlag: "",
        taskResult: ""
      };
      if (type === "taskStatus") {
        params.callFlag = "已接听";
      }
      if (type === "callFlag") {
        params.callFlag = "未接听";
      }
      if (type === "taskResult") {
        params.taskResult = "流失";
      }

      let { code } = await editTaskStatus(params);
      if (code === 200) {
        this.$vux.toast.show({
          text: "修改成功",
          type: "success"
        });
        this.$set(this.memberTaskList[index], type, params[type]);
      }
    },
    async editFollow(status) {
      const data = this.memberInfo;
      let _status = status && status === "Y" ? "N" : "Y";
      let { code } = await editFollow({
        memberNo: this.custNo,
        status: _status
      });
      if (code === 200) {
        this.getInfo();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.member-collect {
  margin-bottom: 10px;
  background-color: #fff;
  &__title {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .main {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
    .after {
      display: flex;
      justify-content: flex-end;
      .above {
        font-size: 12px;
        color: #f3499c;
        padding-right: 12px;
        .fa {
          color: #f3499c;
        }
      }
      .below {
        font-size: 12px;
        color: #39bf54;
        .fa {
          color: #39bf54;
        }
      }
    }
  }
  &__grid {
    padding: 15px 0;
    display: flex;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      .name {
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
      }
      .num {
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        line-height: 1.2;
        &.above {
          color: #f3499c;
        }
        &.below {
          color: #39bf54;
        }
      }
    }
  }
}
.member-charts-title {
  font-size: 14px;
  color: #333;
  padding: 0 10px;
  background-color: #fff;
}

.order-item {
  background-color: #fff;
  margin-bottom: 10px;
  &__head {
    padding: 10px 10px 5px 10px;
    font-size: 16px;
    font-weight: bold;
    .tips {
      float: right;
      margin-top: -25px;
      font-size: 13px;
      font-weight: 300;
    }
  }
  &__sub-head {
    padding: 5px 10px 10px 10px;
    font-size: 14px;
    color: #333;
    border-bottom: 1px dashed #999;
  }
  &__detail {
    .num {
      padding-left: 10px;
      color: #ff6600;
    }
  }
  &__main {
    display: flex;
    .title {
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
    }
    .desc {
      flex: 1;
      padding: 10px;
      p {
        font-size: 14px;
        color: #333;
        .num {
          color: #ff6600;
        }
      }
    }
  }
}

.task-item {
  background-color: #fff;
  margin-bottom: 10px;
  &__head {
    padding: 10px;
    font-size: 16px;
    color: #333;
  }
  &__main {
    padding: 10px 10px;
    & + .task-item__foot {
      margin-top: -10px;
    }
    p {
      font-size: 14px;
      color: #333;
    }
  }
  &__foot {
    display: flex;
    justify-content: space-between;
    .handle {
      flex: 0 0 33.3333%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      overflow: hidden;
      .item {
        margin-left: 8px;
        font-size: 14px;
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
.member-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 9px rgba(0, 0, 0, 0.5);
  z-index: 500;
  &__item {
    flex: 1;
    display: flex;
    justify-content: center;
    .handle-btn {
      width: 42px;
      height: 42px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #fff;
      background-color: #037de0;
      border-radius: 50%;
    }
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
.nodata {
  padding-top: 5%;
}
</style>