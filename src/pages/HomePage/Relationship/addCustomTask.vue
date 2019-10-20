<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}">
      自定义维系任务
    </x-header>
    <van-cell-group class="mt-10">
      <van-field v-model="formData.name" placeholder="请输入维系名称" label="维系名称"/>
      <van-field 
        v-model="formData.dateStart" 
        right-icon="calender-o" 
        label="维系开始时间"
        @click="showPopupDateStart = true"
        @click-right-icon="showPopupDateStart = true"/>
      <van-field 
        v-model="formData.dateEnd" 
        right-icon="calender-o" 
        label="维系结束时间" 
        @click="showPopupDateEnd = true"
        @click-right-icon="showPopupDateEnd = true"/>
      <!-- <van-cell title="添加维系会员" is-link @click="shadeFlag = true"/> -->
    </van-cell-group>
    <van-cell-group class="mt-10" style="text-align: center;background: transparent;">
      <van-button type="primary" class="submit-btn" @click="confirmDispatch">提交</van-button>
    </van-cell-group>
    <div v-transfer-dom>
      <popup v-model="showPopupDateStart">
        <datetime-view v-model="dateStart"></datetime-view>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showPopupDateEnd">
        <datetime-view v-model="dateEnd"></datetime-view>
      </popup>
    </div>
     <!-- 添加维系会员 遮罩 -->
    <div class="shade" v-show="shadeFlag">
      <div>
        <div class="top">
          <span></span>
          <span>添加维系会员</span>
          <a class="close-icon" @click="shadeFlag = false">×</a>
        </div>
        <div class="center">
          <div class="item" v-for="(item, index) in memberData.list" :key="index">
            <van-checkbox checked-color="#0076ff" v-model="item.selectValue"></van-checkbox>

            <div class="info">
              <p>
                <span>
                  {{item.memberName}} 
                  <span class="fa fa-mars text-danger text-bold" v-if="item.sex === '女'"></span>
                  <span class="fa fa-venus text-green text-bold" v-else></span>
                  <span class="text-normal">{{item.memberGrade}}</span>
                  </span>
                <span class="van-icon van-icon-arrow van-cell__right-icon"></span>
              </p>
              <p style="margin: 10px 0;">
                <span>消费金额：</span>
                <span class="flex-1">{{item.totalAmount || 0}}</span>
              </p>
              <p>
                <span>标签</span>
                <span class="flex-1 text-warning">{{item.memTag}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <van-checkbox checked-color="#0076ff" v-model="selectAll">全选</van-checkbox>
        <van-button type="info" @click="confirmDispatch">添加</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { XHeader, Tab, TabItem, DatetimeView, Popup, TransferDom } from "vux";
import { Field, Cell, CellGroup, DatetimePicker, Button, Checkbox, Radio } from 'vant';
Vue.use(Field)
  .use(Cell)
  .use(CellGroup)
  .use(DatetimePicker)
  .use(Button)
  .use(Checkbox)
  .use(Radio)
import { Validator } from '@/utils/Validator'
// import { queryStaffList } from "@/api/user";
import { getList, addTask , newAdd } from "@/api/mymember";
import { datefmt } from '@/utils/common';
export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    Popup,
    DatetimeView
  },
  directives: {
    TransferDom
  },
  data: () => ({
    formData: {
      name: '',
      dateStart: datefmt(new Date(), 'YYYY-MM-DD'),
      dateEnd: datefmt(new Date(), 'YYYY-MM-DD')
    },
    dateStart: '',
    dateEnd: '',
    showPopupDateStart: false,
    showPopupDateEnd: false,
    shadeFlag: false,
    memberData: {
      list: [],
      paginator: {}
    },
    preSelect: [],
    selectAll: false
  }),
  watch: {
    dateStart(newVal) {
      this.formData.dateStart = newVal
    },
    dateEnd(newVal) {
      this.formData.dateEnd = newVal
    },
    selectAll(newVal) {
      this.memberData.list.forEach(item => {
        item.selectValue = newVal
      })
    },
    shadeFlag(newVal) {
      if (!newVal) {
        // this.preSelect = 
      }
    }
  },
  methods: {
    validatorForm({ name, dateStart, dateEnd }) {
      let validator = new Validator()
      validator.add(name, [
        {strategy: 'isNoEmpty', errorMsg: '输入维系名称！'}
      ])
      validator.add(dateStart, [
        {strategy: 'isNoEmpty', errorMsg: '选择维系开始时间！'},
        {strategy: 'isDate', errorMsg: '选择正确的时间！'}
      ])
      validator.add(dateEnd, [
        {strategy: 'isNoEmpty', errorMsg: '选择维系结束时间！'},
        {strategy: 'isDate', errorMsg: '选择正确的时间！'}
      ])
      return validator.start()
    },
    submitForm() {
      let { name, dateStart, dateEnd, memberList } = this.formData
      let errorMsg = this.validatorForm({ name, dateStart, dateEnd, memberList })
      if (errorMsg) {
        this.$vux.toast.show({
          text: errorMsg,
          time: 2000,
          type: "text"
        })
        return
      }

    },
    getMemberData() {
      getList({}).then(res => {
        if (res.code === 200) {
          let { list, paginator } = res.data;
          this.memberData.list = list.map(item => {
            item.selectValue = false
            return item
          })
          this.memberData.paginator = paginator
        }
      });
    },
    confirmDispatch() {
      let { name, dateStart, dateEnd } = this.formData
      let errorMsg = this.validatorForm({ name, dateStart, dateEnd })
      if (errorMsg) {
        this.$vux.toast.show({
          text: errorMsg,
          time: 2000,
          type: "text"
        })
        return
      }
      // let selectData = this.memberData.list.filter(item => item.selectValue)
      // if (selectData.length === 0) {
      //   this.$vux.toast.show({
      //     text: '请至少选择一个会员！',
      //     time: 2000,
      //     type: "text"
      //   })
      //   return
      // }
      // let customerRelaServiceDtoList = selectData.map(({
      //   memberName,
      //   custNo,
      //   mobile,
      //   sex,
      //   userId,
      //   storeId,
      //   taskStatus,
      //   callFlag,
      //   taskResult
      // }) => {
      //   return {
      //     memberName,
      //     custNo,
      //     mobile,
      //     sex,
      //     userId,
      //     storeId,
      //     taskStatus,
      //     callFlag,
      //     taskResult
      //   }
      // })
      newAdd({
        relaName: name,
        startDate: dateStart,
        endDate: dateEnd,
        type: 1
      }).then(res => {
        if(res.code === 200) {
          this.$vux.toast.show({
            text: '添加成功',
            time: 2000,
            type: "text"
          })
          this.$router.back(-1)
        }
      })
    }
  },
  created() {
    this.getMemberData()
  },
}
</script>

<style lang="less" scoped>
.mt-10 {
  margin-top: 10px;
}
.submit-btn {
  width: 80%;
  height: 36px;
  line-height: 36px;
  background-color: rgba(0,202,172,1);
  //border-color: #0076ff;
}
.shade {
  position: fixed;
  z-index: 999;
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
    max-height: 550px;
    overflow: auto;
    .item {
      padding: 10px;
      background-color: #fff;
      border-bottom: 1px solid #dfdfdf;
      display: flex;
      align-items: center;
      font-weight: 700;
      .info {
        flex: 1;
        margin-left: 10px;
        >p {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          font-size: 13px;
          color: #333;
        }
      }
    }
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    padding: 10px 20px;
    text-align: center;
    /deep/ .van-button {
      width: 20%;
      height: 28px;
      line-height: 28px;
      border-radius: 20px;
      background: #fff;
      color: #F39716;
      border-color: #F39716;
    }
  }
}
.text-green {
  color: #5ac061;
}
.text-danger {
  color: #D4237A;
}
.text-warning {
  color: #F39716;
}
.text-bold {
  font-weight: 700;
}
.text-normal {
  font-weight: 400;
}
.flex-1 {
  flex: 1;
  margin-left: 10px;
  text-align: right;
}
</style>
