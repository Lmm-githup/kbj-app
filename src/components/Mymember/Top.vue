<template>
  <div>
    <div
      class="member-info"
      v-if="memberInfo && !$route.meta.pdt"
      :style="{paddingTop: pdtNum+'px'}"
    >
      <div class="member-head">
        <div class="member-head__avatar">
          <img :src="memberInfo.image" class="full-square-img" v-if="memberInfo.image">
          <img src="/src/assets/images/no-img.jpg" class="full-square-img" v-else>
          <span class="barge">
            <i class="fa fa-mars" aria-hidden="true" v-if="memberInfo.sex === '男'"></i>
            <i class="fa fa-venus" aria-hidden="true" v-else></i>
          </span>
        </div>
        <div class="member-head__main">
          <p class="info">
            {{memberInfo.memberName}}
            <span
              class="icon-vip"
              :class="{on: memberInfo.isPlus === 'Y'}"
            >Plus</span>
            <a class="emphasis-btn" @click="editFollow(memberInfo.emphasis)">
              <i
                class="fa fa-heart"
                aria-hidden="true"
                :style="{color: memberInfo.emphasis && memberInfo.emphasis === 'Y' ? '#f3499c' : '#fff'}"
              ></i>
              <span>{{memberInfo.emphasis && memberInfo.emphasis === 'Y' ? '已关注' : '关注'}}</span>
            </a>
          </p>
          <p class="desc">
            <span class="level">{{memberInfo.memberGrade}} ({{memberInfo.gradingIntegral || 0}})</span>
            生日: {{memberInfo.birthday | dateFormat('YYYY-MM-DD')}}
          </p>
          <p class="tags-list clearfix">
            <span
              class="tags-item"
              v-for="(item, index) in memberInfo.newMemTag"
              :key="index"
            >{{item}}</span>
            <router-link
              :to="{name: 'addTags', params: {custNo: memberInfo.custNo}}"
              class="add-tags"
            >+标签</router-link>
          </p>
        </div>
        <a
          class="member-head__after"
          style="display:block"
          v-if="$route.name === 'memberDetail'"
          @click="goMemberCenter"
        >
          <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </a>
      </div>
      <div class="member-card" v-if="$route.meta.showCard">
        <router-link
          :to="{name: 'memberScores', params: {custNo: custNo, numerator: memberInfo.memberIntegral}}"
          class="member-card__item"
        >
          <span class="name">积分</span>
          <span class="num">{{memberInfo.memberIntegral || 0}}</span>
        </router-link>
        <div class="member-card__item">
          <span class="name">累计消费金额</span>
          <span class="num">¥ {{memberInfo.totalAmount || 0}}</span>
        </div>
        <router-link
          :to="{name: 'memberCoupon', params: {custNo: custNo}}"
          class="member-card__item"
        >
          <span class="name">优惠券</span>
          <span class="num">{{memberInfo.couponNum || 0}}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { USER_INFO } from "@/utils/storage";
