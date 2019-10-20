<template>
  <div>
    <div style="height:50px;margin-bottom:10px;">
      <div class="member-button-tab">
        <button-tab v-model="serviceType">
          <!-- <button-tab-item @on-item-click="switchTabItem">意见反馈</button-tab-item> -->
          <button-tab-item @on-item-click="switchTabItem">会员活动</button-tab-item>
        </button-tab>
      </div>
    </div>
    <group v-show="serviceType == 0" v-for="(item,index) in feedbackList" :key="index">
      <cell
        :title="item.srSubType"
        :inline-desc="item.gmtCreate | dateFormat"
        :link="{name:'Article', params:{id: item.srId, type: 'complaint',custNo: custNo}}"
      >
        <p slot="after-title" class="cell-desc">{{item.srQuestion}}</p>
        <x-button mini plain class="custom-orange" v-if="item.srStatus == '待处理'">{{item.srStatus}}</x-button>
        <x-button
          mini
          plain
          class="custom-blue"
          v-else-if="item.srStatus == '处理中'"
        >{{item.srStatus}}</x-button>
        <x-button
          mini
          plain
          class="custom-gray"
          v-else-if="item.srStatus == '已回复'"
        >{{item.srStatus}}</x-button>
        <x-button
          mini
          plain
          class="custom-green"
          v-else-if="item.srStatus == '已完成'"
        >{{item.srStatus}}</x-button>
      </cell>
    </group>
    <group v-show="serviceType == 1" v-for="(item,index) in invitationList" :key="index">
      <cell
        :title="item.activityName"
        :inline-desc="item.startDate | dateFormat"
        :link="{name:'Article', params:{id: item.activityId, type: 'activity',custNo: custNo}}"
      >
        <p slot="after-title" class="cell-desc">{{item.description}}</p>
        <div class="cell-after-info">
          <span :class="item.status == '已邀约' ? 'status on' : 'status'">{{item.status || '未邀约'}}</span>
          <!--<span :class="item.result == '成功' ? 'checkin on' : 'checkin'">{{item.result == '成功' ? '已到场' : '未到场'}}</span>-->
        </div>
      </cell>
    </group>
    <no-data v-show="serviceType == 0 && feedbackList.length === 0"></no-data>
    <no-data v-show="serviceType == 1 && invitationList.length === 0"></no-data>
  </div>
</template>

<script>
import { ButtonTab, ButtonTabItem, XButton, Cell, Group } from "vux";
import { getFeedbackList, getInvitationList } from "@/api/mymember";
import NoData from "@/components/common/NoData";
export default {
  name: "serviceInfo",
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: { ButtonTab, ButtonTabItem, XButton, Cell, Group, NoData },
  data() {
    return {
      serviceType: 0,
      feedbackList: [],
      invitationList: []
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.switchTabItem(0);
  },
  methods: {
    async getFeedbackList() {
      let { code, data } = await getFeedbackList({ memId: this.custNo });
      code === 200 ? (this.feedbackList = data) : "";
    },
    async getInvitationList() {
      let { code, data } = await getInvitationList({ memId: this.custNo });
      code === 200 ? (this.invitationList = data) : "";
    },
    switchTabItem(e) {
      this.serviceType = e;
      // if (e === 0) {
      //   this.getFeedbackList();
      // } else if (e === 1) {
        this.getInvitationList();
      // }
    }
  }
};
</script>
<style lang="less" scoped>
.member-button-tab {
  padding: 10px 30px;
  background-color: #fff;
  box-sizing: border-box;
}
.cell-desc {
  font-size: 14px;
  color: #5c5c5c;
}
.cell-after-info {
  display: flex;
  .status {
    padding: 0 4px;
    font-size: 12px;
    color: #5c5c5c;
    &.on {
      color: #1f459b;
    }
  }
  .checkin {
    padding: 0 4px;
    font-size: 12px;
    color: #5c5c5c;
    &.on {
      color: #ff6600;
    }
  }
}
.custom-orange {
  border-radius: 99px !important;
  border-color: #ff6600 !important;
  color: #ff6600 !important;
  &:active {
    border-color: rgba(255, 102, 0, 0.6) !important;
    color: rgba(255, 102, 0, 0.6) !important;
    background-color: transparent;
  }
}
.custom-blue {
  border-radius: 99px !important;
  border-color: #037de0 !important;
  color: #037de0 !important;
  &:active {
    border-color: rgba(3, 125, 224, 0.6) !important;
    color: rgba(3, 125, 224, 0.6) !important;
    background-color: transparent;
  }
}
.custom-gray {
  border-radius: 99px !important;
  border-color: #c6c6c6 !important;
  color: #c6c6c6 !important;
  &:active {
    border-color: rgba(198, 198, 198, 0.6) !important;
    color: rgba(198, 198, 198, 0.6) !important;
    background-color: transparent;
  }
}
.custom-green {
  border-radius: 99px !important;
  border-color: #1aad19 !important;
  color: #1aad19 !important;
  &:active {
    border-color: rgba(26, 173, 25, 0.6) !important;
    color: rgba(26, 173, 25, 0.6) !important;
    background-color: transparent;
  }
}
.vux-button-group > a.vux-button-group-current{
  background:rgba(0,202,172,1);
}
//若有两个按钮可删除此行样式进行修改
.vux-button-group > a.vux-button-tab-item-last:after{
  border:none;
}
</style>