<template>
  <div style="height:100%">
    <view-box body-padding-top="40px" class="keeplist-container">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">维系列表

      <template slot="right">
        <i @click="goMemberManege" class="fa fa-plus-circle" style="color:#f8bb64;font-size:18px" aria-hidden="true"></i>
      </template>
    </x-header>
    <!-- 标签栏 -->
    <tab :line-width="2" custom-bar-width="36px">
      <tab-item selected @on-item-click="toggleTab">未维系</tab-item>
      <tab-item @on-item-click="toggleTab">已接听</tab-item>
      <tab-item @on-item-click="toggleTab">未接听</tab-item>
      <tab-item @on-item-click="toggleTab">流失</tab-item>
      <tab-item @on-item-click="toggleTab">所有</tab-item>
    </tab>
    <!--  -->
    <div v-if="dataList.length" class="keeplist-panel">
      <van-cell is-link class="list-item" v-for="(item, index) in dataList" :key="index">
        <template slot="icon" v-if="isActive">
          <van-checkbox checked-color="#0076ff" v-model="item.radio"></van-checkbox>
          <!-- 单选框 -->
        </template>
        <template slot="title">
          <div class="header">
            <span class="name mr-5 text-bold">{{item.memberName}}</span>
            <span class="fa fa-mars text-blue" v-if="item.sex === '男'"></span>
            <span class="fa fa-venus text-danger" v-if="item.sex === '女'"></span>
            <span class="age">{{item.age}}岁</span>
            <span class="tel">{{item.mobile | telFormat}}</span>
          </div>
        </template>
        <template slot="label">
          <div class="tags">
            <span class="text-bold">标签：</span>
            <span>{{item.memTag}}</span>
            <!-- <span>糖尿病患者</span> -->
          </div>
          <div class="switch" v-if="tabIndex === 0">
            <div class="switch-item">
              <span class="mr-5">已接听</span>
              <van-switch
                active-value="已接听"
                inactive-value="未接听"
                size="14px"
                v-model="item.callFlag"
                @change="handleStatus(item, 1)"
              />
            </div>
            <div class="switch-item">
              <span class="mr-5">未接听</span>
              <van-switch
                active-value="未接听"
                inactive-value="已接听"
                size="14px"
                v-model="item.callFlag"
                @change="handleStatus(item, 2)"
              />
            </div>
            <div class="switch-item">
              <span class="mr-5">流失</span>
              <van-switch
                size="14px"
                active-value="流失"
                inactive-value="挽回"
                v-model="item.taskResult"
                @change="handleStatus(item, 3)"
              />
            </div>
          </div>
        </template>
        <template slot="right-icon">
          <a class="van-icon van-icon-arrow van-cell__right-icon" @click="goRoute(item)"></a>
        </template>
      </van-cell>
    </div>
    <no-data v-else></no-data>
    <!-- 底部 下发 -->
    <div class="footer" v-if="isActive">
      <van-checkbox checked-color="#0076ff" v-model="selectAll" @change="change">全选</van-checkbox>
      <van-button size="small" @click="dispatch">下发</van-button>
    </div>
    <!-- 选择人员 遮罩 -->
    <div class="shade" v-if="shadeFlag">
      <div>
        <div class="top">
          <span></span>
          <span>选择人员</span>
          <a class="close-icon" @click="shadeFlag = false">×</a>
        </div>
        <van-radio-group v-model="selectUser">
          <van-cell-group class="shade-list">
            <van-cell v-for="(item, index) in memberData.list" :key="index" :title="item.userName">
              <van-radio :name="item.crmId">{{item.name}}</van-radio>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler">
        <no-data slot="no-results"></no-data>
        <load-more slot="no-more" :show-loading="false" tip="没有更多了"></load-more>
      </infinite-loading>
      <div class="bottom">
        <van-button type="info" @click="confirmDispatch">确定下发</van-button>
      </div>
    </div>
  </view-box>
  </div>
</template>

<script>
import Vue from "vue";
import { XHeader, Tab, TabItem, LoadMore } from "vux";
import {
  Cell,
  CellGroup,
  Switch,
  Checkbox,
  Button,
  RadioGroup,
  Radio
} from "vant";
import {
  relationMemberList,
  editRelationStatus,
  postDispatch
} from "@/api/relationship";
import { queryStaffList } from "@/api/user";
import NoData from "@/components/common/NoData";
import InfiniteLoading from "vue-infinite-loading";
import { BTN_EQUITY } from "@/utils/storage";
Vue.use(Cell)
  .use(CellGroup)
  .use(Switch)
  .use(Checkbox)
  .use(Button)
  .use(RadioGroup)
  .use(Radio);