import { getMemberInfo, editFollow } from "@/api/mymember";
import { mapState, mapActions } from "vuex";
export default {
  name: "MymemberTop",
  props: {
    custNo: String
  },
  components: {},
  data() {
    return {
      userInfo: {}
    };
  },
  computed: {
    ...mapState({
      permission: state => state.mymember.permission,
      pdtNum: state => state.mymember.pdtNum,
      memberInfo: state => state.mymember.memberInfo
    })
  },
  watch: {
    $route(to, from) {
      // console.log("to", to.name);
      // console.log("from", from.name);
      if (to.name === this.$route.name && !this.$route.meta.pdt) {
        this.getInfo();
      }
    }
  },
  mounted() {
    this.userInfo = this.$utils.getLocalData(USER_INFO, true);
    if (
      !this.memberInfo &&
      !this.$route.meta.pdt &&
      this.$route.name !== "addMember"
    ) {
      this.getInfo();
    } else {
      if (
        this.memberInfo &&
        this.memberInfo.custNo != this.custNo &&
        this.$route.name !== "addMember"
      ) {
        this.getInfo();
      }
    }
  },
  methods: {
    ...mapActions(["SET_EDITMEMBER", "SET_PERMISSION"]),
    async getInfo() {
      console.log("top getInfo");
      let { data } = await getMemberInfo({ custNo: this.custNo });
      // 权限判断 start
      // console.log(`登陆人orgType=${this.userInfo.orgType},登录人positionType=${this.userInfo.positionType}, 登录人orgCrmId=${this.userInfo.orgCrmId}, 登录人userCrmId=${this.userInfo.userCrmId}`);
      // console.log(`会员orgCrmId=${data.orgCrmId}, 会员userNo=${data.userNo}`);
      // 登录人orgType =='门店' and 登录人positionType=='STORE_MANAGE'  and 登录人orgCrmId == 会员orgCrmId ) or (登录人userCrmId == 会员userNo )
      if (
        (this.userInfo.orgType == "门店" &&
          this.userInfo.positionType == "STORE_MANAGE" &&
          this.userInfo.orgCrmId == data.orgCrmId) ||
        this.userInfo.userCrmId == data.userNo
      ) {
        // 有权限
        // console.log('有权限');
        this.SET_PERMISSION(true);
      } else {
        // 无权限
        // console.log("无权限");
        this.SET_PERMISSION(false);
      }
      // 权限判断 end
      this.SET_EDITMEMBER(data);
    },
    async editFollow(status) {
      const data = this.memberInfo;
      let _status = status && status === "Y" ? "N" : "Y";
      let { code } = await editFollow({
        memberNo: this.custNo,
        status: _status
      });
      if (code === 200) {
        this.getInfo();
      }
    },
    goMemberCenter() {
      if (this.$route.name === "memberDetail") {
        this.$router.push({
          name: "memberCenter",
          params: { custNo: this.memberInfo.custNo }
        });
      }
      return;
    }
  }
};
</script>
<style lang="less" scoped>
.member-info {
  background-image: linear-gradient(to bottom, #01b4ff, #198eff);
  padding:0!important;
  .member-head {
    padding: 15px 10px;
    display: flex;
    // align-items: center;
    align-items: stretch;
    justify-content: space-between;
    &__avatar {
      position: relative;
      width: 50px;
      height: 50px;
      align-self: center;
      & > img {
        border-radius: 50%;
      }
      .barge {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 18px;
        height: 18px;
        background-color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .fa {
          font-size: 14px;
          &.fa-mars {
            color: #037de0;
          }
          &.fa-venus {
            color: #f3499c;
          }
        }
      }
    }
    &__main {
      padding-left: 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      .info {
        color: #fff;
        display: flex;
        font-size: 14px;
        font-weight: 600;
        line-height: 1;
        margin-bottom: 8px;
        .emphasis-btn {
          padding-left: 12px;
        }
        .icon-vip {
          position: relative;
          margin-left: 8px;
          padding: 2px;
          background-color: #c7c7c7;
          font-size: 10px;
          line-height: 1;
          font-weight: normal;
          color: #fff;
          border-radius: 2px;
          &::after {
            position: absolute;
            content: " ";
            left: 0;
            bottom: -3px;
            width: 0;
            height: 0;
            border-width: 6px 6px 0;
            border-style: solid;
            border-color: #c7c7c7 transparent transparent;
            transform: rotate(10deg);
          }
          &.on {
            background-color: #ff9933;
            &::after {
              border-color: #ff9933 transparent transparent;
            }
          }
        }
      }
      .desc {
        display: flex;
        font-size: 14px;
        color: #fff;
        margin-bottom: 8px;
        .level {
          font-size: 12px;
          padding: 2px 8px;
          background-color: rgba(0, 0, 0, 0.4);
          border-radius: 30px;
          margin-right: 9px;
        }
      }
      .tags-list {
        font-size: 12px;
        color: #fff;
        .tags-item {
          float: left;
          padding: 2px 8px;
          background-color: rgba(0, 0, 0, 0.4);
          margin-right: 9px;
          margin-bottom: 9px;
          word-break: keep-all;
        }
        .add-tags {
          float: left;
          color: #ff9933;
          font-size: 12px;
          padding: 2px 8px;
          background-color: #fff;
        }
      }
    }
    &__after {
      display: flex;
      align-items: center;
      margin-right: 15px;
      padding-left: 32px;
      .fa {
        font-size: 14px;
        color: #fff;
      }
    }
  }
  .member-card {
    padding-bottom: 12px;
    display: flex;
    &__item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      .name {
        font-size: 16px;
        color: #fff;
      }
      .num {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
      }
    }
  }
}
</style>