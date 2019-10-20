<template>
  <div style="height:100%;">
    <view-box body-padding-bottom="55px">
    <x-header :title="isOnlyMember ? '' : '会员管理'" slot="header" :left-options="{showBack: true,backText: ''}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      <!-- change by.xyq 固定头部 -->
      <div class="mymember-title" slot="overwrite-title">
        <div class="search-bar" style="margin-right:4px;">
          <div @click="showSearch = true">
            <div class="search-bar__main">
              <i class="fa fa-vimeo-square" aria-hidden="true"></i>
              <p class="txt">会员指定条件查询</p>
            </div>
          </div>
        </div>
        </div>
      <!-- <div class="search-bar">
          <router-link :to="{name: 'inquireMember'}">
            <div class="search-bar__main">
              <p class="txt">查询会员</p>
              <i class="fa fa-search" aria-hidden="true"></i>
            </div>
          </router-link>
        </div>
        <div class="search-bar">
          <router-link :to="{name: 'addMember'}">
            <div class="search-bar__main">
              <p class="txt">新增会员</p>
              <i class="fa fa-plus" aria-hidden="true" style="color:rgba(0,202,172,1)"></i>
            </div>
          </router-link>
      </div>-->
      <!-- </div> -->
      <div class="header-after" v-if="(isSet || isWeixi) && !isOnlyMember" slot="right" style="color:#f8bb64;font-size:16px;">
        <!-- <i v-if="!isCheck" class="fa fa-cogs" @click="isCheck = true" aria-hidden="true"></i> -->
        <!-- <img
          
          src="/src/assets/images/member/u6578.png"
          alt
        > -->
        <div v-if="!isCheck"
          style="color:#f8bb64;font-size:12px;"
          @click="handleCheck">批量操作</div>
        <a v-else @click="isCheck = false" style="color:#f8bb64;font-size:12px;">完成</a>
      </div>
    </x-header>
    <!-- undone -->
    <div>
      <mymember-item
        :list="List"
        :isManage="true"
        :isCheck="isCheck"
        :checkList="checkList"
        @updateCheckList="updateCheckList"
      ></mymember-item>
      <infinite-loading
        @infinite="infiniteHandler"
        :show-loading="false"
        spinner="circles"
        :identifier="infiniteId"
      >
        <no-data v-if="!List.length" :show-loading="false" slot="no-results"></no-data>
        <load-more v-else slot="no-results" :show-loading="false" tip="没有更多了"></load-more>
        <no-data v-if="!List.length" :show-loading="false" slot="no-more"></no-data>
        <load-more v-else slot="no-more" :show-loading="false" tip="没有更多了"></load-more>
      </infinite-loading>
    </div>
    <!-- footer -->
    <div class="footer" v-if="isCheck">
      <div>
        <van-checkbox v-model="checkedAll">全选</van-checkbox>
      </div>
      <div v-if="formTaskListId">
        <a class="shift" @click="comfirmTask">确认维系</a>
      </div>
      <div v-else>
        <a class="shift" @click="openAddTaskPop" v-if="isWeixi">维系</a>
      <a class="shift" @click="dispatch" v-if="isSet">转交</a>
      </div>
    </div>
    <!-- 选择人员 遮罩 -->
    <div class="shade" v-show="shadeFlag">
      <div>
        <div class="top">
          <span></span>
          <span>选择人员</span>
          <a class="close-icon" @click="shadeFlag = false">×</a>
        </div>
        <van-radio-group v-model="selectUser">
          <group>
            <cell v-for="(item, index) in memberData.list" :key="index" :title="item.userName">
              <van-radio :name="item"/>
            </cell>
          </group>
        </van-radio-group>
      </div>
      <div class="bottom">
        <van-button type="info" @click="confirmDispatch">确定转交</van-button>
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
          active-color="rgba(0,202,172,1)"
          bar-active-color="rgba(0,202,172,1)"
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
          <!-- <radio :options="taskList" v-model="taskId"></radio> -->
          <van-radio-group v-model="taskId">
          <group>
            <cell v-for="(item, index) in taskList" :key="index" :title="item.value">
              <van-radio :name="item.key">
                <van-icon slot="icon" name="success" />
              </van-radio>
            </cell>
          </group>
        </van-radio-group>
        </group>
        <p class="nodata" v-else>暂无数据</p>
      </popup>
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
  Tab,
  TabItem,
  Calendar,
} from "vux";
import InfiniteLoading from "vue-infinite-loading";
import MymemberItem from "@/components/Mymember/MymemberItem";
import Vue from "vue";
import { Toast } from "vant";
import { mapState, mapActions } from "vuex";
import { BTN_EQUITY } from "@/utils/storage";
import { getList, postMemberDistribution, getGuideCustomTask,addMemberToTask,
  addTask } from "@/api/mymember";
