<template>
  <div style="height:100%">
    <view-box  body-padding-top="50px">
    <x-header
    slot="header" 
      :left-options="{showBack: true,backText: ''}"
      class="header"
      style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    >{{titleArr[remindTypeCode]}}</x-header>

<div class="messageTab">
     <tab custom-bar-width="75px" v-if="remindTypeCode == 1">
      <tab-item selected @on-item-click="toggleTab">未提醒</tab-item>
      <tab-item @on-item-click="toggleTab">已提醒</tab-item>
     </tab>
</div>
    <div :class="[remindTypeCode == 1? 'container' : '']">
      <!-- 会员转入 转出 -->
      <div v-if="remindTypeCode == 4 || remindTypeCode == 5">
        <div v-for="(item, index) in list" :key="index">
          <van-panel style="margin-top:8px;">
            <template slot="header">
              <div class="card-header">
                <div class="card-title">
                  <span style="font-size:16x;font-weight:700;">{{item.memberName}}</span>
                  <i
                    v-if="item.sex == '男'"
                    class="fa fa-mars"
                    style="color:#77d3ee"
                    aria-hidden="true"
                  ></i>
                  <i
                    v-if="item.sex == '女'"
                    class="fa fa-venus"
                    style="color:#fd39a9"
                    aria-hidden="true"
                  ></i>
                  <span v-if="remindTypeCode == 4">{{item.memberTier}}</span>
                  <span v-if="remindTypeCode == 5">转交时间: {{item.transferTime | dateFormat('YYYY/MM/DD')}}</span>
                </div>
                <!--<van-icon size="18px" color="#999999" name="arrow"/>-->
              </div>
            </template>
            <template slot="default">
              <div class="card-body" v-if="remindTypeCode == 4">
                <div>
                  <span>毛利贡献：{{item.grossCont || 0}}</span>
                  <span>医保卡余额：{{item.medicareMoney || 0}}</span>
                </div>
                <div>
                  <span>可用积分：{{item.memberIntegral || 0}}</span>
                  <span>入会时间：{{item.joinTime | dateFormat('YYYY/MM/DD')}}</span>
                </div>
                <div>
                  <span>消费次数：{{item.orderAmt || 0}}</span>
                  <span>最近消费时间：{{item.lastOrderDate | dateFormat('YYYY/MM/DD')}}</span>
                </div>
                <div>
                  <span>可用优惠券：{{item.couponNum || 0}}</span>
                  <span>最近消费明细：{{item.lastOrderDate | dateFormat('YYYY/MM/DD')}}</span>
                </div>
                <!-- <div>
                  <span v-if="item.inUserName">转入人: {{item.inUserName}}</span>
                  <span v-if="item.outUserName">转出人: {{item.outUserName}}</span>
                </div> -->
              </div>
            </template>
            <template slot="footer">
              <div class="card-footer" v-if="remindTypeCode == 4">
                转交时间: {{item.transferTime | dateFormat('YYYY/MM/DD')}}
              </div>
            </template>
          </van-panel>
          <!-- <div class="item-footer">
            <a class="handle-btn" :href="'tel:' + item.memberPhone">
              <i class="fa fa-mobile" aria-hidden="true"></i>
              打电话
            </a>
            <div class="handle-btn" @click="openDia(item)">
              <i class="fa fa-bell" aria-hidden="true"></i>
              确认提醒
            </div>
          </div>-->
        </div>
      </div>
      <!-- 用券提醒 -->
      <div v-if="remindTypeCode == 1" class="mymember-item">
        <div v-for="(item, index) in list" :key="index" style="padding:0 10px;">
          <div class="coup-content">
            <div class="coup-header">
              <span style="font-size:16px;font-weight:700;">{{item.voucherName}}</span>
              <span>未使用</span>
            </div>
    
            <div class="coup-body">
              <div class="cell">姓名：{{item.memberName}}</div>
          <div class="cell" style="flex: 0 0 45%;">等级：{{item.memberGrade}}<span  style="margin-left:3px;font-size: 12px;">({{item.gradingIntegral || 0}})</span></div>
          <div class="cell">毛利贡献：{{item.grossCont}}</div>
          <div class="cell" style="flex: 0 0 45%;">医保卡余额：{{item.medicareMoney}}</div>
          <div class="cell">最近消费时间：{{item.lastOrderDate | dateFormat('YYYY/MM/DD')}}</div>
          <router-link class="cell" style="flex: 0 0 45%;" :to="{name: 'buyList', params: {custNo: item.memberId}}">
            消费明细：
            <!-- {{item.lastOrderTime ? item.lastOrderTime.substring(0, 10) : ''}} -->
            <i class="fa fa-calendar" aria-hidden="true"></i>
          </router-link>
          <div style="color:#5c5c5c">劵有效期：{{item.beginDate | dateFormat('YYYY/MM/DD')}} - {{item.endTime | dateFormat('YYYY/MM/DD')}}</div>
              <!-- <div class="body-right">
                <div class="body-item">
                  <span>{{item.memberName}}</span>
                </div>
                <div
                  class="body-item"
                >{{item.beginDate | dateFormat('YYYY/MM/DD')}} - {{item.endTime | dateFormat('YYYY/MM/DD')}}</div>
              </div> -->
            </div>
            <div class="item-footer" v-if="remindStatus == '未处理'">
              <a class="handle-btn" :href="'tel:' + item.memberPhone">
                <i class="fa fa-mobile" aria-hidden="true"></i>
                打电话
              </a>
              <a class="handle-btn" @click="openDia(item)">
                <i class="fa fa-bell" aria-hidden="true"></i>
                确认提醒
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- 入会周年 挽留提醒 -->
      <div v-if="remindTypeCode == 2 || remindTypeCode == 3">
        <div v-for="(item, index) in list" :key="index">
          <div class="yaer-content">
            <div class="yaer-right">
              <div class="yaer-item">
                <span style="font-size:16x;font-weight:700;">{{item.memberName}}</span>
                <i
                  v-if="item.sex == '男'"
                  class="fa fa-mars"
                  style="color:#77d3ee"
                  aria-hidden="true"
                ></i>
                <i
                  v-if="item.sex == '女'"
                  class="fa fa-venus"
                  style="color:#fd39a9"
                  aria-hidden="true"
                ></i>
                <span>{{item.memberTier}}</span>
              </div>
              <div class="yaer-item spe">
                <span>手机号: {{item.memberPhone | telFormat}}</span>
                <span>
                  <van-icon size="18px" color="#999999" name="arrow" @click="goRoute(item.memberId)"/>
                </span>
              </div>
              <div class="yaer-item">
                <span>入会时间: {{item.joinTime | dateFormat}}</span>
              </div>
              <div v-if="remindTypeCode == 3" class="yaer-item">
                <span>{{item.describe}}</span>
              </div>
            </div>
          </div>
          <div class="item-footer">
            <a class="handle-btn" :href="'tel:' + item.memberPhone">
              <i class="fa fa-mobile" aria-hidden="true"></i>
              打电话
            </a>
            <a class="handle-btn" @click="openDia(item)">
              <i class="fa fa-bell" aria-hidden="true"></i>
              确认提醒
            </a>
          </div>
        </div>
      </div>
      <!-- 复购提醒 -->
      <div v-if="remindTypeCode == 7|| remindTypeCode == 6">
        <div v-for="(item, index) in list" :key="index">
          <div class="yaer-content">
            <div class="yaer-right">
              <div class="yaer-item">
                <div>
                  <span style="font-size:16x;font-weight:700;">{{item.memberName}}</span>
                  <i
                    v-if="item.sex == '男'"
                    class="fa fa-mars"
                    style="color:#77d3ee"
                    aria-hidden="true"
                  ></i>
                  <i
                    v-if="item.sex == '女'"
                    class="fa fa-venus"
                    style="color:#fd39a9"
                    aria-hidden="true"
                  ></i>
                  <span>{{item.memberTier}}</span>
                </div>
                <div>{{item.describe}}</div>
              </div>
              <div class="yaer-item spe">
                <span>手机号: {{item.memberPhone | telFormat}}</span>
                <span>
                  <van-icon size="18px" color="#999999" name="arrow" @click="goRoute(item.memberId)"/>
                </span>
              </div>
              <div class="yaer-item spe">
                <span>{{item.productName}} {{item.productSpec}} {{item.productUsage}}</span>
                <span>{{item.lastOrderDate | dateFormat}}</span>
              </div>
            </div>
          </div>
          <div class="item-footer">
            <a class="handle-btn" :href="'tel:' + item.memberPhone">
              <i class="fa fa-mobile" aria-hidden="true"></i>
              打电话
            </a>
            <a class="handle-btn" @click="openDia(item)">
              <i class="fa fa-bell" aria-hidden="true"></i>
              确认提醒
            </a>
          </div>
        </div>
      </div>

      <!-- <div class="footer">
        <div>
          <van-checkbox v-model="checkedAll">全选</van-checkbox>
        </div>
        <div class="shift" @click="comfirRemind">确定提醒</div>
      </div>-->
      <infinite-loading @infinite="infiniteHandler" spinner="circles" :identifier="infiniteId">
        <no-data v-if="!list.length" slot="no-results"></no-data>
        <load-more v-else slot="no-results" :show-loading="false" tip="没有更多了"></load-more>
        <no-data v-if="!list.length" slot="no-more"></no-data>
        <load-more v-else slot="no-more" :show-loading="false" tip="没有更多了"></load-more>
      </infinite-loading>
      <!-- 提醒弹窗 -->
      <van-dialog v-model="popUpShow" title="确认已提醒" show-cancel-button @confirm="handleConfim">
        <group title>
          <x-textarea :max="80" v-model="remindContent" placeholder="请输入备注"></x-textarea>
        </group>
      </van-dialog>
      <!-- <div v-transfer-dom>
        <popup v-model="popUpShow" @on-hide="popClose">
          <div class="popup-header">
            <span @click="popUpShow = false">取消</span>
            <span @click="handleConfim">确定</span>
          </div>
          <group title="提醒类型">
            <div style="padding:15px;">
              <checker
                v-model="remindType"
                default-item-class="demo1-item"
                selected-item-class="demo1-item-selected"
              >
                <checker-item value="微信">微信</checker-item>
                <checker-item value="短信">短信</checker-item>
              </checker>
            </div>
          </group>
          <group title="提醒内容">
            <x-textarea :max="80" v-model="remindContent" placeholder="请输入提醒内容"></x-textarea>
          </group>
        </popup>
      </div>-->
    </div>
  </view-box>
  </div>