export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    NoData,
    InfiniteLoading,
    LoadMore
  },
  data() {
    return {
      checked: true,
      params: {
        relaId: "", //this.$route.query.relaId
        relaType: 0,
        taskStatus: "待维系",
        callFlag: "",
        taskResult: ""
      },
      tabIndex: 0,
      dataList: [],
      statusParams: {
        relaId: "",
        custNo: "",
        taskStatus: "",
        callFlag: "",
        taskResult: ""
      },
      shadeFlag: false,
      selectAll: false,
      memberData: {
        list: [],
        paginator: {
          currentPage: 1,
          pageSize: 10,
          totalCounts: 0,
          totalPages: 0
        }
      },
      infiniteId: +new Date(),
      currentPage: 1,
      curSelect: [],
      selectUser: "",
      isActive: false
    };
  },
  watch: {
    dataList: {
      handler(newVal) {
        this.selectAll =
          newVal.filter(item => item.radio).length === newVal.length &&
          newVal.length !== 0
            ? true
            : false;
        return newVal;
      },
      deep: true
    },
    shadeFlag(newVal) {
      if (!newVal) {
        this.selectUser = "";
      }
    }
  },
  methods: {
    goMemberManege() {
      this.$router.push({
        name: "memberManage",
        query: {
          relaId: this.params.relaId
        }
      })
    },
    handleStatus(val, type) {
      let { relaId, custNo, callFlag, taskResult } = val;
      this.restStatusParams();
      this.statusParams.relaId = relaId;
      this.statusParams.custNo = custNo;
      this.statusParams.taskStatus = "已接听";
      if (type === 1 || type === 2) {
        this.statusParams.callFlag = callFlag;
      }
      if (type === 3) {
        this.statusParams.taskResult = taskResult;
      }
      // this.statusParams.taskResult = taskResult  ? taskResult : "流失";

      this.getStatus();
    },
    toggleTab(i) {
      this.tabIndex = i;
      this.restStatus();
      this.dataList = [];
      switch (i) {
        case 0:
          this.params.taskStatus = "待维系";
          break;
        case 1:
          this.params.callFlag = "已接听";
          break;
        case 2:
          this.params.callFlag = "未接听";
          break;
        case 3:
          this.params.taskResult = "流失";
          break;
        case 4:
          break;
      }
      this.getData();
    },
    restStatusParams() {
      this.statusParams.taskStatus = "";
      this.statusParams.callFlag = "";
      this.statusParams.taskResult = "";
    },
    restStatus() {
      this.params.taskStatus = "";
      this.params.callFlag = "";
      this.params.taskResult = "";
    },
    getStatus() {
      editRelationStatus(this.statusParams).then(res => {
        if (+res.code === 200) {
          this.getData();
        }
      });
    },
    getData() {
      relationMemberList(this.params).then(res => {
        if (+res.code === 200) {
          this.dataList = res.data.map(item => {
            item.radio = false;
            return item;
          });
        }
      });
    },
    infiniteHandler($state) {
      queryStaffList({
        userStatus: 1,
        orgNo: "",
        positionNo: "",
        orderByColumn: "join",
        orderByType: "asc",
        pageSize: 10,
        currentPage: this.currentPage,
        queryType: 3
      }).then(res => {
        if (res.code === 200) {
          let { list, paginator } = res.data;
          // this.allData = this.allData.concat(list || [])
          this.memberData.list = this.memberData.list.concat(
            list.map(item => {
              item.selectValue = false;
              return item;
            }) || []
          );

          if (this.currentPage < paginator.totalPages) {
            $state.loaded();
            if (paginator.totalCounts <= 10) {
              $state.complete();
            }
          } else {
            $state.complete();
          }
          this.currentPage++;
        }
      });
    },
    change(value) {
      console.log(value);
      this.dataList = this.dataList.map(item => {
        item.radio = value;
        return item;
      });
    },
    dispatch() {
      console.log(this.selectUser);
      let data = this.dataList.filter(item => item.radio);
      if (data.length === 0) {
        this.$vux.toast.show({
          text: `请选择会员!`,
          time: 2000,
          type: "text"
        });
        return;
      }
      this.curSelect = data;
      this.shadeFlag = true;
    },
    confirmDispatch() {
      if (!this.selectUser) {
        this.$vux.toast.show({
          text: `请选择要下发的人员!`,
          time: 2000,
          type: "text"
        });
        return;
      }
      let list = []
       this.curSelect.forEach(item => {
        list.push(item.custNo)
      });
      let params = {
        userCrmId: this.selectUser,
        relaId: this.curSelect[0].relaId,
        type: '维系任务',
        custNoList: list
      }
      postDispatch(params).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            text: `下发成功!`,
            time: 2000,
            type: "text"
          });
          this.shadeFlag = false;
        }
      });
    },
    goRoute(item) {
      console.log("TCL: goRoute -> item", item);
      // this.$router.push({ path: `/memberManage/${item.custNo}` });
      this.$router.push({
        name: "memberManage",
        query: {
          custNo: item.custNo
        }
      })
    }
  },
  created() {
    let equityList = [];
    equityList = this.$utils.getLocalData(BTN_EQUITY, true) || [];
    equityList.forEach(v => {
      console.log(v.moduleKey);
      if (v.moduleKey == "ACTIVITY_FORWARD") {
        this.isActive = true;
      }
    });
    console.log(this.isActive);
  },
  mounted() {
    console.log(this.$route.query.relaId);
    // this.statusParams.relaId = this.$route.query.relaId
    this.params.relaId = this.$route.query.relaId;
    this.getData();

    // this.getMemberData();
  }
};
</script>

<style lang="less" scoped>
  /deep/ .vux-tab-item {
    flex: 0 0 20%;
  }
  .list-item {
    margin-top: 10px;
    align-items: center;
    /deep/ .van-checkbox {
      margin-right: 5px;
    }
    .header {
      font-size: 14px;
      .age,
      .tel {
        font-size: 12px;
      }
    }
    .switch {
      margin-top: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .switch-item {
        display: flex;
        align-items: center;
      }
    }
  }
  .keeplist-panel {
    padding-bottom: 8vh;
  }
  .footer {
    display: flex;
    padding: 5px 15px;
    background-color: #fff;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    border-top: 1px solid #eee;
  }

.shade {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  overflow: auto;
  top: 0;
  left: 0;
  // right: 0;
  // bottom: 0;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 0;
  .top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
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
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
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
.shade-list {
  padding-bottom: 64px;
}
.text-bold {
  color: #000;
  font-weight: bold;
}
.text-blue {
  color: #0076ff;
}
.text-danger {
  color: red;
}
.mr-5 {
  margin-right: 5px;
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-bar-inner{
  background:rgba(0,202,172,1)
}
</style>
