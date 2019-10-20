<template>
  <div style="height:100%">
    <view-box body-padding-top="40px" class="keeplist-container">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">维系列表</x-header>
    <!-- 标签栏 -->
    <tab :line-width="2" custom-bar-width="36px">
      <tab-item selected @on-item-click="toggleTab">待邀约</tab-item>
      <tab-item @on-item-click="toggleTab">已邀约</tab-item>
      <tab-item @on-item-click="toggleTab">所有</tab-item>
    </tab>
    <!--  -->
    <div v-if="dataList.length" class="keeplist-panel">
      <van-cell is-link class="list-item" v-for="(item, index) in dataList" :key="index">
        <template slot="icon" v-if="tabIndex === 0">
          <van-checkbox   v-if="isActive" checked-color="#0076ff" v-model="item.radio">

          </van-checkbox>
          <!-- 单选框 -->
        </template>
        <template slot="title">
          <div class="header">
            <!-- <span class="name mr-5 text-bold">{{item.memberName}}</span> -->
            <span class="name mr-5 text-bold">{{item.memberName}}</span>
            <span class="fa fa-mars text-blue" v-if="item.sex === '男'"></span>
            <span class="fa fa-venus text-danger" v-if="item.sex === '女'"></span>
            <span class="age">{{item.age}}岁</span>
            <span class="tel">{{item.mobile | telFormat}}</span>
            <span class="tel">{{item.memberGrade}}</span> 
          </div>
        </template>
        <template slot="label">
          <!-- <div class="address">
            北京市朝阳区酒仙桥5号院
          </div> -->
          <div class="tags">
            <span class="text-bold">标签：</span>
            <span>{{item.memTag | nullset}}</span>
          </div>
          <!-- <div class="switch" style="justify-content: flex-start;">
            <span>{{item.relationDate}} &nbsp;</span>
            <div class="switch-item">
              <span class="mr-5">邀约状态</span>
              <van-switch
                active-value="已邀约"
                inactive-value="待邀约"
                size="14px"
                @change="handleStatus(item)"
                v-model="item.taskStatus"/>
            </div>
          </div> -->
        </template>
        <template slot="right-icon">
          <a class="van-icon van-icon-arrow van-cell__right-icon" @click="goRoute(item)">

          </a>
        </template>
      </van-cell>
    </div>
    <no-data v-else></no-data>
    <!-- 底部 下发 -->
    <div class="footer" v-if="tabIndex === 0 && isActive">
      <van-checkbox checked-color="#0076ff" v-model="selectAll" @change="change">全选</van-checkbox>
      <div>
        <van-button size="small" @click="dispatch">下发</van-button>
        <van-button size="small" @click="invite">邀约结果</van-button>
      </div>
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
          <van-cell-group>
            <van-cell v-for="(item, index) in memberData.list" :key="index" :title="item.userName" >
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
    <!-- 活动邀请 遮罩 -->
    <div v-transfer-dom class="relation-invite-dialog">
      <x-dialog v-model="isShow" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': '#fff', top: 'auto'}">
        <a style="color:#fff;text-align:center;" @click="isShow = false">
        </a>
        <h3 class="dialog-title">活动邀请</h3>
        <group>
          <selector class="form-item" ref="defaultValueRef" :options="list" v-model="formData.sendType"></selector>
          <datetime
            v-model="formData.date"
            placeholder="请选择日期"
            class="form-item"
            :start-date="startDate"
            format="YYYY-MM-DD HH:mm"
          ></datetime>
          <!-- 
            clear-text="今天"
            @on-clear="setToday" -->
          <selector class="form-item" :options="list2" v-model="formData.result"></selector>
          <!-- <x-textarea class="form-item" v-model="formData.content" :max="200" name="description" placeholder="请输入邀请内容"></x-textarea>
          <x-input class="form-item" ref="opsName" placeholder="请编写签名" v-model="formData.name"></x-input> -->
        </group>
        <group class="invite-btn">
          <x-button mini plain class="cancel-btn" @click.native="isShow = false">取消</x-button>
          <x-button mini plain class="confirm-btn" @click.native="confirmInvite">确定</x-button>
        </group>
      </x-dialog>
    </div>
  </view-box>
  </div>
</template>