</template>

<script>
import Vue from "vue";
import InfiniteLoading from "vue-infinite-loading";
import NoData from "@/components/common/NoData";
import {
  XHeader,
  LoadMore,
  ViewBox,
  TransferDom,
  Popup,
  Checker,
  CheckerItem,
  Group,
  XTextarea,
  Card,
  Tab, TabItem,
} from "vux";
import {
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Panel,
  Icon,
  Dialog
} from "vant";
import { getRemindList, confirmRemind } from "@/api/message";
Vue.use(Cell)
  .use(CellGroup)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Panel)
  .use(Dialog)
  .use(Icon);

export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    InfiniteLoading,
    LoadMore,
    ViewBox,
    Checker,
    CheckerItem,
    Popup,
    Group,
    XTextarea,
    Card,
    NoData,
    Tab, TabItem,
  },
  data() {
    return {
      popUpShow: false,
      titleArr: [
        "",
        "用券提醒",
        "入会周年提醒",
        "挽留提醒",
        "会员转入提醒",
        "会员转出提醒",
        "用药提醒",
        "复购提醒"
      ],
      remindTypeCode: "",
      list: [],
      currentPage: 1,
      paginator: {
        currentPage: 1,
        totalPages: 1
      },
      infiniteId: +new Date(),
      hasMore: true,
      remindType: "微信",
      remindContent: "",
      remindList: [],
      remindId: "",
      remindStatus: '未处理',
    };
  },
  watch: {},
  methods: {
    toggleTab (i){
      console.log(i)
      if (i === 0) {
        this.remindStatus = '未处理'
      } else {
        this.remindStatus = '已处理'
      }
      this.list = []
      this.currentPage = 1
      this.infiniteHandler()
    },
    infiniteHandler($state) {
      let params = {
        remindTypeCode: this.remindTypeCode,
        currentPage: this.currentPage,
        pageSize: 10
      }
      if (this.remindTypeCode == 1) {
        params.remindStatus = this.remindStatus
      }
      getRemindList(params).then(res => {
        if (+res.code === 200) {
          let { list, paginator } = res.data;
          if (this.currentPage <= paginator.totalPages) {
            this.hasMore = true;
            this.currentPage++;
            this.list.push(...list);
            $state.loaded();
          } else {
            this.hasMore = false;
            this.currentPage++;
            this.list.push(...list);
            $state.complete();
          }
          console.log(this.list);
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    openDia(item) {
      this.remindContent = "";
      this.popUpShow = true;
      this.remindId = item.remindId;
    },
    handleConfim() {
      if (!this.remindContent) {
        this.$vux.toast.show({
          text: "请填写备注",
          time: 2000,
          type: "text"
        });
        return;
      }
      let remindId = this.remindId;
      let remindType = this.titleArr[this.remindTypeCode];
      let content = this.remindContent;
      let remindWay = "电话";
      let params = [];
      params.push({
        remindId,
        remindType,
        remindWay,
        content
      });
      console.log(this.remindList);
      confirmRemind(params).then(res => {
        if (+res.code === 200) {
          this.$vux.toast.show({
            text: "已确认提醒",
            time: 2000,
            type: "text"
          });
          this.checkedAll = false;
          this.currentPage = 1;
          this.list = [];
          // this.infiniteHandler();
          this.infiniteId = +new Date()
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
        // this.popUpShow = false;
      });
    },
    popClose() {
      this.remindType = "微信";
      this.remindContent = "";
    },
    comfirRemind() {
      if (!this.selectList.length) {
        this.$vux.toast.show({
          text: "请选择提醒对象",
          time: 1000,
          type: "text"
        });
        return;
      }
      this.popUpShow = true;
    },
    goRoute (id) {
      this.$router.push({
        name: "memberManage",
        query: {
          custNo: id
        }
      });
    }
  },

  created() {
    this.remindTypeCode = this.$route.query.remindTypeCode;
    // this.getData();
  }
};
</script>

<style lang="less" scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 100;
  border-top: 1px solid #eee;
  padding: 10px 20px;
  box-shadow: 0 -2px 2px #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .shift {
    display: inline-block;
    border: 1px solid #f8bb64;
    padding: 1px 20px;
    border-radius: 50px;
    color: #f8bb64;
  }
}
.null-data {
  display: flex;
  justify-content: center;
  padding: 10px;
  font-size: 13px;
  color: #666;
}
.card-header {
  padding: 5px 10px;
  display: flex;
  padding-top: 8px;
  justify-content: space-between;
  align-items: center;
  color: #333;
  .card-title {
    display: flex;
    align-items: center;
  }
  i {
    margin: 0 5px;
  }
}
.card-body {
  padding: 5px 10px;
  color: #5c5c5c;
  font-size: 12px;
  > div {
    display: flex;
    padding: 3px 0;
    align-items: center;
    > span {
      flex: 1;
    }
  }
}
.container {
	margin-top:11%;
  // height: 100%;
}

.null-data {
  display: flex;
  justify-content: center;
}
.demo1-item {
  border: 1px solid #ececec;
  padding: 5px 15px;
}
.demo1-item-selected {
  border: 1px solid #1989fa;
  color: #1989fa;
}
.popup-header {
  padding: 5px;
  display: flex;
  justify-content: space-between;
  background: #fff;
  font-size: 16px;
  > span {
    color: #1989fa;
  }
}
.coup-content {
  background: #fff;
  margin-top: 10px;
  border-radius: 15px;
}
.coup-header {
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f1f1f1;
}
.coup-body {
  padding: 10px;
  display: flex;
    flex-wrap: wrap;
  .body-right {
    flex: 1;
  }
  .body-item {
    display: flex;
    justify-content: space-between;
  }
}
.yaer-content {
  display: flex;
  background: #fff;
  margin-top: 10px;
  .yaer-left {
    width: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .yaer-right {
    font-size: 12px;
    color: #333;
    flex: 1;
    padding: 5px 0;
    padding-right: 10px;
    padding-left: 15px;
    .spe {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.item-footer {
  border-bottom-right-radius:0.4rem;
border-bottom-left-radius:0.4rem;
  display: flex;
  padding: 10px 0;
  border-top: 1px solid #f1f1f1;
  background-color: #fff;
  .handle-btn {
    position: relative;
    flex: 0 0 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #333;
    &:not(:nth-last-child(1))::after {
      position: absolute;
      content: " ";
      top: 0;
      right: 0;
      height: 100%;
      width: 1px;
      background-color: #c7c7c7;
    }
    .fa {
      font-size: 14px;
      padding-right: 4px;
    }
  }
}
.mymember-item {
  overflow: hidden;
  &__head {
    padding: 10px;
    .wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &::after {
        position: absolute;
        content: " ";
        left: 0;
        bottom: -10px;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(
          to right,
          #c7c7c7 0%,
          #c7c7c7 50%,
          transparent 50%
        );
        background-size: 10px 1px;
        background-repeat: repeat-x;
      }
    }
    .main {
      flex: 1;
      display: flex;
      align-items: center;
      .avatar {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      .desc {
        flex: 1;
        padding-left: 10px;
        .info {
          font-size: 14px;
          color: #333;
          display: flex;
          align-items: center;
          font-weight: 600;
          margin-bottom: 10px;
          .fa {
            font-size: 14px;
            padding: 0 8px;
            &.fa-mars {
              color: #037de0;
            }
            &.fa-venus {
              color: #f3499c;
            }
          }
          .sign {
            font-size: 12px;
            font-weight: normal;
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
        .tags-list {
          display: flex;
          .tags {
            font-size: 12px;
            line-height: 1;
            padding: 3px;
            color: #fff;
            background-color: #ffcccc;
            border-radius: 3px;
            margin-right: 8px;
          }
        }
      }
    }
    .after {
      .fa {
        font-size: 14px;
        color: #ccc;
        -webkit-text-stroke: 1px #fff;
      }
    }
  }
  .cell {
      flex: 0 0 55%;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #5c5c5c;
      line-height: 24px;
      .fa {
        margin-left: 3px;
      }
    }
  &__main {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    
  }
  &__foot {
    display: flex;
    padding: 10px 0;
    .handle-btn {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #333;
      &:not(:nth-last-child(1))::after {
        position: absolute;
        content: " ";
        top: 0;
        right: 0;
        height: 100%;
        width: 1px;
        background-color: #c7c7c7;
      }
      .fa {
        font-size: 14px;
        padding-right: 4px;
      }
    }
    &.cell3 {
      .handle-btn {
        flex: 0 0 33.333%;
      }
    }
  }
}
.messageTab{
	width: 100%;
	position: fixed;
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-bar-inner{
  background:rgba(0,202,172,1)
}
</style>
