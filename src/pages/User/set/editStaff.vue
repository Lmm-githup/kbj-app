<template>
  <div class="staff-index">
    <x-header :left-options="{showBack: true,backText: ''}">人员信息修改</x-header>
    <group>
      <x-input text-align="right" v-model="addFrom.userName" required>
        <span slot="label" class="input-right-solt">
          <span class="input-right-solt-required">*</span>
          真实姓名
        </span>
      </x-input>
      <cell title="所属部门" :value="orgNoName" is-link @click.native="goOrgList" required>
        <span slot="title" class="input-right-solt">
          <span class="input-right-solt-required">*</span>
          所属部门
        </span>
      </cell>
      <cell title="职位" :value="positionNoName" is-link @click.native="goPositionList" required>
        <span slot="title" class="input-right-solt">
          <span class="input-right-solt-required">*</span>
          职位
        </span>
      </cell>
      <x-input text-align="right" title="手机号" v-model="addFrom.mobile"></x-input>
      <x-input text-align="right" title="邮箱" v-model="addFrom.email"></x-input>
    </group>
    <footer-button text="保存" @click="verify"></footer-button>
  </div>
</template>

<script>
import { XHeader, Cell, Group, XInput } from "vux";
import FooterButton from "@/components/common/FooterButton";
import { updateStaff } from "@/api/user";
export default {
  name: "editStaff",
  components: {
    XHeader,
    Cell,
    Group,
    XInput,
    FooterButton
  },
  data() {
    return {
      positionNoName: "",
      orgNoName: "",
      addFrom: {
        userNo: "",
        userName: "",
        orgNo: "",
        positionNo: "",
        mobile: "",
        email: ""
      }
    };
  },
  computed: {},
  watch: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "orgList" || from.name == "positionList") {
        console.log(vm);
        vm.addFrom = { ...vm.$store.state.user.staffFrom };
        vm.orgNoName = vm.$store.state.user.addOrg.orgNoName;
        vm.addFrom.orgNo = vm.$store.state.user.addOrg.orgNo;
        vm.positionNoName = vm.$store.state.user.addPosition.positionName;
        vm.addFrom.positionNo = vm.$store.state.user.addPosition.rowNo;
      } else {
        vm.$store.commit("ADD_ORG", {});
        vm.$store.commit("ADD_POSITION", {});
      }
    });
  },
  methods: {
    goPositionList() {
      this.saveUserInfo();
      this.$router.push({ path: "/positionList" });
    },
    goOrgList() {
      this.saveUserInfo();
      this.$router.push({ path: "/orgList" });
    },
    verify() {
      if (!this.addFrom.userName) {
        this.$vux.toast.text("请填写真实姓名!");
        return;
      } else if (!this.orgNoName) {
        this.$vux.toast.text("请选择所属部门!");
        return;
      } else if (!this.positionNoName) {
        this.$vux.toast.text("请选择职位!");
        return;
      }
      this.save();
    },
    save() {
      delete this.addFrom.comfirmLoginPwd;
      updateStaff({ ...this.addFrom }).then(res => {
        if (+res.code === 200) {
          let _this = this;
          this.$vux.toast.show({
            text: "修改成功!",
            time: 1000,
            type: "text",
            onHide() {
              _this.$router.go(-1);
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
    saveUserInfo() {
      this.$store.commit("SAVE_STAFF_FROM", this.addFrom);
      this.$store.commit("ADD_ORG", {
        orgNoName: this.orgNoName,
        orgNo: this.addFrom.orgNo
      });
      this.$store.commit("ADD_POSITION", {
        positionName: this.positionNoName,
        rowNo: this.addFrom.positionNo
      });
    }
  },
  beforeDestroy() {},
  mounted() {
    this.addFrom.userNo = this.$route.query.userNo;
    this.addFrom.userName = this.$route.query.userName;
    this.orgNoName = this.$route.query.orgNoName;
    this.positionNoName = this.$route.query.positionNoName;
    this.addFrom.orgNo = this.$route.query.orgNo;
    this.addFrom.positionNo = this.$route.query.positionNo;
    this.addFrom.mobile = this.$route.query.mobile;
    this.addFrom.email = this.$route.query.email;
  }
};
</script>

<style scoped lang="less">
.staff-index {
  .input-right-solt {
    position: relative;
    padding-left: 8px;
    > .input-right-solt-required {
      color: red;
      position: absolute;
      //top: -9px;
      left: -1px;
    }
  }
  .login-btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 10vh;
    margin: 0 auto;
    margin-top: 40px;
    width: 80%;
    background: rgba(29, 69, 155, 1);
    text-align: center;
    font-size: 16px;
    padding: 7px 12px;
    color: #fff;
    border-radius: 10px;
  }
}
</style>
