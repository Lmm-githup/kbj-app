<template>
  <div class="inquire">
    <group class="inquire-item vux-1px-b">
      <selector
        title="会员状态："
        :value-map="['id', 'name']"
        :options="statusList"
        v-model="fromData.status"
      ></selector>
      <div class="inquire-tips">【一次消费时长】： 活跃会员：≤30天；
        <br>【次活跃会员】：31至60天；
        <br>【沉默会员】：61至120天；
        <br>【休眠会员】：121至180天；
        <br>【预流失会员】：181至365天；
        <br>【已流失会员】：>365天。
      </div>
      <cell title="会员积分：">
        <div class="inquire-input-group">
          <x-input type="number" placeholder="min" v-model="fromData.integralMin"></x-input>
          <span class="line"></span>
          <x-input type="number" placeholder="max" v-model="fromData.integralMax"></x-input>
          <span class="unit">分</span>
        </div>
      </cell>
      <x-input title="商品：" type="number" v-model="fromData.gid"></x-input>
      <datetime title="最近消费时间：" v-model="fromData.recent"></datetime>
      <x-input title="医保余额：" type="number" v-model="fromData.over">
        <span slot="right" class="unit">元</span>
      </x-input>
    </group>
    <div class="submit-bar">
      <x-button
        type="primary"
        :show-loading="isStop"
        :disabled="isStop"
        @click.native="submitForm"
      >查询</x-button>
    </div>
  </div>
</template>

<script>
import { Group, Cell, Selector, XInput, Datetime, XButton } from "vux";

import { mapState, mapActions } from "vuex";
export default {
  name: "inquireMember",
  components: {
    Group,
    Cell,
    Selector,
    XInput,
    Datetime,
    XButton
  },
  data() {
    return {
      statusList: [
        { id: 1, name: "活跃" },
        { id: 2, name: "次活跃" },
        { id: 3, name: "沉默" },
        { id: 4, name: "休眠" },
        { id: 5, name: "预流失会员" },
        { id: 6, name: "已流失会员" },
        { id: 7, name: "冻结" }
      ],
      isStop: false,
      fromData: {
        status: 1,
        integralMin: "",
        integralMax: "",
        gid: "",
        recent: "",
        over: ""
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$router.push({
        name: "searchMember"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.inquire-tips {
  font-size: 12px;
  padding: 0 15px 10px 15px;
  color: #5c5c5c;
}
.inquire-input-group {
  display: flex;
  align-items: center;
  /deep/ .weui-cell {
    width: 60px;
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
  margin-top: 150px;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}
.weui-btn_primary{
  background:rgba(0,202,172,1)
}
</style>