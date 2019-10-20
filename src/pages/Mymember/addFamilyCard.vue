<template>
  <div>
    <group>
      <x-input
        title="<span style='color:red'>*</span> 姓名"
        ref="name"
        placeholder="请输入姓名"
        is-type="china-name"
        v-model="formData.name"
        required
        :disabled="isEdit"
      ></x-input>
      <selector
        title="<span style='color:red'>*</span> 关系"
        :options="shipList"
        placeholder="请选择与本人的关系"
        v-model="formData.ship"
        v-if="isNew"
      ></selector>
      <x-input
        title="关系"
        ref="ship"
        disabled
        placeholder="与本人的关系"
        is-type="china-name"
        v-model="formData.ship"
        required
        v-else
      ></x-input>
      <x-input
        title="<span style='color:red'>*</span> 手机号码"
        ref="phone"
        placeholder="请输入手机号码"
        keyboard="number"
        is-type="china-mobile"
        v-model="formData.phone"
        required
        :disabled="isEdit"
      ></x-input>
      <checklist
        label-position="left"
        :options="['使用积分权']"
        v-model="ispointsPermission"
        @on-change="pointsPermission"
        :max="1"
        :disabled="isEdit"
      ></checklist>
      <!--<checklist
        label-position="left"
        :options="['优惠券使用权']"
        v-model="isvoucherPermission"
        @on-change="voucherPermission"
        :max="1"
      ></checklist>-->
    </group>
    <div class="submit-bar" v-if="permission && !isEdit">
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
  Checklist,
  XButton,
  Selector,
  Confirm,
  TransferDomDirective as TransferDom
} from "vux";
import { addFamily, editFamily } from "@/api/mymember";
import { mapState } from "vuex";
export default {
  name: "addFamilyCard",
  directives: {
    TransferDom
  },
  props: {
    custNo: {
      type: String,
      required: true
    },
    item: {
      type: String
    }
  },
  components: { Group, XInput, Checklist, XButton, Confirm, Selector },
  data() {
    return {
      formData: {
        custNo: "",
        name: "",
        ship: "",
        phone: "",
        pointsPermission: ""
        // voucherPermission: ""
      },
      editFormData: {
        cardNum: "",
        familyId: "",
        name: "",
        phone: "",
        pointsPermission: "",
        ship: ""
      },
      ispointsPermission: [],
      // isvoucherPermission: [],
      shipList: [
        "妻子",
        "丈夫",
        "儿子",
        "女儿",
        "父亲",
        "母亲",
        "爷爷",
        "奶奶",
        "其他"
      ],
      isStop: false,
      isEdit: false,
      isNew: false
    };
  },
  computed: {
    ...mapState({
      permission: state => state.mymember.permission
    })
  },
  watch: {
    item: {
      handler: function(val) {
        if (val) {
          let item = JSON.parse(val);
          if (item.phone) {
            this.isEdit = true;
            this.editFormData.cardNum = item.cardNum;
            this.editFormData.familyId = item.familyId;
          } else {
            this.isEdit = false;
          }
          this.formData.custNo = item.custNo;
          this.formData.name = item.name;
          this.formData.ship = item.ship;
          this.formData.phone = item.phone;
          this.formData.pointsPermission = item.pointsPermission;
          //this.formData.voucherPermission = item.voucherPermission;
          if (item.pointsPermission === "Y") {
            this.ispointsPermission = ["使用积分权"];
          }
        } else {
          this.formData.custNo = this.custNo;
          this.isNew = true;
        }
      },
      immediate: true
    }
  },
  created() {},
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
        var _res;
        if (this.isEdit) {
          // edit
          this.editFormData.name = this.formData.name;
          this.editFormData.ship = this.formData.ship;
          this.editFormData.phone = this.formData.phone;
          this.editFormData.pointsPermission = this.formData.pointsPermission;
          _res = await editFamily({ ...this.editFormData });
        } else {
          // add
          if (this.isNew && (!this.formData.ship || this.formData.ship == "")) {
            this.$vux.toast.show({
              time: 1500,
              type: "warn",
              width: "12em",
              "is-show-mask": true,
              text: "请选择与本人的关系"
            });
            _this.isStop = false;
            return;
          }
          _res = await addFamily({ ...this.formData });
        }

        if (_res.code === 200) {
          this.$vux.alert.show({
            title: "操作提示",
            content: "编辑成员成功",
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
          text: "请填写完整的信息"
        });
        this.isStop = false;
      }
    },
    validateForm() {
      let noerror = true;
      for (const key in this.formData) {
        if (
          (key == "name" || key == "phone") &&
          ~~!this.formData[key] &&
          !this.$refs[key].valid
        ) {
          noerror = false;
          this.$refs[key].focus();
          this.$refs[key].blur();
        }
      }
      return noerror;
    },
    resetForm() {
      this.ispointsPermission = [];
      // this.isvoucherPermission = [];
      for (const key in this.$refs) {
        this.$refs[key].reset("");
      }
    },
    pointsPermission(val) {
      if (val.length === 1) {
        this.formData.pointsPermission = "Y";
      } else {
        this.formData.pointsPermission = "N";
      }
    },
    voucherPermission(val) {
      if (val.length === 1) {
        this.formData.voucherPermission = "Y";
      } else {
        this.formData.voucherPermission = "N";
      }
    }
  }
};
</script>
<style lang="less" scoped>
.submit-bar {
  margin-top: 150px;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}
</style>