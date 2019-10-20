<template>
  <div>
    <div class="header">
      <img src="../assets/images/logo2.png" alt>
      <!-- <div class="name">康佰家大药房导购协同</div> -->
      <div class="name">德成鸿业导购宝</div>
    </div>
    <div class="form-info">
      <x-input placeholder="用户名" v-model="loginName" class="user">
        <i
          class="fa fa-user-o"
          style="color:#666;margin-right:10px;font-size:0.5rem;"
          slot="label"
          aria-hidden="true"
        ></i>
      </x-input>
      <x-input
        placeholder="密码"
        class="user"
        v-model="loginPwd"
        type="password"
        style="margin-top:20px;"
      >
        <i
          class="fa fa-unlock-alt"
          style="color:#666;margin-right:10px;font-size:0.5rem;"
          slot="label"
          aria-hidden="true"
        ></i>
      </x-input>
      
      <div class="recordPW">
        <van-checkbox
          style="display: flex;justify-content: flex-end;color:#1989fa;margin-top:10px;"
          v-model="checked"
        >记住密码</van-checkbox>
      </div>
      <a class="login-btn" @click="handleLogin">登 录</a>
      <div class="message">
        忘记密码
        <span style="color:#F59715;">请联系管理员</span>进行重置
      </div>
      <div class="version">当前版本 V {{version}}</div>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="show"
        title="版本更新提示"
        :content="versionMsg"
        @on-cancel="show = false"
        @on-confirm="onConfirm"
        confirm-text="立即更新"
        cancel-text="下次再说"
      ></confirm>
    </div>
  </div>
</template>
<script>
import { Checkbox } from "vant";
import {
  XInput,
  md5,
  Toast,
  Confirm,
  TransferDomDirective as TransferDom
} from "vux";
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import {  } from "@/utils/auth";
import { CURRENT_INDEX, ACCOUNT_INFO } from "@/utils/storage";
import { getVersion } from "@/api/common";
Vue.use(Checkbox);
import Utils from "@/utils/utils";
const utils = new Utils();


export default {
  name: "login",
  components: {
    XInput,
    Confirm
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      loginName: "",
      loginPwd: "",
      checked: false,
      show: false,
      versionMsg: "",
      versionURL: "",
      version:""
    };
  },
  computed: {},
  watch: {},
  created() {},//在模版渲染成html之前调用通常初始化某些属性值
  mounted() {//在模版渲染成html后调用
    let accountInfo = this.$utils.getLocalData(ACCOUNT_INFO, true);
    console.log(accountInfo);
    if (accountInfo && accountInfo != "null" && accountInfo != null) {//如果在登录页面你保存了你的密码和用户名
      this.loginName = accountInfo.loginName;//就把登录名赋值到文本框里面
      this.loginPwd = accountInfo.loginPwd;//就把密码赋值到文本框里面
      this.checked = true;//让记住密码的框是确认框
      console.log(this.loginName);
    }
    
    this.$nextTick(()=>{
      let deviceType = utils.deviceType();//判断手机
      if (deviceType == "ios") {//确定ios手机的版本
        this.getVersion(1);
      } else if (deviceType == "android") {//确定安卓手机的版本
        this.getVersion(2);
      }
    })
  },
  methods: {
    ...mapActions(["LOGIN"]),
    handleLogin() {
      let deviceType = utils.deviceType();//判断手机
      let udid;
      // store/modules/user
      if (deviceType == "ios" && window.iosShare && window.iosShare.getUdid) {
        udid = window.iosShare.getUdid();
        // alert(udid);
      } else if (
        deviceType == "android" &&
        window.androidShare &&
        window.androidShare.getUdid
      ) {
        udid = window.androidShare.getUdid();
        // alert(udid);
      }
      // alert('参数mobileType：', deviceType)
//    alert("开始登录")
      this.LOGIN({
        loginName: this.loginName,//用户名
        loginPwd: md5(this.loginPwd),//使用vux的md5对密码进行加密
        udId: udid || "",
        mobileType: deviceType || ''//要么是安卓要么是ios都没有的话就是空
      }).then(res => {
//    	alert("请求接口")
        // console.log(res);
        if (+res.code === 200) {
          this.$utils.setLocalData(CURRENT_INDEX, 2);//调取utils的localStorage去存存储方法里面的currentIndex存为2去跳转相应的页面
          // 勾选了记住密码
          if (this.checked) {//如果记住了密码就存本地
            this.$utils.setLocalData(ACCOUNT_INFO, {
              loginName: this.loginName,
              loginPwd: this.loginPwd
            });
          } else {//没有记住密码就存密码为null
            this.$utils.setLocalData(ACCOUNT_INFO, null);
          }
          if (deviceType == "ios" && window.iosShare) {
        window.iosShare.sendAccount(JSON.stringify({account:this.loginName}));
            // alert(udid);
          } else if (deviceType == "android" && window.androidShare) {
             window.androidShare.sendAccount(this.loginName);
          }
//        alert("开始登录成功完成准备跳转页面")
          
          this.$router.push({
            path: "/Index"
          });//然后跳转index的页面也就是首页
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    getVersion(type) {//显示版本
      getVersion({
        typeId: type
      }).then(res => {
        if (+res.code === 200) {
          this.version = res.data.version
          let deviceType = utils.deviceType();//再次判断ios和安卓手机
          let v;
          if (deviceType == "ios") {
            v = window.iosShare.getVersion();
            if (v != res.data.version) {
              this.show = true;
              this.versionMsg = res.data.remark;
              this.versionURL = res.data.address ? res.data.address : '';
            }
          } else if (deviceType == "android") {
            v = window.androidShare.getVersion();
            if (v != res.data.version) {
              this.show = true;
              this.versionMsg = res.data.remark;
              this.versionURL = res.data.address ? res.data.address : '';
            }
          }
          
        }
      });
    },
    onConfirm() {//更新版本
      let url = {
        url: this.versionURL
      };
        let deviceType = utils.deviceType();
      if (deviceType == "ios") {
        window.iosShare.updateVersion(JSON.stringify(url));
      } else if (deviceType == "android") {
        window.androidShare.updateVersion(this.versionURL);
      }
      this.show = false;
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  > img {
    width: 37%;
    margin-top: 8vh;
  }
  > div {
    color: rgba(0,202,172,1);
    font-weight: bold;
    font-size: 26px;
    margin-top: 1vh;
  }
}
.form-info {
  margin-top: 50px;
  .user {
    border: 1px solid rgba(0, 202, 172, 1);
    width: 80%;
    margin: 0 auto;
    padding: 7px 10px;
    font-size: 15px;
    border-radius: 10px;
    background-color: #fff;
  }
  .login-btn {
    margin: 0 auto;
    margin-top: 40px;
    width: 80%;
    background: rgba(0, 202, 172, 1);
    text-align: center;
    font-size: 16px;
    padding: 7px 12px;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
    display: block;
  }

  .message {
    text-align: center;
    font-size: 12px;
    margin-top: 8px;
  }
}
.recordPW {
  width: 80%;
  margin: 0 auto;
  margin-top: 5px;
}
.version{
      position: absolute;
    bottom: 5vh;
    left: 0;
    right: 0;
    text-align: center;
    color: #666;
    font-size: 12px;
}
</style>
<style>
body {
        background-color: #fff;
    }
</style>