<script>
import Vue from "vue";
import { 
  XHeader, 
  Tab, 
  TabItem, 
  Group,
  XTextarea, 
  XInput, 
  XButton,
  Datetime,
  Selector,
  XDialog,
  TransferDom,
  LoadMore
} from "vux";
import { 
  Cell,
  CellGroup, 
  Switch, 
  Checkbox, 
  Button, 
  RadioGroup, 
  Radio
} from "vant";
import { relationMemberList, editRelationStatus, postDispatch, customTaskInvitation } from "@/api/relationship";
import { queryStaffList } from "@/api/user";
import NoData from '@/components/common/NoData'
import InfiniteLoading from "vue-infinite-loading";
import { datefmt } from '@/utils/common'
import { log } from 'util';
import { BTN_EQUITY } from "@/utils/storage";
Vue.use(Cell)
  .use(CellGroup)
  .use(Switch)
  .use(Checkbox)
  .use(Button)
  .use(Radio)
  .use(RadioGroup)
export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    Group,
    Selector,
    XDialog,
    XTextarea,
    XInput,
    XButton,
    Datetime,
    NoData,
    InfiniteLoading,
    LoadMore
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      checked: true,
      params: {
        relaId: "", //this.$route.query.relaId
        relaType: 1,
        taskStatus: "待邀约",
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
      // curSelect: [],
      selectUser: '',
      dateValue: '',
      // isShow: true,
      isShow: false,
      formData: {
        sendType: '电话',
        date: '',
        result: '成功',
        // content: '',
        // name: ''
      },
      list: ['电话', '短信', '微信'],
      list2: ['成功', '失败'],
      startDate: '1970-01-01',
      currentPage: 1,
      infiniteId: +new Date(),
      isActive: false
    };
  },
  watch: {
    dataList:{
      handler(newVal) {
        this.selectAll = newVal.filter(item => item.radio).length === newVal.length && newVal.length !== 0 ? true : false
        return newVal
      },
      deep: true
    },
    shadeFlag(newVal) {
      if (!newVal) {
        this.selectUser = ''
      }
    }
  },
  computed: {
    curSelect() {
      return this.dataList.filter(item => item.radio)
    }
  },
  methods: {
    handleStatus(val) {
      let { relaId, custNo, taskStatus, callFlag, taskResult } = val;

      this.statusParams.relaId = relaId;
      this.statusParams.custNo = custNo;
      this.statusParams.taskStatus = taskStatus === '已邀约' ? taskStatus : '待邀约';
      this.statusParams.callFlag = callFlag ? callFlag : '电话';
      this.statusParams.taskResult = taskResult === '成功'  ? taskResult : "失败";

      this.getStatus();
    },
    getData() {
      relationMemberList(this.params).then(res => {
        if (+res.code === 200) {
          // this.dataList = [{taskStatus: false}]
          this.dataList = res.data.map(item => {
            item.radio = false
            return item
          });
        }
      });
    },
    toggleTab(i) {
      this.restStatus();
      this.tabIndex = i
      this.dataList = []
      switch (i) {
        case 0:
          this.params.taskStatus = "待邀约";
          break;
        case 1:
          this.params.taskStatus = "已邀约";
          break;
        case 2:
          this.params.taskStatus = "所有";
          break;
      }
      this.getData();
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
    change(value) {
      console.log(value)
      this.dataList = this.dataList.map(item => {
        item.radio = value
        return item
      })
    },
    dispatch() {
      // let data = this.dataList.filter(item => item.radio)
      if(this.curSelect.length === 0) {
        this.$vux.toast.show({
          text: `请选择会员!`,
          time: 2000,
          type: "text"
        })
        return
      }
      // this.curSelect = data
      this.shadeFlag = true
    },
    confirmDispatch() {
      if(!this.selectUser) {
        this.$vux.toast.show({
          text: `请选择要下发的人员!`,
          time: 2000,
          type: "text"
        })
        return
      }
      // let params = this.curSelect.map(item => {
      //   return {
      //     custNo: item.custNo,
      //     relaId: item.relaId,
      //     userID: this.selectUser
      //   }
      // })
      let list = []
       this.curSelect.forEach(item => {
        list.push(item.custNo)
      });
      let params = {
        userCrmId: this.selectUser,
        relaId: this.curSelect[0].relaId,
        type: '活动邀约',
        custNoList: list
      }
      postDispatch(params).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            text: `下发成功!`,
            time: 2000,
            type: "text"
          })
          this.shadeFlag = false
        }
      })
    },
    invite () {
      if(this.curSelect.length === 0) {
        this.$vux.toast.show({
          text: `请选择会员!`,
          time: 2000,
          type: "text"
        })
        return
      }
      this.isShow = true
    },
    confirmInvite () {
      if(!this.formData.date) {
        this.$vux.toast.text('请选择日期！')
        return
      }
      let { sendType, date, result } = this.formData
    //   "relaId": this.params.relaId,
    // "customerRelaServiceDtoList": {
    //     "custNo": "会员编号",
    //     "taskStatus": "待邀约 | 已邀约",
    //     "sendType": "发送方式：电话、短信、微信",
    //     "taskResult": "成功 | 失败",
    //     "relationDate": "邀约时间"
    // }
      let customerRelaServiceDtoList = this.curSelect.map(item => {
        return {
          custNo: item.custNo,
          taskStatus: '已邀约',
          // taskStatus: '待邀约',
          sendType: sendType,
          taskResult: result,
          // relationDate: new Date(date)
          relationDate: datefmt(date, 'YYYY-MM-DD HH:mm:ss')
        }
      })
      let params = {
        relaId: this.params.relaId,
        customerRelaServiceDtoList
      }
      customTaskInvitation(params).then(res => {
        if (res.code === 200) {
          // this.currentPage = 1
          // this.infiniteId = +new Date()
          this.getData()
          this.isShow = false
        }
      })
    },
    infiniteHandler($state) {
      queryStaffList({
        userStatus: 1,
        orgNo: '',
        positionNo: '',
        orderByColumn: 'join',
        orderByType: 'asc',
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

          if (this.currentPage <= paginator.totalPages) {
            $state.loaded();
            if (paginator.totalCounts <= 10) {
              $state.complete();
            }
          } else {
            $state.complete();
          }
          this.currentPage++;
        }
      })
    },
    goRoute(item) {
      // this.$router.push({ path: `/memberDetail/${item.custNo}` })
      this.$router.push({
        name: "memberManage",
        query: {
          custNo: item.custNo
        }
      })
    },
    setToday(value) {
      // 设置当天
      let now = new Date();
      let cmonth = now.getMonth() + 1;
      let day = now.getDate();
      if (cmonth < 10) cmonth = "0" + cmonth;
      if (day < 10) day = "0" + day;
      let today = now.getFullYear() + "-" + cmonth + "-" + day;
      this.startDate = today;
      this.formData.date = today;
    }
  },
  mounted() {
    console.log(this.$route.query.relaId);
    this.params.relaId = this.$route.query.relaId || ''
    this.getData();
    // this.getMemberData()
    let equityList = [];
    equityList = this.$utils.getLocalData(BTN_EQUITY, true) || [];
    equityList.forEach(v => {
      console.log(v.moduleKey);
      if (v.moduleKey == "ACTIVITY_FORWARD") {
        this.isActive = true;
      }
    });
  }
};
</script>

