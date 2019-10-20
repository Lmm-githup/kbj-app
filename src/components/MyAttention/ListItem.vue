<template>
  <div class="mymember-list" v-if="list">
    <van-checkbox-group v-model="selectList" @change="change">
      <div class="mymember-item" v-for="(item, index) in list" :key="index">
        <router-link :to="{name: 'memberManage', query: {custNo: item.custNo}}">
        <div class="mymember-item__head" >
          <div class="wrap">
            <div class="main">
              <div class="avatar">
                <img :src="item.image" class="full-square-img" v-if="item.image">
                <img src="/src/assets/images/no-img.jpg" class="full-square-img" v-else>
              </div>
              <div class="desc">
                <div class="info">{{item.custName}}</div>
                <div v-if="item.type == 1">
                  {{item.saleDate}}
                </div>
                <div v-else>
                  {{item.updateDate}}
                </div>
              </div>
            </div>
            <div class="after">
              <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        </router-link>
        <div v-if="item.type == 1">
          <div
            class="cell"
            style="color:#32429A;font-weight:700;margin-top: 10px;padding-left: 0.4rem;"
          >购买了商品{{item.prodName}}</div>
          <!-- <van-card
            :num="item.prodCount"
            :price="item.price"
            :desc="item.prodSpec"
            :title="item.prodName"
            :thumb="item.imgUrl"
          /> -->
          <div class="card">
            <div class="item">
              <div style="color:#333;font-size:14px;">{{item.prodName}}</div>
              <div v-if="item.prodCount">x {{item.prodCount}}</div>
            </div>
            <div class="item">
              <div>{{item.prodSpec}}</div>
              <div>{{item.price}}</div>
            </div>
          </div>
        </div>
        <div v-if="item.type == 2">
          <div
            v-if="item.couponStatus == '未使用'"
            class="cell"
            style="color:#32429A;font-weight:700;margin-top: 10px;padding-left: 0.4rem;"
          >已领取了{{item.couponName}}</div>
          <div
            v-if="item.couponStatus == '已使用'"
            class="cell"
            style="color:#32429A;font-weight:700margin-top: 10px;padding-left: 0.4rem;"
          >已使用了{{item.couponName}}</div>
          <div class="coup-container">
            <div class="coup-content">
              <div class="coup-left">
                <span>￥{{item.creditAmount}}</span>
              </div>
              <div class="coup-right">
                <div class="coup-name">{{item.couponName}}</div>
                <div class="coup-desc">
                  <span style="font-size:14px;">￥{{item.creditAmount}}</span>
                  <span>满{{item.minimumAmount}}可用</span>
                </div>
                <div class="coup-time">{{item.effectiveTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mymember-item__foot vux-1px-t" :class="{cell3: type === 'search'}">
          <a class="handle-btn" :href="'tel:' + item.mobile">
            <i class="fa fa-mobile" aria-hidden="true"></i>
            打电话
          </a>
          <router-link :to="{name: 'addTags', params: {custNo: item.custNo}}" class="handle-btn">
            <i class="fa fa-tag" aria-hidden="true"></i>
            增加标签
          </router-link>
          <router-link
            :to="{name: 'pharmacyService', params: {custNo: item.custNo}}"
            class="handle-btn"
          >
            <i class="fa fa-medkit" aria-hidden="true"></i>
            药学服务
          </router-link>
          <a class="handle-btn" v-if="type !== 'search'" @click="openAddTaskPop(item)">
            <i class="fa fa-plus-square" aria-hidden="true"></i>
            关系维系
          </a>
        </div>
      </div>
    </van-checkbox-group>
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
        <p class="nodata" v-else>请选择你要进行的操作</p>
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
          <radio :options="taskList" @on-change="changeTask"></radio>
        </group>
        <p class="nodata" v-else>暂无数据</p>
      </popup>
    </div>
  </div>
</template>

<script>
import {
  Popup,
  XHeader,
  Tab,
  TabItem,
  PopupHeader,
  Group,
  Radio,
  XInput,
  XButton,
  Calendar,
  TransferDomDirective as TransferDom
} from "vux";
import Vue from "vue";
import { getMemberTask, addTask, addMemberToTask } from "@/api/mymember";
import { Checkbox, CheckboxGroup, Card } from "vant";
Vue.use(Checkbox)
  .use(CheckboxGroup)
  .use(Card);
export default {
  name: "MymemberItem",
  directives: {
    TransferDom
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    checkList: {
      type: Array
    },
    type: {
      type: String
    }
  },
  components: {
    Popup,
    XHeader,
    Tab,
    TabItem,
    Group,
    Radio,
    XInput,
    XButton,
    Calendar,
    PopupHeader
  },
  data() {
    return {
      addTaskPop: false,
      addTaskType: -1,
      customizeTaskPop: false,
      taskList: [],
      taskId: 0,
      newTaskInfo: {
        custNo: "",
        relaName: "",
        startDate: "TODAY",
        endDate: "TODAY"
      },
      selectList: []
    };
  },
  computed: {},
  watch: {
    checkList(newVal) {
      this.selectList = newVal;
    }
  },
  created() {},
  mounted() {},
  methods: {
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

      let customerRelaServiceDtoListItem = {
        memberName: this.editMember.memberName,
        custNo: this.editMember.custNo,
        status: "未维系"
      };

      !!this.editMember.birthday ? customerRelaServiceDtoListItem.birthday : "";
      !!this.editMember.mobile ? customerRelaServiceDtoListItem.mobile : "";
      !!this.editMember.sex ? customerRelaServiceDtoListItem.sex : "";

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
      this.editMember = item;
      this.newTaskInfo.custNo = item.custNo;
      let { code, data } = await getMemberTask({ custNo: item.custNo });
      if (code === 200 && data && data.records) {
        data.records.forEach(el => {
          this.taskList.push({
            key: el.relaId,
            value: el.relaName
          });
        });
        this.taskList = data.records || [];
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
          relaRowId: this.taskId
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
      this.newTaskInfo.custNo = "";
      this.newTaskInfo.relaName = "";
      this.newTaskInfo.startDate = "TODAY";
      this.newTaskInfo.endDate = "TODAY";
    },
    change(value) {
      this.$emit("updateCheckList", value);
    }
  }
};
</script>
<style lang="less" scoped>
.mymember-item {
  background-color: #fff;
  margin-top: 5px;
  margin-bottom: 10px;
  overflow: hidden;
  &__head {
    padding: 10px;
    .wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &::after {
        position: absolute;
        content: " ";
        left: 0;
        bottom: -10px;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(
          to right,
          #c7c7c7 0%,
          #c7c7c7 50%,
          transparent 50%
        );
        background-size: 10px 1px;
        background-repeat: repeat-x;
      }
    }
    .main {
      flex: 1;
      display: flex;
      align-items: center;
      .avatar {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      .desc {
        flex: 1;
        padding-left: 10px;
        .info {
          font-size: 14px;
          color: #333;
          display: flex;
          align-items: center;
          font-weight: 600;
          margin-bottom: 10px;
          .fa {
            font-size: 14px;
            padding: 0 8px;
            &.fa-mars {
              color: #037de0;
            }
            &.fa-venus {
              color: #f3499c;
            }
          }
          .sign {
            font-size: 12px;
            font-weight: normal;
          }
          .icon-vip {
            position: relative;
            margin-left: 8px;
            padding: 2px;
            background-color: #c7c7c7;
            font-size: 10px;
            line-height: 1;
            font-weight: normal;
            color: #fff;
            border-radius: 2px;
            &::after {
              position: absolute;
              content: " ";
              left: 0;
              bottom: -3px;
              width: 0;
              height: 0;
              border-width: 6px 6px 0;
              border-style: solid;
              border-color: #c7c7c7 transparent transparent;
              transform: rotate(10deg);
            }
            &.on {
              background-color: #ff9933;
              &::after {
                border-color: #ff9933 transparent transparent;
              }
            }
          }
        }
        .tags-list {
          display: flex;
          .tags {
            font-size: 12px;
            line-height: 1;
            padding: 3px;
            color: #fff;
            background-color: #ffcccc;
            border-radius: 3px;
            margin-right: 8px;
          }
        }
      }
    }
    .after {
      .fa {
        font-size: 14px;
        color: #ccc;
        -webkit-text-stroke: 1px #fff;
      }
    }
  }
  &__main {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    .cell {
      flex: 0 0 50%;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #5c5c5c;
      line-height: 24px;
      .fa {
        margin-left: 3px;
      }
    }
  }
  &__foot {
    display: flex;
    padding: 10px 0;
    .handle-btn {
      position: relative;
      flex: 0 0 25%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #333;
      &:not(:nth-last-child(1))::after {
        position: absolute;
        content: " ";
        top: 0;
        right: 0;
        height: 100%;
        width: 1px;
        background-color: #c7c7c7;
      }
      .fa {
        font-size: 14px;
        padding-right: 4px;
      }
    }
    &.cell3 {
      .handle-btn {
        flex: 0 0 33.333%;
      }
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
.nodata {
  font-size: 12px;
  color: #5c5c5c;
  text-align: center;
  margin: 42px;
}
.card{
  padding: 10px 20px;
  font-size: 12px;
  color: #7d7e80;
  .item{
    display: flex;
    justify-content: space-between;
  }
}
.coup-container {
  display: flex;
  justify-content: center;
  padding: 10px;
  .coup-content {
    width: 70%;
    display: flex;
    border-radius: 5px;
    box-shadow: 1px 1px 1px 1px #eee;
    .coup-left {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      flex: 2;
      background: #3a6fde;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 24px;
      position: relative;
            width: 96%;
            padding: 6px;
            padding-right:0;
            box-sizing: border-box;
            color: #fff;
            background-image: radial-gradient(#fff 35%,#3a6fde 35%);
            background-size: 15px 15px;
            background-position: right -8px top 0px;
            background-repeat: repeat-y
    }
    .coup-right {
      flex: 5;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      padding-left: 10px;
      font-size: 12px;
      > div {
        padding: 2px 0;
      }
      .coup-name {
        color: #5c5c5c;
      }
      .coup-desc {
        color: #3a6fde;
      }
      .coup-time {
        color: #5c5c5c;
        font-size: 10px;
      }
    }
  }
}
</style>