<template>
  <div class="editPassword-index">
    <x-header :left-options="{showBack: true,backText: ''}">修改密码</x-header>
    <div class="form-box">
      <group>
        <x-input v-model="mobile" disabled>
          <div slot="label" class="icon-box">
            <i
              slot="label"
              class="fa fa-mobile"
              aria-hidden="true"
              style="font-size:28px;padding-right:10px;color:#999"
            ></i>
          </div>
        </x-input>
        <x-input v-model="oldPwd" placeholder="请输入原始密码" :type="isPWD0" required>
          <div slot="label" class="icon-box">
            <i
              class="fa fa-unlock-alt"
              aria-hidden="true"
              style="font-size:24px;padding-right:10px;color:#999"
            ></i>
          </div>
          <a
            v-if="isPWD0 == 'password'"
            slot="right"
            class="fa fa-eye-slash"
            aria-hidden="true"
            @click="isPWD0 = isPWD0 == 'password'? 'text' : 'password'"
          ></a>
          <a
            v-else
            slot="right"
            class="fa fa-eye"
            aria-hidden="true"
            @click="isPWD0 = isPWD0 == 'password'? 'text' : 'password'"
          ></a>
        </x-input>
        <x-input v-model="loginPwd" placeholder="请输入新的登录密码" :type="isPWD1" required>
          <div slot="label" class="icon-box">
            <i
              class="fa fa-unlock-alt"
              aria-hidden="true"
              style="font-size:24px;padding-right:10px;color:#999"
            ></i>
          </div>
          <a
            v-if="isPWD1 == 'password'"
            slot="right"
            class="fa fa-eye-slash"
            aria-hidden="true"
            @click="isPWD1 = isPWD1 == 'password'? 'text' : 'password'"
          ></a>
          <a
            v-else
            slot="right"
            class="fa fa-eye"
            aria-hidden="true"
            @click="isPWD1 = isPWD1 == 'password'? 'text' : 'password'"
          ></a>
        </x-input>
        <x-input v-model="confrimPwd" placeholder="请确认新密码" :type="isPWD2" required>
          <div slot="label" class="icon-box">
            <i
              class="fa fa-unlock-alt"
              aria-hidden="true"
              style="font-size:24px;padding-right:10px;color:#999"
            ></i>
          </div>
          <a
            v-if="isPWD2 == 'password'"
            slot="right"
            class="fa fa-eye-slash"
            aria-hidden="true"
            @click="isPWD2 = isPWD2 == 'password'? 'text' : 'password'"
          ></a>
          <a
            v-else
            slot="right"
            class="fa fa-eye"
            aria-hidden="true"
            @click="isPWD2 = isPWD2 == 'password'? 'text' : 'password'"
          ></a>
        </x-input>
      </group>
    </div>
    <a class="login-btn" @click="save">确 认</a>
  </div>
</template>

<script>
import { XHeader, XInput, Group, md5 } from "vux";
import { editUserPassword, logout } from "@/api/user";
import { BTN_EQUITY, ACCOUNT_INFO, USER_INFO } from "@/utils/storage";
import { removeToken } from "@/utils/auth";
export default {
  name: "editPassword",
  components: {
    XHeader,
    Group,
    XInput
  },
  data() {
    return {
      mobile: "",
      isPWD0: "password",
      isPWD1: "password",
      isPWD2: "password",
      oldPwd: "",
      loginPwd: "",
      confrimPwd: ""
    };
  },
  methods: {
    save() {
      if (!this.oldPwd) {
        this.$vux.toast.show({
          text: "请填写原始密码!",
          time: 1000,
          type: "text"
        });
        return;
      } else if (!this.loginPwd) {
        this.$vux.toast.show({
          text: "请填写新密码!",
          time: 1000,
          type: "text"
        });
        return;
      } else if (!this.confrimPwd) {
        this.$vux.toast.show({
          text: "请填写确认新密码!",
          time: 1000,
          type: "text"
        });
        return;
      } else if (this.loginPwd !== this.confrimPwd) {
        this.$vux.toast.show({
          text: "两次填写的密码不一致!",
          time: 1000,
          type: "text"
        });
        return;
      }
      editUserPassword(md5(this.oldPwd), md5(this.loginPwd)).then(res => {
        if (+res.code === 200) {
          let _this = this;
          this.$vux.toast.show({
            text: "修改成功",
            time: 1000,
            type: "text",
            onHide() {
              logout().then(res => {
                if (+res.code === 200) {
                  // 账号信息不清除
                  let accountInfo = _this.$utils.getLocalData(ACCOUNT_INFO);
                  _this.$utils.removeLocalData();
                  removeToken();
                  _this.$utils.setLocalData(ACCOUNT_INFO, accountInfo);

                  _this.$router.replace({
                    path: "login"
                  });
                } else {
                  _this.$vux.toast.show({
                    text: res.msg,
                    time: 2000,
                    type: "text"
                  });
                }
              });
            }
          });
        } else {
          this.$vux.toast.show({
            text: res.data.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    }
  },
  mounted() {
    this.mobile = this.$route.query.mobile;
    console.log(this);
  }
};
</script>

<style scoped lang="less">
.form-box {
  padding: 5px 10px;
  height: 320px;
  width:90%;
  margin:5% auto;
  background: white;
  border:1px solid #eee;
  border-radius: 20px;
  .icon-box {
    width: 30px;
    text-align: center;
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
  background: rgba(20,202,172,1);
  text-align: center;
  font-size: 16px;
  padding: 7px 12px;
  color: #fff;
  border-radius: 10px;
  display: block;
}
</style>