<style lang="less">
.relation-invite-dialog {
  .dialog-title {
    font-size:14px;
    color: #1e1e1e;
    padding: 20px 0;
  }
  .weui-cells {
    padding: 0 35px;
    padding-top: 0;
    margin-top: 0;
    &::before,
    &::after {
      display: none;
    }
    .form-item {
      border: 1px solid #a9a9a9;
      margin-bottom: 5px;
    }
  }
  .vux-datetime-value {
    text-align: left;
  }
  .invite-btn {
    .weui-cells {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
    .cancel-btn,
    .confirm-btn {
      margin: 0;
      width: 140px;
    }
    .confirm-btn {
      background-color: #1f459b;
      color: #fff;
    }
  }
}
</style>


<style lang="less" scoped>
.keeplist-container {
  padding-bottom:50px;
  /deep/ .vux-tab-item {
    flex: 0 0 33.3%;
  }
  .list-item {
    margin-top: 10px;
    align-items: center;
    /deep/ .van-checkbox {
      margin-right: 10px;
    }
    .header {
      font-size: 14px;
      .age,
      .tel {
        font-size: 12px;
      }
    }
    .address {
      color: #333;
      margin-top: 5px;
    }
    .switch {
      margin-top: 5px;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .switch-item {
        display: flex;
        align-items: center;
      }
    }
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
}

.shade {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  overflow: auto;
  top: 0;
  left: 0;
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
// .invite-shade {
//   padding: 20px;
// }
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
