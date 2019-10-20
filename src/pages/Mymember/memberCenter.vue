<template>
  <div>
    <group>
      <cell title="基本信息" :link="{name:'memberBasic'}">
        <i
          class="fa fa-user-circle"
          aria-hidden="true"
          slot="icon"
          style="color:#ffc64c;margin-right:8px;"
        ></i>
      </cell>
      <cell title="维系记录" :link="{name:'MemberKeepTask'}">
        <i
          class="fa fa-tasks"
          aria-hidden="true"
          slot="icon"
          style="color:#1170ca;margin-right:8px;"
        ></i>
      </cell>
      <cell title="病症信息" :link="{name:'illnessInfo'}">
        <i
          class="fa fa-list-alt"
          aria-hidden="true"
          slot="icon"
          style="color:#5eb4e6;margin-right:8px;"
        ></i>
      </cell>
      <cell title="健康信息" :link="{name:'healthInfo'}">
        <i
          class="fa fa-user-md"
          aria-hidden="true"
          slot="icon"
          style="color:#ff7e00;margin-right:8px;"
        ></i>
      </cell>
      <cell title="药学信息" :link="{name:'pharmacyService', params: {custNo: custNo}}">
        <i
          class="fa fa-medkit"
          aria-hidden="true"
          slot="icon"
          style="color:#cce3dc;margin-right:8px;"
        ></i>
      </cell>
      <!-- <cell title="服务信息" :link="{name:'serviceInfo'}">
        <i
          class="fa fa-handshake-o"
          aria-hidden="true"
          slot="icon"
          style="color:#b8a157;margin-right:8px;"
        ></i>
      </cell> -->
      <cell title="问卷信息" :link="{name:'researchInfo'}">
        <i
          class="fa fa-calendar-check-o"
          aria-hidden="true"
          slot="icon"
          style="color:#8fb88b;margin-right:8px;"
        ></i>
      </cell>
      <cell title="家庭卡信息" @click.native="checkFamily" is-link>
        <i
          class="fa fa-id-card-o"
          aria-hidden="true"
          slot="icon"
          style="color:#ff6600;margin-right:8px;"
        ></i>
      </cell>
      <cell title="慢病建档" :link="{name:'recordInfo'}">
        <i
          class="fa fa-archive"
          aria-hidden="true"
          slot="icon"
          style="color:#63b6e7;margin-right:8px;"
        ></i>
      </cell>
      <div v-transfer-dom>
        <confirm v-model="showConfirm" title="您还没有开通家庭卡" @on-confirm="openFamily">
          <p style="text-align:center;">需要现在开通吗?</p>
        </confirm>
      </div>
    </group>
  </div>
</template>

<script>
import { Cell, Group, Confirm, TransferDomDirective as TransferDom } from "vux";
import { checkFamily, openFamily } from "@/api/mymember";
export default {
  name: "memberCenter",
  directives: {
    TransferDom
  },
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: { Cell, Group, Confirm, TransferDom },
  data() {
    return {
      showConfirm: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async checkFamily() {
      // 检查是否开通开庭卡
      let { code, data } = await checkFamily({ custNo: this.custNo });
      code === 200
        ? data !== null
          ? this.toFamilyMember('check')
          : (this.showConfirm = true)
        : "";
    },
    async openFamily() {
      // 开通家庭卡
      // test
      //let data = "1-29838d";
      //this.toFamilyMember(data);
      let { code, data, msg } = await openFamily({ custNo: this.custNo });
      this.showConfirm = false;
      code === 200
        ? this.toFamilyMember('add')
        : this.$vux.toast.show({
            time: 1500,
            type: "warn",
            text: "开通失败"
          });
    },
    async toFamilyMember(type) {
      if (type === 'check') {
        this.$router.push({ name: "familyMember", params: { custNo: this.custNo } });
        return
      }
      let { code, data } = await checkFamily({ custNo: this.custNo });

      if (code === 200) {
        this.$router.push({ name: "familyMember", params: { custNo: this.custNo } });
      } else {
        this.$vux.toast.show({
          time: 1500,
          type: "warn",
          text: "未查询到信息,请重试"
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>

</style>