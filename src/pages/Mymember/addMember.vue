<template>
  <div>
    <group title="会员信息">
      <x-input
        title="<span class='cardName'>*</span> 会员名称"
        ref="memberName"
        placeholder="请输入客户名称"
        is-type="china-name"
        v-model="formData.memberName"
        required
      ></x-input>
      <selector title="会员性别" :options="genderList" v-model="formData.sex"></selector>
      <x-input
        title="<span class='cardName'>*</span> 手机号码"
        ref="mobile"
        placeholder="请输入手机号码"
        keyboard="number"
        is-type="china-mobile"
        v-model="formData.mobile"
        required
      ></x-input>
      <datetime v-model="formData.birthday" title="生日" :start-date="startDate"></datetime>
    </group>
    <group>
      <x-input
        title="<span class='cardName'>*</span> 短信验证码"
        ref="verificationCode"
        keyboard="number"
        :min="4"
        :max="4"
        v-model="formData.verificationCode"
        required
      >
        <x-button
          slot="right"
          plain
          mini
          class="check-code"
          :disabled="isSendCode"
          @click.native="getCode"
        >
          <span v-show="!isSendCode">发送验证码</span>
          <span v-show="isSendCode">重新获取 {{seconds}}</span>
        </x-button>
      </x-input>
    </group>
    <div class="submit-bar">
      <x-button
        type="primary"
        :show-loading="isStop"
        :disabled="isStop"
        @click.native="submitForm"
      >保存</x-button>
    </div>
  </div>
</template>

<script>
import {
  Group,
  XInput,
  Selector,
  Datetime,
  XButton,
  Confirm,
  TransferDomDirective as TransferDom
} from "vux";
import { addMember, getCode } from "@/api/mymember";
export default {
  name: "addMember",
  directives: {
    TransferDom
  },
  components: { Group, XInput, Selector, Datetime, XButton, Confirm },
  data() {
    return {
      formData: {
        memberName: "",
        sex: "男",
        mobile: "",
        birthday: new Date().Format('YYYY-MM-DD'),
        verificationCode: ""
      },
      genderList: ["男", "女"],
      startDate: "1900-01-01",
      isSendCode: false,
      seconds: 180,
      isStop: false,
      errorKey: ""
    };
  },
  computed: {},
  watch: {},
  created() {
    console.log(this.formData.birthday)
  },
  mounted() {},
  methods: {
    async submitForm() {
      const _this = this;
      if (this.isStop) {
        return;
      }
      this.isStop = true;
      const validate = this.validateForm();
      if (validate) {
        // pass
        // console.log(this.formData)
        // let _res = await addMember({ ...this.formData });
        // console.log({...this.formData})
        if (_res.code === 200) {
          this.$vux.alert.show({
            title: "操作提示",
            content: "添加会员成功",
            onHide() {
              _this.isStop = false;
              _this.resetForm();
              _this.$router.back(-1);
            }
          });
        } else {
          _this.isStop = false;
        }
      } else {
        // error
        this.$vux.toast.show({
          time: 1500,
          type: "warn",
          width: "12em",
          "is-show-mask": true,
          text: "请填写" + this.$refs[this.errorKey].$el.innerText + "! "
        });
        this.isStop = false;
      }
    },
    validateForm() {
      let noerror = true;
      for (const key in this.formData) {
        if (~~!this.formData[key] && !this.$refs[key].valid) {
          this.errorKey = key;
          noerror = false;
          this.$refs[key].focus();
          this.$refs[key].blur();
          return;
        }
      }
      return noerror;
    },
    resetForm() {
      this.formData.sex = "male";
      this.formData.birthday = new Date().Format('YYYY-MM-DD')
      for (const key in this.$refs) {
        this.$refs[key].reset("");
      }
    },
    async getCode() {
      if (this.$refs.mobile.valid) {
        let { data, code, msg } = await getCode({
          mobile: this.formData.mobile
        });
        if (code === 200) {
          this.$vux.toast.show({
            time: 1500,
            text: "发送成功"
          });
          this.isSendCode = true;
          this.seconds = 180;
          this.countDown();
        } else {
          this.$vux.toast.show({
            time: 1500,
            text: "发送失败"
          });
        }
      }
    },
    countDown() {
      this.seconds--;
      if (this.seconds > 0) {
        setTimeout(() => {
          this.countDown();
        }, 1000);
      } else {
        this.isSendCode = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.check-code {
  &[disabled] {
    color: #999999;
  }
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
<style>
  .cardName{
    color: red;
  }

</style>