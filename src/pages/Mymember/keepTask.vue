<template>
  <div style="padding-top:10px;">
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
</template>

<script>
import {
  Group,
  XSwitch,
  LoadMore,
  TransferDomDirective as TransferDom
} from "vux";
import { mapState } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import { getMemberTask, editTaskStatus } from "@/api/mymember";
import NoData from "@/components/common/NoData";
export default {
  name: "MemberKeepTask",
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
    Group,
    XSwitch,
    InfiniteLoading,
    LoadMore,
    NoData
  },
  data() {
    return {
      memberTaskList: [],
      pageSize: 10,
      currentPage: 1,
      List: [],
      hasMore: true,
      infiniteId: +new Date()
    };
  },
  computed: {
    ...mapState({
      pdtNum: state => state.mymember.pdtNum
    })
  },
  watch: {},
  created() {},
  mounted() {
    this.getMemberTask();
  },
  methods: {
    async getMemberTask() {
      let { code, data } = await getMemberTask({ custNo: this.custNo });
      code === 200 ? (this.memberTaskList = data) : "";
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
    }
  }
};
</script>
<style lang="less" scoped>
@import "~vux/src/styles/close";
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
</style>