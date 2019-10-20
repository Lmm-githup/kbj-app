<template>
  <div>
    <group label-width="5em" v-if="memberInfo">
      <cell title="手机">{{memberInfo.mobile | telFormat}}</cell>
      <cell title="年龄" :value="memberInfo.age || '未知'"></cell>
      <cell title="邮箱">{{memberInfo.email || '未知'}}</cell>
      <cell title="身份证号">{{memberInfo.idNumber | idCardFormat}}</cell>
      <!-- <cell title="文化程度" :value="memberInfo.education || '无'"></cell> -->
      <cell title="职业" :value="memberInfo.job || '无'"></cell>
      <cell title="入会日期">{{memberInfo.joinTime ? memberInfo.joinTime.substring(0, 10) : ''}}</cell>
      <!-- <cell title="地址" :value="memberInfo.address || '无'"></cell> -->
    </group>
    <div class="submit-bar">
      <x-button
        type="primary"
        @click.native="formDataInit();showEditPop = true;"
      >修改</x-button>
    </div>
    <div v-transfer-dom>
      <popup v-model="showEditPop" height="100%">
        <popup-header
          left-text="取消"
          right-text="确认"
          title="修改会员信息"
          :show-bottom-border="false"
          @on-click-left="showEditPop = false"
          @on-click-right="editMember"
        ></popup-header>
        <div v-if="memberInfo">
          <group>
            <x-input title="名称" ref="memberName" v-model="formData.memberName" is-type="china-name"></x-input>
            <selector title="性别" :options="['男', '女']" v-model="formData.sex"></selector>
            <x-input
              title="身份证"
              ref="idNumber"
              placeholder="患者身份证号"
              keyboard="number"
              :min="15"
              :max="18"
              v-model="formData.idNumber"
              :disabled="!!~~memberInfo.idNumber"
            ></x-input>
            <datetime
              title="生日"
              :min-year="1900"
              v-model="formData.birthday"
              :readonly="memberInfo.birthday != '' || memberInfo.readonly != null"
            ></datetime>
            <x-input title="邮箱" ref="email" v-model="formData.email" is-type="email"></x-input>
            <x-input title="职业" v-model="formData.job" :max="50"></x-input>
          </group>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import {
  Cell,
  Group,
  TransferDom,
  PopupHeader,
  Popup,
  Selector,
  XInput,
  XButton,
  Datetime
} from "vux";
import { mapState, mapActions } from "vuex";
import { editMember, getMemberInfo } from "@/api/mymember";
export default {
  directives: {
    TransferDom
  },
  name: "memberBasic",
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: {
    Cell,
    Group,
    TransferDom,
    PopupHeader,
    Popup,
    Selector,
    XInput,
    XButton,
    Datetime
  },
  data() {
    return {
      showEditPop: false,
      formData: {
        memberName: "",
        sex: "",
        birthday: "",
        idNumber: "",
        job: "",
        email: ""
      },
      realFormData: {
        memberName: "",
        sex: "",
        birthday: "",
        idNumber: "",
        job: "",
        email: ""
      },
      isStop: false
    };
  },
  computed: {
    ...mapState({
      permission: state => state.mymember.permission,
      memberInfo: state => state.mymember.memberInfo
    })
  },
  watch: {},
  created() {},
  mounted() {
    this.formDataInit();
  },
  methods: {
    ...mapActions(["SET_EDITMEMBER"]),
    async getInfo() {
      let { data } = await getMemberInfo({ custNo: this.custNo });
      this.SET_EDITMEMBER(data);
    },
    async editMember() {
      const _this = this;
      if (this.isStop) {
        return;
      }
      this.isStop = true;
      const validate = this.validateForm();
      if (validate) {
        // pass
        if (this.formData.memberName == this.memberInfo.memberName) {
          this.realFormData.memberName = "";
        } else {
          if (this.formData.memberName) {
            this.realFormData.memberName = this.formData.memberName;
          } else {
            this.realFormData.memberName = "NULL";
          }
        }
        if (this.formData.sex == this.memberInfo.sex) {
          this.realFormData.sex = "";
        } else {
          if (this.formData.sex) {
            this.realFormData.sex = this.formData.sex;
          } else {
            this.realFormData.sex = "NULL";
          }
        }
        if (this.formData.birthday == this.memberInfo.birthday) {
          this.realFormData.birthday = "";
        } else {
          if (this.formData.birthday) {
            if (this.memberInfo.idNumber) {
              this.realFormData.birthday = "";
            } else {
              this.realFormData.birthday = this.formData.birthday;
            }
          } else {
            this.realFormData.birthday = "NULL";
          }
        }
        if (this.formData.idNumber == this.memberInfo.idNumber) {
          this.realFormData.idNumber = "";
        } else {
          if (this.formData.idNumber) {
            if (this.memberInfo.idNumber) {
              this.realFormData = "";
            } else {
              this.realFormData.idNumber = this.formData.idNumber;
            }
          } else {
            this.realFormData.idNumber = "NULL";
          }
        }
        if (this.formData.job == this.memberInfo.job) {
          this.realFormData.job = "";
        } else {
          if (this.formData.job) {
            this.realFormData.job = this.formData.job;
          } else {
            this.realFormData.job = "NULL";
          }
        }
        if (this.formData.email == this.memberInfo.email) {
          this.realFormData.email = "";
        } else {
          if (this.formData.email) {
            this.realFormData.email = this.formData.email;
          } else {
            this.realFormData.email = "NULL";
          }
        }

        let { code, data } = await editMember({ ...this.realFormData });
        if (code === 200) {
          this.isStop = false;
          this.showEditPop = false;
          this.$vux.toast.show({
            time: 1500,
            type: "success",
            width: "12em",
            "is-show-mask": true,
            text: "修改成功"
          });
          this.getInfo();
        } else {
          this.isStop = false;
        }
      } else {
        // error
        this.isStop = false;
        this.$vux.toast.show({
          time: 1500,
          type: "warn",
          width: "12em",
          "is-show-mask": true,
          text: "请填写正确的信息"
        });
      }
    },
    formDataInit() {
      if (!this.memberInfo) return;
      this.realFormData.crmId = this.custNo;
      this.formData.memberName = this.memberInfo.memberName;
      this.formData.sex = this.memberInfo.sex;
      this.formData.birthday = this.memberInfo.birthday;
      this.formData.idNumber = this.memberInfo.idNumber;
      this.formData.job = this.memberInfo.job;
      this.formData.email = this.memberInfo.email;
      this.realFormData.mobile = "";
    },
    validateForm() {
      let noerror = true;
      for (const key in this.formData) {
        if (this.$refs[key] && !this.$refs[key].valid) {
          noerror = false;
          this.$refs[key].focus();
          this.$refs[key].blur();
        }
      }
      return noerror;
    }
  }
};
</script>
<style lang="less" scoped>
.submit-bar {
  margin-top: 30px;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}
.weui-btn_primary{
  background:rgba(0,202,172,1)
}
</style>