import { queryStaffList } from "@/api/user";
import NoData from "@/components/common/NoData";

import {
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Button,
  Field,
  Icon
} from "vant";

Vue.use(Checkbox)
  .use(CheckboxGroup)
  .use(RadioGroup)
  .use(Radio)
  .use(Button)
  .use(Icon)
  .use(Field);

export default {
  name: "Mymember",
  components: {
    NoData,
    InfiniteLoading,
    MymemberItem,
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
    Tab,
    TabItem,
    Calendar,
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      top: 0,
      pageSize: 10,
      currentPage: 1,
      List: [1,2],
      hasMore: true,
      infiniteId: +new Date(),
      memberData: {
        list: [],
        paginator: {
          currentPage: 1,
          pageSize: 10,
          totalCounts: 0,
          totalPages: 0
        }
      },
      shadeFlag: false,
      selectUser: "",
      isSet: false,
      isOnlyMember: true,
      showSearch: false,
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
      params: {},
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
      },
      custNo: '',
      formTaskListId: '',
      isWeixi: false,
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
  watch: {
    checkedAll(newVal) {
      this.checkList = [];
      if (newVal) {
        this.List.forEach((item, index) => {
          this.checkList.push(index);
        });
      }
    }
  },
  computed: {},
  created() {
    this.formTaskListId = this.$route.query.relaId
    if (this.formTaskListId) {
      this.isCheck = true
    }
    let equityList = [];
    equityList = this.$utils.getLocalData(BTN_EQUITY, true) || [];
    equityList.forEach(v => {
      if (v.moduleKey == "MEMBER_FORWARD") {
        this.isSet = true;
      } else if (v.moduleKey == "MEMBER_BATCH_WEIXI") {
        this.isWeixi = true
      }
    });

    let custNo = this.$route.query.custNo;
    if (custNo) {
      this.custNo = custNo
      this.isOnlyMember = true;
    } else {
      this.isOnlyMember = false;
    }
  },
  mounted() {
    // this.getHeaderHight();
  },
  methods: {
    comfirmTask() {
      this.chooseTask()
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
      if (this.taskId || this.formTaskListId) {
        // 选择自定义维系
        let _customerRelaServiceDtoList = [];
        this.checkList.forEach(index => {
          let { custNo } = this.List[index];
          _customerRelaServiceDtoList.push({ custNo });
        });
        let { code, data } = await addMemberToTask({
          customerRelaServiceDtoList: _customerRelaServiceDtoList,
          relationId: this.taskId || this.formTaskListId
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
    handleCheck() {
      this.isCheck = true;
      this.getMemberData();
    },
    infiniteHandler($state) {
      let allParams = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        custNo: this.custNo,
        viewType: "all",
        relaRowId: this.formTaskListId,
        ...this.params
      }
      if(!this.custNo) {
        delete allParams.custNo
        delete allParams.viewType
      }
      getList(allParams).then(res => {
        let { list, paginator } = res.data;
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
          $state.complete();
        }
      });
    },
    getMemberData() {
      queryStaffList({
        userStatus: 1,
        orgNo: "",
        positionNo: "",
        orderByColumn: "join",
        orderByType: "asc",
        currentPage: 1,
        pageSize: 10,
        queryType: 3
      }).then(res => {
        if (res.code === 200) {
          this.memberData.list = res.data.list.map(item => {
            item.selectValue = false;
            return item;
          });
          this.memberData.paginator = res.data.paginator;
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    dispatch() {
      // console.log(this.selectUser)
      // let data = this.dataList.filter(item => item.radio)
      // if(data.length === 0) {
      //   console.log('请选择会员!')
      //   return
      // }
      // this.curSelect = data
      this.shadeFlag = true;
    },
    confirmDispatch() {
      console.log(this.selectUser);
      let _this = this;
      let customerDtoList = [];
      this.checkList.forEach(index => {
        // this.List[index] custNo memberName
        let { custNo, memberName } = this.List[index];
        customerDtoList.push({ custNo, memberName });
      });

      console.log("TCL: confirmDispatch -> customerDtoList", customerDtoList);
      console.log("crmId", this.selectUser.crmId);
      // return
      postMemberDistribution({
        inUserNo: this.selectUser.crmId,
        outUserNo: "",
        transferReason: "",
        inUserName: this.selectUser.userName,
        outUserName: "",
        customerDtoList
      }).then(res => {
        if (res.code === 200) {
          // this.$vux.toast.show({
          //   time: 2000,
          //   text: res.data.message
          // });
          Toast.loading({
            duration: 1500, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: "spinner",
            message: res.data.message,
            onClose() {
              _this.init();
            }
          });
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
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
    init() {
      this.shadeFlag = false;
      this.isCheck = false;
      this.currentPage = 1;
      this.List = [];
      // this.infiniteHandler();
      this.infiniteId = +new Date();
    },
    getHeaderHight() {
      // this.top = this.$refs.myheader.$el.clientHeight;
    },
    updateCheckList(value) {
      console.log("TCL: updateCheckList -> updateCheckList", value);
      this.checkList = value;
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .vux-header-title-area {
  margin-left: 80px;
  margin-right: 80px;
}
.title-reset {
  margin: 0;
  height: 1.06667rem;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.06667rem;
  text-align: center;
  font-size: 0.48rem;
  font-weight: 400;
}
.mymember-title {
  display: flex;
  justify-content: space-between;
  .search-bar {
    height: 30px;
    margin-top: 5px;
    &__main {
      display: flex;
      align-items: center;
      padding: 0 15px;
      height: 30px;
      border: 1px solid #aeaeae;
      border-radius: 30px;
      background-color: #f2f2f2;
      box-sizing: border-box;
      & > .txt {
        flex: 1;
        font-size: 14px;
        color: #333;
      }
      & > .fa {
        color: rgba(0,202,172,1);
        -webkit-text-stroke: 1px #f2f2f2;
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
        color: rgba(0,202,172,1);
        font-size: 12px;
      }
      & > .fa {
        margin-right: 4px;
        margin-left: 4px;
        color: rgba(0,202,172,1);
        //-webkit-text-stroke: 1px #ff9933;
      }
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
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
    border: 1px solid #f8bb64;
    padding: 1px 20px;
    border-radius: 50px;
    color: #f8bb64;
  }
}
.shade {
  position: fixed;
  z-index: 109;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    // line-height: 40px;
    padding: 3px 15px;
    font-size: 18px;
    color: #101010;
    text-align: center;
    border-bottom: 1px solid #dfdfdf;
    background-color: #fff;
    .close-icon {
      font-size: 24px;
      color: #ccc;
    }
  }
  .center {
    flex: 1;
    margin-top: 10px;
    .item {
      padding: 10px;
      background-color: #fff;
      border-bottom: 1px solid #dfdfdf;
    }
  }
  .bottom {
    background-color: #fff;
    padding: 10px 0;
    text-align: center;
    /deep/ .van-button {
      width: 80%;
      height: 28px;
      line-height: 28px;
    }
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
//清空的颜色
/deep/.vux-popup-header-right{
  color:rgba(0,202,172,1)
}
/deep/.weui-btn_primary{
  background:rgba(0,202,172,1)
}
/deep/.mymember-title .search-bar__main{
  border: 1px solid rgba(0,202,172,1);
}

</style>