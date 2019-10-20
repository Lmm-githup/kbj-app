<template>
  <div class="main">
    <x-header :left-options="{showBack: true,backText: ''}">个人资料</x-header>

    <div class="head-info">
      <div class="head-img-box">
        <van-uploader
          name="filename"
          accept="image/gif, image/jpeg"
          :max-size="2097152"
          :after-read="onRead"
          @oversize="onSize"
        >
          <div class="img-info">
            <img
              :src="userData.userHeadimg ?userData.userHeadimg : `/src/assets/images/no-img.jpg`"
              alt
              class="head-img"
            >
            <span class="img-info-text">点击更换头像</span>
          </div>
        </van-uploader>
        <div class="info">
          <span class="name">
            {{userData.userName}}
            <span class="position">{{userData.positionName}}</span>
          </span>
          <span class="location">{{userData.orgName}}</span>
        </div>
      </div>
      <!-- <i class="fa fa-angle-right" style="font-size:24px;" aria-hidden="true"></i> -->
    </div>

    <group>
      <cell title="员工编号:" :value="userData.userCode"></cell>
      <cell title="手机号码:" :value="userData.mobile"></cell>
      <x-input title="电子邮箱:" is-type="email" v-model="userData.email" text-align="right"></x-input>
      <!-- <cell title="性别:" is-link >{{userData.sex | sexFilter}}</cell> -->
      <popup-picker title="性别" :data="sexList" :value="userData.sex" @on-change="onChangeSex"></popup-picker>
      <datetime
        v-model="userData.birthday"
        @on-change="change"
        :min-year="1930"
        title="出生日期"
        @on-confirm="onConfirm"
      ></datetime>
    </group>
    <a class="login-btn" @click="save">保 存</a>
  </div>
</template>

<script>
import {
  XHeader,
  Cell,
  XInput,
  Group,
  Datetime,
  PopupPicker,
  dateFormat
} from "vux";
import { Uploader } from "vant";
import { mapActions } from "vuex";
import Vue from "vue";
import { editUserInfo, getUserInfo } from "@/api/user";

Vue.use(Uploader);
export default {
  name: "User",
  components: {
    XHeader,
    Cell,
    XInput,
    Group,
    Datetime,
    PopupPicker,
    dateFormat
  },
  data() {
    return {
      userData: {},
      sexList: [["男", "女"]],
      sexValue: ""
    };
  },
  props: {},
  computed: {},
  watch: {},
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    ...mapActions(["USER_INFO"]),
    getData() {
      getUserInfo().then(res => {
        if (+res.code === 200) {
          this.userData = res.data;
          this.userData.birthday = this.userData.birthday
            ? dateFormat(this.userData.birthday, "YYYY-MM-DD")
            : "";
          if (this.userData.sex == 1) {
            this.userData.sex = ["男"];
            this.sexValue = 1;
          } else if (this.userData.sex == 2) {
            this.userData.sex = ["女"];
            this.sexValue = 2;
          } else {
            this.userData.sex = [];
          }
        } else {
          this.$vux.toast.show({
            text: res.data.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    onSize(file, detail) {
      if (file.size > 2097152) {
        this.$vux.toast.show({
          text: "上传的图片不得超过2M",
          time: 2000,
          type: "text"
        });
      }
    },
    onRead(file, detail) {
      console.log(file);
      this.userData.userHeadimg = file.content;
    },
    change(value) {
      console.log("change", value);
    },
    onConfirm(value) {},
    onChangeSex(value) {
      console.log(value, "123123");
      if (value == "男") {
        this.userData.sex = value;
        this.sexValue = 1;
      } else if (value == "女") {
        this.userData.sex = value;
        this.sexValue = 2;
      }
    },
    save() {
      let regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (this.userData.email && !regEmail.test(this.userData.email)) {
        this.$vux.toast.show({
          text: "请填写正确的邮箱格式",
          time: 2000,
          type: "text"
        });
        return;
      }
      editUserInfo(
        this.userData.email,
        this.sexValue,
        this.userData.birthday,
        this.userData.userHeadimg
      ).then(res => {
        console.log(res);
        if (+res.code === 200) {
          let _this = this;
          this.$vux.toast.show({
            text: "修改成功",
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
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  color: #101010;
  font-size: 0.37333rem;
}
.head-info {
  background-color: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  //border-bottom: 0.02667rem solid #d9d9d9;
  border-top: 0.02667rem solid #d9d9d9;
  .head-img-box {
    display: flex;
    align-items: center;
    .img-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      .img-info-text {
        color: #999;
        font-size: 12px;
        margin-top: 5px;
      }
    }
    .head-img {
      width: 50px;
      height: 50px;
      border-radius: 100%;
    }
    .info {
      display: flex;
      flex-direction: column;
      margin-right: 20px;
      color: #1d459b;
      .name {
        font-weight: 700;
      }
      .location {
        font-size: 12px;
      }
      .position {
        margin-left: 10px;
        font-size: 12px;
        color: #ff6600;
        border: 1px solid #ff6600;
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: 400;
      }
    }
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
  background: rgba(0,202,172,1);
  text-align: center;
  font-size: 16px;
  padding: 7px 12px;
  color: #fff;
  border-radius: 10px;
  display: block;
}
/deep/.weui-cells{
  line-height:35px;
}
</style>