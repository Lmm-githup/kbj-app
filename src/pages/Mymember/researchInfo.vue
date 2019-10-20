<template>
  <div>
    <div style="height:50px;margin-bottom:10px;display:none">
      <div class="member-button-tab">
        <button-tab v-model="researchType">
          <button-tab-item>回访调研问卷</button-tab-item>
          <button-tab-item>购物体验问卷</button-tab-item>
          <button-tab-item>活动调研问卷</button-tab-item>
        </button-tab>
      </div>
    </div>
    <group style="margin-bottom:10px;">
      <cell
        :title="'已经做过'+ count +'次问卷调查'"
        :link="{name:'researchLog', params: {custNo: custNo, flag: '1'}}"
      >
        <i
          class="fa fa-pencil-square-o"
          aria-hidden="true"
          slot="icon"
          style="color:#037de0;margin-right:8px;"
        ></i>
      </cell>
      <!-- <cell title="可参加的问卷调查" :link="{name:'researchLog', params: {custNo: custNo, flag: '0'}}">
        <i
          class="fa fa-pencil-square-o"
          aria-hidden="true"
          slot="icon"
          style="color:#037de0;margin-right:8px;"
        ></i>
      </cell> -->
    </group>
  </div>
</template>

<script>
import { ButtonTab, ButtonTabItem, XButton, Cell, Group } from "vux";
import { getResearchInfo } from "@/api/mymember";
export default {
  name: "researchInfo",
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: {
    ButtonTab,
    ButtonTabItem,
    XButton,
    Cell,
    Group
  },
  data() {
    return {
      researchType: 0,
      count: 0
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getResearchInfo();
  },
  methods: {
    async getResearchInfo() {
      let { code, data } = await getResearchInfo({ custNo: this.custNo });
      code === 200 ? (this.count = data.joinNum) : "";
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
</style>