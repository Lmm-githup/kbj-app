<template>
  <div class="message-index">
    <x-header :left-options="{showBack: false}">
      消息提醒
      <div slot="right">
        <router-link :to="{name: 'custom'}">
          <i class="fa fa-plus-circle" style="color:#f8bb64;font-size:18px" aria-hidden="true"></i>
        </router-link>
      </div>
    </x-header>
    <group class="list">
      <cell
        v-for="(item, index) in messageList"
        :key="index"
        :title="item.remindType"
        @click.native="handleClick(item)"
      >
        <i
          v-if="item.remindTypeCode == 1"
          slot="icon"
          style="color:#749ff4;"
          class="fa fa-credit-card"
          aria-hidden="true"
        ></i>
        <i
          v-if="item.remindTypeCode == 2"
          slot="icon"
          style="color:#f1e38c;"
          class="fa fa-calendar-minus-o"
          aria-hidden="true"
        ></i>
        <i
          v-if="item.remindTypeCode == 3"
          slot="icon"
          style="color:#ee8089"
          class="fa fa-handshake-o"
          aria-hidden="true"
        ></i>
        <i
          v-if="item.remindTypeCode == 4 || item.remindTypeCode == 5"
          slot="icon"
          style="color:#f74c31"
          class="fa fa-outdent"
          aria-hidden="true"
        ></i>
        <i
          v-if="item.remindTypeCode == 6"
          slot="icon"
          style="color:#61bcf1;"
          class="fa fa-medkit"
          aria-hidden="true"
        ></i>
        <i
          v-if="item.remindTypeCode == 7"
          slot="icon"
          style="color:#f2a958;"
          class="fa fa-shopping-cart"
          aria-hidden="true"
        ></i>
        <i
          v-if="item.remindTypeCode == 8"
          slot="icon"
          style="color:#d4237a;"
          class="fa fa-bullhorn"
          aria-hidden="true"
        ></i>
        <i
          v-if="item.remindTypeCode == 9"
          slot="icon"
          style="color:#00bea6;"
          class="fa fa-commenting-o"
          aria-hidden="true"
        ></i>
        <badge v-if="item.memNum" :text="item.memNum"></badge>
      </cell>
    </group>
  </div>
</template>

<script>
import { XHeader, Cell, Group, TransferDom, Badge } from "vux";
import { totalList, getMessageSet, saveMessageSet } from "@/api/message";
import { USER_INFO, MESSAGE_TOTAL, MESSAGE_FLAG } from "@/utils/storage";
import Utils from "@/utils/utils";
const utils = new Utils();
export default {
  name: "message",
  components: {
    XHeader,
    Cell,
    Group,
    Badge
  },
  data() {
    return {
      guideId: "",
      messageList: [],
//    messageTotal: 0,
      flags: null
    };
  },
  methods: {
    handleClick(val) {
      console.log(val);
      let deviceType = utils.deviceType();
      let nums = 0
      let numsTotal = this.$utils.getLocalData(MESSAGE_TOTAL)
      
      if (val.memNum) {
        nums = numsTotal - val.memNum
        this.$utils.setLocalData(MESSAGE_TOTAL, nums);
        if (deviceType == "ios"&& window.iosShare) {
          window.iosShare.readNums(JSON.stringify({ nums: nums }));
        } else if (deviceType == "android" && window.androidShare) {
             window.androidShare.readNums(nums);
          }
      }

      if (val.remindTypeCode == 8) {
        this.$router.push({
          name: "callboard",
          query: { isCheck: true, remindTypeCode: val.remindTypeCode }
        });
      } else if (val.remindTypeCode == 9) {
        this.$router.push({
          name: "chatHistory"
        });
      } else {
        this.$router.push({
          path: "/remindDetails",
          query: { isCheck: true, remindTypeCode: val.remindTypeCode }//把头部导航信息传过去
        });
      }
    },
    async getTotal() {
      try {
        const res = await totalList(this.flags);
        if (+res.code == 200) {
          // console.log(res.data);
          this.messageList = res.data;
        }
      } catch (e) {
        this.$vux.toast.show({
          text: e.msg,
          time: 2000,
          type: "text"
        });
      }
    }
  },
  mounted() {
    getMessageSet().then(res => {
      if (res.code == 200) {
        if (!res.data) {
          this.flags = [1, 1, 1, 1, 1, 1, 1, 1];
          saveMessageSet({ remindSetup: JSON.stringify(this.flags) });
        } else {
          this.flags = JSON.parse(res.data);
        }
        this.getTotal();
      }
    });
  }
};
</script>

<style scoped lang="less">
.message-index {
  height: 100%;
  .list {
    .fa {
      margin-right: 20px;
    }
  }
}
</style>
