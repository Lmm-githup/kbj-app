<template>
  <div class="container">
    <x-header :left-options="{showBack: true,backText: ''}">
      人员详情
      <a slot="right" @click="show = !show">
        <i class="fa fa-ellipsis-h fa-2x" aria-hidden="true"></i>
      </a>
    </x-header>
    <div class="user-info">
      <div class="top">
        <div class="img-box">
          <img :src="userInfo.userHeadimg ? userInfo.userHeadimg : userLogo" alt="logo">
        </div>
        <div class="info">
          <div class="name">{{userInfo.userName}}</div>
          <div>部门：{{userInfo.orgName}} | 职位：{{userInfo.positionName}}</div>
        </div>
      </div>
      <div class="bottom">
        <div class="content">
          <div class="item">
            <div class="left">手机号</div>
            <div class="right">{{userInfo.mobile}}</div>
          </div>
          <div class="item">
            <div class="left">邮箱</div>
            <div class="right">{{userInfo.email}}</div>
          </div>
          <div class="item">
            <div class="left">员工编号</div>
            <div class="right">{{userInfo.userNo}}</div>
          </div>
          <div class="item">
            <div class="left">状态</div>
            <div class="right">
              <div class="right" v-if="userInfo.userStatus == 1">正常</div>
              <div class="right" v-if="userInfo.userStatus == 2">禁用</div>
            </div>
          </div>
          <div class="item">
            <div class="left">职位</div>
            <div class="right">
              <div>{{userInfo.positionName}}</div>
            </div>
          </div>
          <div class="item">
            <div class="left">创建时间</div>
            <div class="right">{{userInfo.gmtCreate}}</div>
          </div>
          <div class="item">
            <div class="left">最后登录时间</div>
            <div class="right">{{userInfo.lastLoginTime | dateFormat}}</div>
          </div>
          <div class="item">
            <div class="left">登录次数</div>
            <div class="right">{{userInfo.loginNum}}</div>
          </div>
        </div>
      </div>
    </div>
    <actionsheet v-model="show" :menus="menus" @on-click-menu="handleMenu" show-cancel></actionsheet>
    <div v-transfer-dom>
      <confirm v-model="showPwd" title="提示" @on-cancel="showPwd = false" @on-confirm="onConfirmPwd">
        <p style="text-align:center;">是否确定重置当前用户密码为初始默认密码?</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showDelete" title="提示" @on-cancel="showDelete = false" @on-confirm="onConfirmDelete">
        <p style="text-align:center;">确定删除该员工?</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { XHeader, Group, Cell, CellBox, Actionsheet, TransferDomDirective as TransferDom, Confirm } from "vux";
import userLogo from "@/assets/images/userLogo.png";
import { queryStaffDetail, resetPassword, deleteStaff } from "@/api/user";
export default {
  components: {
    XHeader,
    Group,
    Cell,
    Actionsheet,
    Confirm
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      userLogo,
      status: {
        value: "正常",
        options: ["正常", "已注销"]
      },
      position: {
        value: "店长",
        options: ["店长", "职员"]
      },
      userNo: "",
      userInfo: {},
      show: false,
      menus: [
        {
          label: "人员信息修改"
        },
        {
          label: "重置密码"
        },
        {
          label: "删除",
          type: "warn"
        }
      ],
      showPwd: false,
      showDelete:false
    };
  },
  methods: {
    onConfirmDelete() {
      deleteStaff({
        userNo: this.userInfo.userNo
      }).then(res => {
        if (res.code === 200) {
          let _this = this
          this.$vux.toast.show({
            text: "删除成功!",
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
    onConfirmPwd() {
      resetPassword({
        userNo: this.userInfo.userNo
      }).then(res => {
        if (res.code === 200) {
          this.showPwd = false
          this.$vux.toast.show({
            text: "重置成功!",
            time: 1000,
            type: "text"
          });
          this.getUserDetail()
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    handleMenu(key, item) {
      console.log(key, item);
      if (item.label == "人员信息修改") {
        this.$router.push({
          path: "/editStaff",
          query: {
            userNo: this.userNo,
            userName: this.userInfo.userName,
            orgNoName: this.userInfo.orgName,
            orgNo: this.userInfo.orgNo,
            positionNoName: this.userInfo.positionName,
            positionNo: this.userInfo.positionNo,
            mobile: this.userInfo.mobile,
            email: this.userInfo.email
          }
        });
      } else if (item.label == "重置密码") {
        this.showPwd = true;
      } else if (item.label == "删除") {
        this.showDelete = true;
      }
    },
    getUserDetail() {
      queryStaffDetail({
        userNo: this.userNo
      }).then(res => {
        if (res.code === 200) {
          this.userInfo = res.data;
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    }
  },
  mounted() {
    this.userNo = this.$route.query.userNo;
    this.getUserDetail();
  }
};
</script>

<style lang="less" scoped>
.container {
  font-size: 13px;
  position: relative;
}
.user-info {
  width: 100%;
  height: 150px;
  background-color: rgba(0,202,172,1);
  position: relative;
  .top {
    width: 90%;
    padding-top: 24px;
    margin: 0 auto;
    display: flex;
    .img-box {
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
      border-radius: 50%;
      overflow: hidden;
      // border: 1px solid #666;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .info {
      margin-top: 5px;
      .name {
        font-weight: 700;
        font-style: normal;
        font-size: 15px;
        color: #1d459b;
      }
    }
  }
  .bottom {
    width: 90%;
    background-color: #fff;
    border-radius: 4px;
    margin: 15px auto 0;
    .content {
      padding: 0 10px;
      .item {
        display: flex;
        align-items: center;
        padding: 10px 5px;
        &:not(:last-child) {
          border-bottom: 1px solid #dfdfdf;
        }
        .left {
          flex: 1;
        }
        .right {
          flex: 2;
          /deep/ .weui-cell__bd {
            &::after {
              top: 45%;
              transform: rotate(135deg);
            }
          }
          /deep/ .weui-select {
            height: 20px;
            line-height: 20px;
            // padding-left: 0;
            border: 1px solid #dfdfdf;
          }
        }
      }
    }
  }
}
</style>
