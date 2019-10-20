<template>
  <div class="container">
    
    <!-- 顶部 -->
    <div class="header">

      <div class='userinfoTop'>
      <a class="user-info" @click="goUserInfo">
        <img
          :src="userInfo.userHeadimg ? userInfo.userHeadimg : `/src/assets/images/no-img.jpg`"
          alt
          class="logo"
        >
          编号：{{userInfo.userCode}} {{userInfo.userName}}
          <span class="tag">{{userInfo.positionName}}</span>
      </a>


      </div>
 
     <!-- 搜索栏 -->
      <div class="search" v-show="!menuFlag">
        <group>
          <x-input v-model="mobile" type="tel" placeholder="查询会员手机号">
            <a slot="right" @click="goDetails" class="fa fa-search search-icon"></a>
          </x-input>
        </group>
      </div>
      
    </div>
    <!--  -->
  <div style="width:100%;height:100px;background:rgba(0,201,172,1);margin-top:-1px;">
    <div class="top-nav-bar" ref="element">
      <tab :line-width="2" custom-bar-width="60px">
        <tab-item selected @on-item-click="toggleTab">今日</tab-item>
        <tab-item @on-item-click="toggleTab">本月</tab-item>
      </tab>
      <div class="intro-box">
        <div class="left">
          <div style="color:#666;font-weight:blod;">归属会员总人数</div>
          <div class="number">
            <span>{{actionInfo.memNum || 0}}</span>
            <!--<span>></span>
            <span></span>-->
          </div>
        </div>
        <div class="right">
          <div style="color:#666;font-weight:blod;">拉新总人数</div>
          <div class="number">
            <span>{{actionInfo.newNum || 0}}</span>
            <!--<span>></span>
            <span></span>-->
          </div>
        </div>
        <div class="left mt-10">
          <div style="color:#666;font-weight:blod;">归属会员到店人数</div>
          <div class="number">
            <span>{{actionInfo.conMemNum || 0}}</span>
            <!--<span>></span>
            <span></span>-->
          </div>
        </div>
        <div class="right mt-10">
          <div style="color:#666;font-weight:blod;">鼓励金</div>
          <div class="number">
            <span>{{actionInfo.bonus || 0}}</span>
            <!--<span>></span>
            <span></span>-->
          </div>
        </div>
      </div>
    </div>
  </div>

 <div :style="{height:height+'px'}"></div>

    <!-- 通知消息轮播 v-if="messageData.length"-->
    <div class="message" v-if="messageData.length">
      <img :src="ImgMessage" class="message-logo" alt>
      <div class="message-box">
        <swiper
          auto
          height="30px"
          direction="vertical"
          :interval="2000"
          class="text-scroll"
          :show-dots="false"
        >
          <swiper-item v-for="(item, index) in messageData" :key="index">
            <a class="message-box-item" @click="goMessage(item)">
              <span class="message-name">{{item.startDate | dateFormat('MM月DD日')}}{{item.typeName}}:</span>
              &nbsp;
              <span class="message-desc">
                [
                <span class="message-number">{{item.num}}</span>
                ]
                个{{item.relaName}}待维系
              </span>
            </a>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <!-- 菜单栏 -->
    <div class="nav-content" :style="{'height': messageData.length ? '41vh': '48vh'}">
      <a class="nav-item" v-for="(item, index) in list" :key="index" @click="goRoute(item.moduleUrl)">
        <div class="nav-item-img">
          <img v-if="item.moduleUrl == 'more'" :src="moreImg" alt="">
          <img v-else-if="item.moduleUrl == 'ticketExchange'" :src="couponImg" alt="">
          <img v-else :src="`/src/assets/images/console/${item.moduleIco}.png`" alt>
        </div>
        <div class="nav-item-name">{{item.moduleName}}</div>
      </a>
    </div>
  </div>
</template>

<script>
// 用户头像

import ImgMessage from "@/assets/images/console/u441.png"; // 通知消息 图片
import { Tab, TabItem, Group, Cell, XInput, Swiper, SwiperItem } from "vux";
import { getUserInfo } from "@/api/user";
import {
  homeRelation,
  actionStatistics,
  staffTotal,
  getUserAuth,
  detailByMobile
} from "@/api/home";
import moreImg from '@/assets/images/console/u499.png'
import couponImg from '@/assets/images/console/u489.png'
import { BTN_EQUITY } from "@/utils/storage";

