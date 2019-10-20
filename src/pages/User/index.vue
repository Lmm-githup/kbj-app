<template>
  <view-box  body-padding-top="40px">
    <x-header :left-options="{showBack: false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">我的</x-header>
    <a class="head-info" @click="goEdit">
      <div class="head-img-box">
        <img :src="userInfo.userHeadimg ? userInfo.userHeadimg : noImg" alt>
        <div class="info">
          <span class="name">
            {{userInfo.userName}}
            <span
              class="position"
              v-if="userInfo.positionName"
            >{{userInfo.positionName}}</span>
          </span>
          <span class="location">{{userInfo.orgName}}</span>
        </div>
      </div>
    </a>
    <div class="contact-info">
      <cell title="电话" :value="userInfo.mobile" :border-intent="false"></cell>
      <cell title="电子邮件" :value="userInfo.email" :border-intent="false"></cell>
    </div>
      <div style="width:100%;height:12px;background:#f8f8f8;"></div>
    <div class="contact-info">
      <cell :border-intent="false" @click.native="goEditPassword">
        <div slot="title" class="cell-info">
          <div class="icon-box">
            <i style="color:#1D459B;padding-left:4px;" class="fa fa-unlock-alt icon" aria-hidden="true"></i>
          </div>
          <span style="color:#1D459B;">修改密码</span>
        </div>
      </cell>
      <cell v-if="isSet" :border-intent="false" @click.native="goSetUser">
        <div slot="title" class="cell-info">
          <div class="icon-box">
            <i style="color:#1D459B;" class="fa fa-cog icon" aria-hidden="true"></i>
          </div>
          <span>设置</span>
        </div>
      </cell>
      <cell :border-intent="false" @click.native="goMember">
        <div slot="title" class="cell-info">
          <div class="icon-box">
            <i style="color:#F87D87;" class="fa fa-diamond icon" aria-hidden="true"></i>
          </div>
          <span>会员权益</span>
        </div>
      </cell>
      <cell v-if="isShopQC" :border-intent="false" @click.native="showQrcode = true">
        <div slot="title" class="cell-info">
          <div class="icon-box">
            <i style="color:rgba(0,202,172,1);" class="fa fa-qrcode icon" aria-hidden="true"></i>
          </div>
          <span>门店二维码</span>
        </div>
      </cell>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showQrcode" class="dialog-demo" hide-on-blur>
        <div class="img-box">
          <div style="text-align:center;padding: 5px;font-size: 18px;font-weight: 700;">{{storeName}}</div>
          <img :src="qrCode" style="max-width:100%">
        </div>
        <a style="color: #666;" v-if="phoneType == 'ios'" @click="iosQrcode">
          <i class="fa fa-download" style="font-size:30px;" aria-hidden="true"></i>
        </a>
        <a style="color: #666;" v-else :href="qrCode" :download="qrCode">
          <i class="fa fa-download" style="font-size:30px;" aria-hidden="true"></i>
        </a>
      </x-dialog>
    </div>
    <div style="padding:0.4rem;margin-top:3rem;">
      <x-button type="primary" @click.native="loginOut">安全退出</x-button>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="logOutShow"
        title="操作提示"
        @on-cancel="logOutShow = false"
        @on-confirm="onConfirmLogOut"
      >
        <p style="text-align:center;">{{ '退出后下次需重新登录' }}</p>
      </confirm>
    </div>
  </view-box>
</template>

<script>
import {
  XHeader,
  Cell,
  XButton,
  TransferDomDirective as TransferDom,
  Confirm,
  XDialog
} from "vux";
import { getUserInfo, logout, myQrcode } from "@/api/user";
import { BTN_EQUITY, ACCOUNT_INFO, USER_INFO } from "@/utils/storage";
import { removeToken } from "@/utils/auth";
import noImg from "@/assets/images/no-img.jpg";
import Utils from "@/utils/utils";
const utils = new Utils();
export default {
  name: "User",
  components: {
    XHeader,
    Cell,
    XButton,
    TransferDom,
    Confirm,
    XDialog
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      noImg,
      userInfo: {},
      logOutShow: false,
      isSet: false,
      isShopQC: false,
      qrCode: "",
      showQrcode: false,
      storeName: '',
      phoneType: ''
    };
  },
  props: {},
  computed: {},
  watch: {},
  created() {
    this.phoneType = utils.deviceType();
    this.storeName = this.$utils.getLocalData(USER_INFO, true).orgName
    let equityList = [];
    equityList = this.$utils.getLocalData(BTN_EQUITY, true) || [];
    equityList.forEach(v => {
      if (v.moduleKey == "USER_SETTING") {
        this.isSet = true;
      }
      if (v.moduleKey == "STORE_QC") {
        this.isShopQC = true;
      }
    });
    this.getData();
    myQrcode().then(res => {
      if (res.code === 200) {
        this.qrCode = res.data.imgUrl;
      } else {
        this.$vux.toast.show({
          text: res.msg,
          time: 2000,
          type: "text"
        });
      }
    });
  },
  mounted() {},
  methods: {
    iosQrcode () {
      let params = {
        qrcode: this.qrCode
      }
      window.iosShare.downloadQrcodeURL(JSON.stringify(params))
    },
    onConfirmLogOut() {
      logout().then(res => {
        if (+res.code === 200) {
          // 账号信息不清除
          let accountInfo = this.$utils.getLocalData(ACCOUNT_INFO);
          this.$utils.removeLocalData();
          removeToken();
          this.$utils.setLocalData(ACCOUNT_INFO, accountInfo);

          this.$router.replace({
            path: "login"
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
    loginOut() {
      this.logOutShow = true;
    },
    getData() {
      getUserInfo().then(res => {
        if (+res.code === 200) {
          this.userInfo = res.data;
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    goMember() {
      this.$router.push({
        path: "/memberEquity"
      });
    },
    goEdit() {
      this.$router.push({
        path: "/editUserInfo"
      });
    },
    goEditPassword() {
      this.$router.push({
        path: "/editPassword",
        query: {
          mobile: this.userInfo.mobile
        }
      });
    },
    goSetUser() {
      this.$router.push({
        path: "/setUser"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~vux/src/styles/close";

.dialog-demo {
  .weui-dialog {
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>

<style lang="less" scoped>
.head-info {
  background-color: rgba(255, 204, 153, 0.447058823529412);
  display: block;
  padding: 20px;
  .head-img-box {
    display: flex;
    align-items: center;
    > img {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      margin-right: 20px;
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

.contact-info {
  background: #fff;
  //margin-bottom: 20px;
  .cell-info {
    display: flex;
    align-items: center;
    .icon-box {
      width: 40px;
    }
    .icon {
      font-size: 20px;
      margin-right: 20px;
      margin-top: 3px;
    }
  }
}
.weui-btn_primary{
  background:rgba(0,202,172,1)
}
</style>