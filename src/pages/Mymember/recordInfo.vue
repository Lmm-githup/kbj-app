<template>
  <div>
    <group title="基本信息">
      <x-input
        title="姓名"
        ref="name"
        placeholder="患者真实姓名"
        is-type="china-name"
        v-model="formData.name"
      ></x-input>
      <selector title="性别" :options="genderList" v-model="formData.sex"></selector>
      <x-input title="年龄" placeholder="患者年龄" keyboard="number" v-model="formData.age"></x-input>
      <x-input
        title="联系电话"
        ref="phone"
        placeholder="患者手机号"
        keyboard="number"
        is-type="china-mobile"
        v-model="formData.phone"
        :required="true"
      ></x-input>
      <x-input
        title="身份证"
        ref="isNo"
        placeholder="患者身份证号"
        keyboard="number"
        :min="15"
        :max="18"
        v-model="formData.isNo"
        :required="true"
      ></x-input>
      <x-address
        title="区域"
        v-model="regionName"
        :list="addressData"
        @on-shadow-change="onShadowChange"
        @on-hide="logHide"
      ></x-address>
      <x-input title="街道信息" placeholder="请输入街道信息" v-model="formData.street"></x-input>
      <x-input title="详细地址" placeholder="请输入详细地址" v-model="formData.address"></x-input>
    </group>
    <group title="疾病信息">
      <x-input
        title="确诊疾病"
        ref="confIllness"
        placeholder="请输入确诊疾病"
        v-model="formData.confIllness"
        :required="true"
      ></x-input>
      <datetime
        v-model="formData.confTime"
        title="确诊时间"
        :start-date="startDate"
        clear-text="today"
        @on-clear="setToday"
        :required="true"
      ></datetime>
      <selector title="家族病史" :options="familyHisList" v-model="formData.familyHis"></selector>
      <checker
        v-model="familyHisRole"
        type="checkbox"
        default-item-class="check-item"
        selected-item-class="check-item-selected"
      >
        <checker-item :value="item" v-for="(item, index) in roleList" :key="index">{{item.value}}</checker-item>
      </checker>
      <selector title="过敏史" :options="familyHisList" v-model="formData.allergy"></selector>
      <x-input
        title="药品"
        placeholder="请输入过敏药品(50字)"
        :max="50"
        v-model="formData.drug"
        v-show="formData.allergy == 'Y'"
      ></x-input>
      <x-input
        title="食物吸入物"
        placeholder="请输入过敏食物吸入物(50字)"
        :max="50"
        v-model="formData.food"
        v-show="formData.allergy == 'Y'"
      ></x-input>
    </group>
    <group>
      <selector title="是否做过手术" :options="familyHisList" v-model="formData.ops"></selector>
      <x-input title="手术名称" placeholder="请输入手术名称" v-model="formData.opsName"></x-input>
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
  XAddress,
  XInput,
  Selector,
  Datetime,
  XButton,
  Checker,
  CheckerItem,
  Confirm,
  TransferDomDirective as TransferDom
} from "vux";
import { USER_INFO } from "@/utils/storage";
import addressData from "@/assets/addressData.json";
import { addRecord, getRecord } from "@/api/mymember";
export default {
  name: "recordInfo",
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
    XAddress,
    XInput,
    Selector,
    Datetime,
    XButton,
    Checker,
    CheckerItem,
    Confirm
  },
  data() {
    return {
      userInfo: {},
      regionVal: [],
      regionName: [],
      region: [],
      addressData: addressData,
      formData: {
        name: "",
        sex: "未知",
        age: "",
        phone: "",
        isNo: "",
        province: "",
        city: "",
        district: "",
        street: "",
        address: "",
        confIllness: "",
        confTime: "",
        familyHis: "",
        allergy: "",
        drug: "",
        food: "",
        ops: "",
        opsName: ""
      },
      genderList: ["男", "女"],
      familyHisList: [{ key: "Y", value: "有" }, { key: "N", value: "无" }],
      roleList: [
        {
          key: "father",
          value: "父亲"
        },
        {
          key: "mother",
          value: "母亲"
        },
        {
          key: "borSister",
          value: "兄弟姐妹"
        },
        {
          key: "other",
          value: "其他"
        }
      ],
      familyHisRole: [],
      startDate: "1970-01-01",
      isStop: false
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.userInfo = this.$utils.getLocalData(USER_INFO, true);
    this.getRecord();
  },
  methods: {
    async getRecord() {
      let { code, data } = await getRecord({ custNo: this.custNo });
      if (code === 200) {
        let newData = data;
        newData.confTime = this.dateFmt(newData.confTime, "YYYY-MM-DD");
        delete newData.hous;
        delete newData.storeName;
        this.formData = { ...newData };
        // this.formData.name = data.name
        // this.formData.sex = data.sex
        // this.formData.age = data.age
        // this.formData.phone = data.phone
        // this.formData.isNo = data.isNo
        // this.formData.province = data.province
        // this.formData.city = data.city
        // this.formData.district = data.district
        // this.formData.street = data.street
        // this.formData.address = data.address
        // this.formData.confIllness = data.confIllness
        // this.formData.confTime = data.confTime
        // this.formData.familyHis = data.familyHis
        // this.formData.allergy = data.allergy
        // this.formData.drug = data.drug
        // this.formData.food = data.food
        // this.formData.ops = data.ops
        // this.formData.opsName = data.opsName
        this.region = [data.province, data.city, data.district];
        if (data.father == "Y") {
          this.familyHisRole.push({ key: "father", value: "父亲" });
        }
        if (data.mother == "Y") {
          this.familyHisRole.push({ key: "mother", value: "母亲" });
        }
        if (data.borSister == "Y") {
          this.familyHisRole.push({ key: "borSister", value: "兄弟姐妹" });
        }
        if (data.other == "Y") {
          this.familyHisRole.push({ key: "other", value: "其他" });
        }
      }
      this.validateForm();
    },
    async submitForm() {
      const _this = this;
      if (this.isStop) {
        return;
      }
      this.isStop = true;
      const validate = this.validateForm();
      if (validate) {
        // pass
        if (!this.formData.custNo) {
          this.formData.custNo = this.$route.params.custNo;
        }
        if (!this.formData.storeId) {
          this.formData.storeId = this.userInfo.orgCrmId;
        }
        if (!this.formData.province) {
          this.formData.province = this.region[0];
          this.formData.city = this.region[1];
          this.formData.district = this.region[2];
        }

        this.formData.father = "N";
        this.formData.mother = "N";
        this.formData.borSister = "N";
        this.formData.other = "N";

        this.familyHisRole.forEach(el => {
          this.formData[el.key] = "Y";
        });
        let { code, data } = await addRecord({ ...this.formData });
        if (code === 200) {
          this.$vux.toast.show({
            time: 1500,
            type: "success",
            width: "12em",
            "is-show-mask": true,
            text: data.message
          });
          this.isStop = false;
          this.$router.back(-1);
        }
      } else {
        // error
        this.$vux.toast.show({
          time: 1500,
          type: "warn",
          width: "12em",
          "is-show-mask": true,
          text: "请填写正确的信息"
        });
        this.isStop = false;
      }
    },
    validateForm() {
      let noerror = true;
      for (const key in this.formData) {
        if (!this.formData[key] && this.$refs[key]) {
          if (!this.$refs[key].valid) {
            noerror = false;
            this.$refs[key].focus();
            this.$refs[key].blur();
          }
        }
      }
      return noerror;
    },
    resetForm() {
      this.formData.sex = "male";
      this.formData.birthday = new Date().Format("YYYY-MM-DD");
      console.log(this.$refs);
      for (const key in this.$refs) {
        this.$refs[key].reset('');
      }
    },
    onShadowChange(code, name) {
      this.regionName = name;
      this.regionVal = code;
    },
    logHide(e) {
      if (e) {
        // 确认地址
        this.region = this.regionName;
      }
    },
    setToday(value) {
      // 设置当天
      let now = new Date();
      let cmonth = now.getMonth() + 1;
      let day = now.getDate();
      if (cmonth < 10) cmonth = "0" + cmonth;
      if (day < 10) day = "0" + day;
      let today = now.getFullYear() + "-" + cmonth + "-" + day;
      this.startDate = today;
      this.formData.confTime = today;
    },
    dateFmt(time, format) {
      let t = new Date(time);
      let tf = function(i) {
        return (i < 10 ? "0" : "") + i;
      };
      return format.replace(/YYYY|MM|DD|HH|mm|ss/g, function(a) {
        switch (a) {
          case "YYYY":
            return tf(t.getFullYear());
          case "MM":
            return tf(t.getMonth() + 1);
          case "mm":
            return tf(t.getMinutes());
          case "DD":
            return tf(t.getDate());
          case "HH":
            return tf(t.getHours());
          case "ss":
            return tf(t.getSeconds());
        }
      });
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
  margin-top: 30px;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}
.vux-checker-box {
  text-align: center;
}
.check-item {
  width: 5em;
  height: 26px;
  font-size: 14px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 12px;
  margin-bottom: 12px;
}
.check-item-selected {
  background: #ffffff
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAMAAACecocUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTZDOEJBQ0E3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTZDOEJBQ0I3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNkM4QkFDODc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNkM4QkFDOTc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnMGp3kAAAAJUExURf9KAP///////4Jqdw0AAAADdFJOU///ANfKDUEAAAAuSURBVHjaTMpBDgAABAPB5f+PlhLUpZMWuQcYMWLEyDN4ymqa5KS4+3G+KAEGACQmAGlKzr56AAAAAElFTkSuQmCC)
    no-repeat right bottom;
  border-color: #ff4a00;
}
.weui-btn_primary{
  background:rgba(0,202,172,1)
}
</style>