export default {
  name: "Home",
  components: {
    Tab,
    TabItem,
    Group,
    Cell,
    XInput,
    Swiper,
    SwiperItem
  },
  data() {
    return {
      couponImg,
      moreImg,
      userInfo: {},
      ImgMessage, // 消息图片
      menuFlag: false, // 是否显示更多菜单
      list: [],
      navList: [],
      btnList: [],
      /*navList: [
        { name: '关系维系', routerName: 'relationship', img: Img8 },
        { name: '会员管理', routerName: 'memberManage', img: Img10 },
        { name: '邀请入会', routerName: 'inviteQRcode', img: Img5 },
        { name: '我的关注', routerName: 'myAttention', img: Img4 },
        { name: '注册会员', routerName: '', img: Img5 },
        { name: '药品查询', routerName: 'drugQuery', img: Img12 },
        { name: '慢病会员', routerName: '', img: Img9 },
        { name: '我的名片', routerName: 'myCard', img: Img3 },
        { name: '导购意见箱', routerName: 'shoppersOpinion', img: Img14 },
        { name: '通告管理', routerName: 'callboard', img: Img11 },
        { name: '活动管理', routerName: 'activity', img: Img2 },
        { name: '券管理', routerName: 'ticket', img: Img6 },
        { name: 'O2O管理', routerName: 'o2o', img: Img1 },
        { name: '培训中心', routerName: 'trainCenter', img: Img15 },
        { name: '论坛', routerName: '', img: Img13 }
      ],*/
      mobile: "",
      messageData: [],
      actionInfo: {},
      currentIndex: 0,
      isMore: false,
      height:""
    };
  },
  props: {},
  computed: {},
  watch: {
    menuFlag(newVal) {
      let idx = newVal ? this.navListTemplate.length : 4;
      this.getList(idx);
    }
  },
  created() {
    this.getAuth();//获取用户功能模块权限
    this.getData();//请求用户的信息
    this.getMessage();//首页维系任务消息通知轮播
    this.getAction();//请求今日和本月的的数据
  },
  mounted() {
    this.heights()
    window.onresize = () => {
         this.heights()
    }
  },
  methods: {
    heights(){
      let that = this;
      let height= that.$refs.element.offsetHeight - 100 || '';
      that.height = height;
    },
    goUserInfo () {
      this.$router.push({
        path: '/editUserInfo'
      })
    },
    goMessage(item) {
      let { type } = item,
        routerName = "";
      if (type === 0) routerName = "keepTask";
      if (type === 1) routerName = "inviteTask";
      if (type === 2) routerName = "customTask";
      if (!routerName) return;
      this.$router.push({
        path: routerName,
        query: {
          type: type
        }
      });
    },
    goDetails() {
      let reg = /^[1]([3-9])[0-9]{9}$/;
      if (!reg.test(this.mobile)) {
        this.$vux.toast.show({
          text: "请输入正确的手机号",
          time: 2000,
          type: "text"
        });
        return;
      } else {
        detailByMobile({
          mobile: this.mobile
        }).then(res => {
          if (+res.code === 200) {
            if (res.data) {
              this.$router.push({
                // name: "memberDetail",
                name: "memberManage",
                // params: {
                query: {
                  custNo: res.data.custNo
                }
              });
            } else {
              this.$vux.toast.show({
                text: "未找到该会员",
                time: 2000,
                type: "text"
              });
            }
            // this.userInfo = res.data;
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
    getData() {//请求用户的信息
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
    getMessage() {//首页维系任务消息通知轮播
      homeRelation({
        userCrmId: this.userInfo.crmId
      }).then(res => {
        if (+res.code === 200) {
          // console.log(res)
          this.messageData = res.data;
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    //
    getAction() {
      //  D/W/M
      let type = ["day", "month"];
      actionStatistics({
        queryType: type[this.currentIndex]
      }).then(res => {
        if (res.code === 200) {
          this.actionInfo = res.data;
        }
      });
    },
    //
    getAuth() {//获取用户功能模块权限
      getUserAuth({}).then(res => {
        if (res.code === 200) {
          console.log(res)
          let list = [];
          res.data.forEach(el => {
            el.moduleType == "view" ? list.push(el) : this.btnList.push(el);
          });
          this.navList = list;
          if (list.length > 12) {
            for (let i = 0; i < 11; i++) {
              this.list.push(list[i]);
            }
            this.list.push({
              moduleName: "更多",
              moduleIco: "u499",
              moduleUrl: "more"
            });
          } else {
            this.list = list;
          }
        }
        this.$utils.setLocalData(BTN_EQUITY, this.btnList);//把权限按钮给保存到本地
      });
    },
    toggleTab(index) {//切换今日和本月的index
      this.currentIndex = index;
      this.getAction();//请求今日和本月的的数据
    },
    showMoreMenu(flag) {
      this.menuFlag = flag;
    },
    goRoute(name) {//点击菜单跳转页面
      if (name == "more") {
        this.list = this.navList;
        return;
      }
      this.$router.push({ name });
    }
    // 获取菜单列表
    // getList (idx = 4) {
    //   this.navList = this.navListTemplate.filter((item, index) => index < idx)
    // }
  }
};
</script>
<style lang="less" scoped>
.colorPosi{
      width:100%;
      height: 200px;
      background:pink;
      position:absolute;
    }
.container {
  background-color: #f2f2f2;
  height: 100%;
  // display: flex;
  // flex-direction: column;
  // 顶部
  .header {
    height: 120px;
    //height: 30vh;
    box-sizing: border-box;
    padding: 10px 20px;
    color: #fff;
    background: rgba(0, 202, 172, 1);
    .user-info {
      display: flex;
      align-items: center;
      font-size: 15px;
      width:95%;
      margin:0 auto;
    }
    .logo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .tag {
      display: inline-block;
      font-size: 14px;
      border: 1px solid #fff;
      padding: 0 5px;
      border-radius: 8px;
      margin-left:10px;
    }
  }
  // 搜索栏
  .search {
    margin: 3% auto;
    width:96%;
    /deep/ .weui-cells {
      margin: 0;
      background-color: transparent;
      // position: relative;
      // line-height: 20px;
      &::before,
      &::after {
        display: none;
      }
      .weui-cell {
        padding: 5px 10px;
        margin: 0 auto;
        background-color: #fff;
        border: 1px solid #dfdfdf;
        border-radius: 30px;
      }
      .weui-input {
        font-size: 13px;
        color: #333;
        display: flex;
        align-items: center;
        &::placeholder {
          font-size: 13px;
        }
      }
    }
  }
  .top-nav-bar {
    width: 90%;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0 10px;
    border-radius: 7px;
    //margin-top: -22%;
    color: #fff;
    background: #fff;
    box-shadow:0px 5px 10px #ccc;
    // background: linear-gradient(top, #03b2ff, #1790fe);
    /deep/ .vux-tab {
      background-color: transparent;
      .vux-tab-item {
        color: rgba(0, 202, 172, 1);
        &.vux-tab-item {
          background-size: 0;
        }
      }
      .vux-tab-bar-inner {
        background-color: rgba(0, 202, 172, 1);
      }
    }
    .intro-box {
      display: flex;
      flex-wrap: wrap;
      margin: 0 5%;
      padding: 7px 0;
      color: #999;
      font-size: 14px;
      .left,
      .right {
        width: 50%;
        font-weight: 700;
        text-align: center;
        .number {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
      }
      .mt-10 {
        margin-top: 6px;
      }
    }
  }
  // 消息栏
  .message {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    font-size: 13px;
    margin-top: 1vh;
    height: 6vh;
    padding: 5px 15px;
    color: #999;
    background-color: #fff;
    .message-logo {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
    .message-box {
      flex: 1;
      max-height: 50px;
      overflow: auto;
      .message-box-item {
        display: flex;
        height: 100%;
        align-items: center;
        .message-name {
          color: #333;
          font-size: 14px;
          font-weight: bold;
          // flex:45%;
        }
        .message-number {
          color: #ff5a5a;
        }
        .message-desc {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 55%;
          color: #333;
        }
      }
    }
  }
  // 菜单栏
  .nav-content {
    margin: 1vh 0;
    padding: 5px;
    border-radius: 4px;
    height: 41vh;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    overflow: scroll;
    // margin-bottom: 60px;
    // margin-bottom: 9vh;
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 33.33%;
      margin: 8px 0;
      .nav-item-img {
        width: 22px;
        height: 22px;
        text-align: center;
        img {
          width: 100%;
        }
      }
      .nav-item-name {
        font-size: 14px;
        margin-top: 5px;
      }
      // .banner {
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      // width: 52px;
      // height: 52px;
      // background: url('../../assets/images/console/u418.png') no-repeat;
      // background-size: 52px 52px;
      // img {
      //   width: 50%;
      //   height: 50%;
      // }
      // }
    }
    .button {
      width: 100%;
      text-align: center;
      font-size: 13px;
      color: #ccc;
      > span {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .fa {
        margin-left: 5px;
      }
    }
  }
}

</style>