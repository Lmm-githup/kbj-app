<template>
  <div class="statis-index">
    <div ref="myheader">
      <div class="top">
        <div class="header">
          <div class="header-title">统计</div>
        </div>
        <div class="menus" v-if="menus.length">
          <a
            class="menu-item"
            @click="goRanking(item, index)"
            v-for="(item, index) in menus"
            :key="index"
          >
            <img :src="item.icon" alt>
            <span>{{item.text}}</span>
          </a>
        </div>
      </div>
    </div>
    <group v-if="data1.length">
      <cell title="业绩统计"></cell>
      <div class="view-title">
        <button-tab>
          <button-tab-item selected @on-item-click="select1">7天</button-tab-item>
          <button-tab-item @on-item-click="select1">30天</button-tab-item>
        </button-tab>
        <div class="select" @click="crmPup(1)">
          <span>{{crmValue1}}</span>
          <span>▼</span>
        </div>
        <!-- <selector  :options="crmList" v-model="crmId1"></selector> -->
      </div>
      <v-chart v-if="data1.length" :data="data1">
        <v-line series-field="type"/>
      </v-chart>
    </group>

    <group v-if="data2.length">
      <cell title="会员消费统计"></cell>
      <div class="view-title">
        <button-tab>
          <button-tab-item selected @on-item-click="select2">7天</button-tab-item>
          <button-tab-item @on-item-click="select2">30天</button-tab-item>
        </button-tab>
        <div class="select" @click="crmPup(2)">
          <span>{{crmValue2}}</span>
          <span>▼</span>
        </div>
        <!-- <selector  :options="crmList" v-model="crmId1"></selector> -->
      </div>
      <v-chart v-if="data2.length" :data="data2">
        <v-line series-field="type"/>
      </v-chart>
    </group>

    <group v-if="data3.length">
      <cell title="会员等级统计"></cell>
      <div class="view-title">
        <button-tab>
          <button-tab-item selected @on-item-click="select3">7天</button-tab-item>
          <button-tab-item @on-item-click="select3">30天</button-tab-item>
        </button-tab>
        <div class="select" @click="crmPup(3)">
          <span>{{crmValue3}}</span>
          <span>▼</span>
        </div>
        <!-- <selector  :options="crmList" v-model="crmId1"></selector> -->
      </div>
      <v-chart v-if="data3.length" :data="data3">
        <v-line series-field="type"/>
      </v-chart>
    </group>

    <group v-if="data4.length">
      <cell title="会员状态统计"></cell>
      <div class="view-title">
        <button-tab>
          <button-tab-item selected @on-item-click="select4">7天</button-tab-item>
          <button-tab-item @on-item-click="select4">30天</button-tab-item>
        </button-tab>
        <div class="select" @click="crmPup(4)">
          <span>{{crmValue4}}</span>
          <span>▼</span>
        </div>
        <!-- <selector  :options="crmList" v-model="crmId1"></selector> -->
      </div>
       <v-chart v-if="data4.length" :data="data4">
        <v-line series-field="type"/>
      </v-chart>
      
     
    </group>
    <van-popup v-model="showPopup" position="bottom">
      <van-picker show-toolbar :columns="crmList" @cancel="showPopup = false"  @confirm="onConfirm"/>
    </van-popup>
    
    
     <div class="noNumber" w-if="!data1.length||!data2.length||!data3.length||!data4.length">
       <div class="image">
     	   <img src="@/assets/images/nonumber/nonumber.png"></img>
       </div>
     </div>
  </div>
</template>

<script>
import { BTN_EQUITY } from "@/utils/storage";
import {
  XHeader,
  Cell,
  Group,
  TransferDomDirective as TransferDom,
  VChart,
  VLine,
  VAxis,
  VTooltip,
  ButtonTab,
  ButtonTabItem,
  Selector
} from "vux";
import Vue from "vue";
import { reportViewList, roleOrgList } from "@/api/statistics";
import memberImg from "@/assets/images/member.png";
import { Popup, Picker } from "vant";

Vue.use(Popup).use(Picker);
export default {
  name: "Statistics",
  components: {
    XHeader,
    Cell,
    TransferDom,
    Group,
    VChart,
    VLine,
    VAxis,
    VTooltip,
    ButtonTab,
    ButtonTabItem,
    Selector
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      showPopup: false,
      menus: [
          {
            icon: "/src/assets/images/mendian.png",
            text: "门店排名",
            value: "store"
          },
          {
            icon: "/src/assets/images/winfo-icon-quyusaomiao.png",
            text: "区域排名",
            value: "area"
          },
          {
            icon: "/src/assets/images/gongsimingcheng.png",
            text: "公司排名",
            value: "company"
          },
          {
            icon: "/src/assets/images/icon_good.png",
            text: "最佳纳新",
            value: "agent"
          },
          {
            icon: "/src/assets/images/xiaoliangzuigao.png",
            text: "最佳客单",
            value: "price"
          },
          {
            icon: "/src/assets/images/wujiaoxing.png",
            text: "明星产品",
            value: "star"
          },
          {
            icon: "/src/assets/images/jiangzhangxunzhang.png",
            text: "挂金商品",
            value: "gold"
          }
        ],
      top: "",
      type1: "",
      crmId1: "",
      crmValue1: "",
      day1: "7",
      data1: [],
      type2: "",
      crmId2: "",
      crmValue2: "",
      day2: "7",
      data2: [],
      type3: "",
      crmId3: "",
      crmValue3: "",
      day3: "7",
      data3: [],
      type4: "",
      crmId4: "",
      crmValue4: "",
      day4: "7",
      data4: [],
      isView: false,
      allCrmId: "",
      crmList: [],
      pupType: ""
    };
  },
  props: {},
  computed: {},
  watch: {},
  created() {
    let equityList = [];
    equityList = this.$utils.getLocalData(BTN_EQUITY, true) || [];
    equityList.forEach(v => {
      if (v.moduleKey == "USER_TOP") {
        this.menus = [
          {
            icon: "/src/assets/images/mendian.png",
            text: "门店排名",
            value: "store"
          },
          {
            icon: "/src/assets/images/winfo-icon-quyusaomiao.png",
            text: "区域排名",
            value: "area"
          },
          {
            icon: "/src/assets/images/gongsimingcheng.png",
            text: "公司排名",
            value: "company"
          },
          {
            icon: "/src/assets/images/icon_good.png",
            text: "最佳纳新",
            value: "agent"
          },
          {
            icon: memberImg,
            text: "会员排名",
            value: "member"
          },
          {
            icon: "/src/assets/images/xiaoliangzuigao.png",
            text: "最佳客单",
            value: "price"
          },
          {
            icon: "/src/assets/images/wujiaoxing.png",
            text: "明星产品",
            value: "star"
          },
          {
            icon: "/src/assets/images/jiangzhangxunzhang.png",
            text: "挂金商品",
            value: "gold"
          }
        ];
      } else if (v.moduleKey == "REPROT_VIEW") {
        this.isView = true;
      }
    });
  },
  mounted() {
    this.getHeaderHight();
    this.$nextTick(() => {
      if (this.isView) {
        this.init();
      }
    });
  },
  filters: {},
   beforeCreate() {//修改整个页面的颜色为白色
       document.querySelector('body').setAttribute('style', 'background:white')
  }, 
  methods: {
    crmPup(val) {
      this.pupType = val;
      this.showPopup = true;
      console.log(this.crmList)
    },
    onConfirm(val) {
      console.log(val)
      if (this.pupType == 1) {
        this.crmId1 = val.orgCrmId
        this.crmValue1 = val.text
      } else if (this.pupType == 2) {
        this.crmId2 = val.orgCrmId
        this.crmValue2 = val.text
      } else if (this.pupType == 3) {
        this.crmId3 = val.orgCrmId
        this.crmValue3 = val.text
      } else if (this.pupType == 4) {
        this.crmId4 = val.orgCrmId
        this.crmValue4 = val.text
      }
      this.type = this.pupType
      this.showPopup = false
      this.initData();
    },
    select1(i) {
      this.type = 1;
      if (i == 0) {
        this.day1 = 7;
        this.initData();
      } else {
        this.day1 = 30;
        this.initData();
      }
    },
    select2(i) {
      this.type = 2;
      if (i == 0) {
        this.day2 = 7;
        this.initData();
      } else {
        this.day2 = 30;
        this.initData();
      }
    },
    select3(i) {
      this.type = 3;
      if (i == 0) {
        this.day3 = 7;
        this.initData();
      } else {
        this.day3 = 30;
        this.initData();
      }
    },
    select4(i) {
      this.type = 4;
      if (i == 0) {
        this.day4 = 7;
        this.initData();
      } else {
        this.day4 = 30;
        this.initData();
      }
    },
    goRanking(v, i) {
      if (i < 4 || v.value == "price") {
        this.$router.push({
          name: "ranking",
          query: {
            typeName: v.text,
            queryType: v.value
          }
        });
      } else if (v.value == "member") {
        this.$router.push({
          name: "memberRanking",
          query: {}
        });
      } else if (v.value == "star") {
        this.$router.push({
          name: "startProduct",
          query: {}
        });
      } else if (v.value == "gold") {
        this.$router.push({
          name: "goldProduct",
          query: {}
        });
      }
    },
    getHeaderHight() {
      console.log(this.$refs);
      this.top = this.$refs.myheader.clientHeight + 15;
    },
    async init() {
      const res = await roleOrgList({});
      if (+res.code === 200) {
        if (res.data.data.length > 0) {
          this.allCrmId = res.data.data[0].orgCrmId;
          this.crmId1 = res.data.data[0].orgCrmId;
          this.crmValue1 = res.data.data[0].orgName;
          this.crmId2 = res.data.data[0].orgCrmId;
          this.crmValue2 = res.data.data[0].orgName;
          this.crmId3 = res.data.data[0].orgCrmId;
          this.crmValue3 = res.data.data[0].orgName;
          this.crmId4 = res.data.data[0].orgCrmId;
          this.crmValue4 = res.data.data[0].orgName;
          this.crmList = [...res.data.data]
        
          this.crmList = this.crmList.map(v => {
            if (v != null) {
              return {
                text: v.orgName,
                orgCrmId: v.orgCrmId
              }
            }
          })
          console.log(this.crmList);
          this.initData();
        }
      }
    },
    async initData() {
      let params = {};
      if (this.type == 1) {
        params.day = this.day1;
        params.crmId = this.crmId1;
      } else if (this.type == 2) {
        params.day = this.day2;
        params.crmId = this.crmId2;
      } else if (this.type == 3) {
        params.day = this.day3;
        params.crmId = this.crmId3;
      } else if (this.type == 4) {
        params.day = this.day4;
        params.crmId = this.crmId4;
      } else {
        params.day = 7;
        params.crmId = this.allCrmId;
      }
      const res = await reportViewList(params);
      if (+res.code === 200) {
        if (this.type == 1) {
          let arr1 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "营业额",
              value: v.yyAmt
            };
          });
          let arr2 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "毛利额",
              value: v.mlAmt
            };
          });
          let newData1 = [];
          newData1.push(...arr1.concat(arr2));
          this.data1 = [...newData1];
        }
        if (this.type == 2) {
          let arr3 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "会员人数",
              value: v.xfNum
            };
          });
          let arr4 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "来客数",
              value: v.lkNum
            };
          });
          let arr5 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "平均客单",
              value: v.pjkPrice
            };
          });
          let newData2 = [];
          newData2.push(...arr3.concat(arr4, arr5));
          this.data2 = [...newData2];
        }
        if (this.type == 3) {
          let arr6 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "普卡会员数",
              value: v.pkNum
            };
          });
          let arr7 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "银卡会员数",
              value: v.ykNum
            };
          });
          let arr8 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "金卡会员数",
              value: v.jkNum
            };
          });
          let arr9 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "铂金卡会员数",
              value: v.bjNum
            };
          });
          let arr10 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "钻石卡会员数",
              value: v.zsNum
            };
          });
          let newData3 = [];
          newData3.push(...arr6.concat(arr7, arr8, arr9, arr10));
          this.data3 = [...newData3];
          console.log(this.data3);
        }
        if (this.type == 4) {
          let arr11 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "活跃会员数",
              value: v.hyNum
            };
          });
          let arr12 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "次活跃会员数",
              value: v.chyNum
            };
          });
          let arr13 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "沉默会员数",
              value: v.cmNum
            };
          });
          let arr14 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "休眠会员数",
              value: v.xmNum
            };
          });
          let arr15 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "欲流失会员数",
              value: v.yulsNum
            };
          });
          let arr16 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "已流失会员数",
              value: v.ylsNum
            };
          });
          let arr17 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "无消费会员数",
              value: v.wxfNum
            };
          });
          let newData4 = [];
          newData4.push(
            ...arr11.concat(arr12, arr13, arr14, arr15, arr16, arr17)
          );
          this.data4 = [...newData4];
        }
        if (!this.type) {
          let arr1 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "营业额",
              value: v.yyAmt
            };
          });
          let arr2 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "毛利额",
              value: v.mlAmt
            };
          });
          this.data1 = arr1.concat(arr2);
          // 会员统计
          let arr3 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "会员人数",
              value: v.xfNum
            };
          });
          let arr4 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "来客数",
              value: v.lkNum
            };
          });
          let arr5 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "平均客单",
              value: v.pjkPrice
            };
          });
          this.data2 = arr3.concat(arr4, arr5);
          // 会员等级
          let arr6 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "普卡会员数",
              value: v.pkNum
            };
          });
          let arr7 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "银卡会员数",
              value: v.ykNum
            };
          });
          let arr8 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "金卡会员数",
              value: v.jkNum
            };
          });
          let arr9 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "铂金卡会员数",
              value: v.bjNum
            };
          });
          let arr10 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "钻石卡会员数",
              value: v.zsNum
            };
          });
          this.data3 = arr6.concat(arr7, arr8, arr9, arr10);
          // 会员状态
          let arr11 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "活跃会员数",
              value: v.hyNum
            };
          });
          let arr12 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "次活跃会员数",
              value: v.chyNum
            };
          });
          let arr13 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "沉默会员数",
              value: v.cmNum
            };
          });
          let arr14 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "休眠会员数",
              value: v.xmNum
            };
          });
          let arr15 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "欲流失会员数",
              value: v.yulsNum
            };
          });
          let arr16 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "已流失会员数",
              value: v.ylsNum
            };
          });
          let arr17 = res.data.map(v => {
            return {
              date: new Date(v.reportDate).Format("MM-DD"),
              type: "无消费会员数",
              value: v.wxfNum
            };
          });
          this.data4 = arr11.concat(arr12, arr13, arr14, arr15, arr16, arr17);
          console.log(this.data1, this.data2);
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>

.statis-index {
  padding-bottom: 10vh;
  /deep/.vux-button-group {
    flex: 0 0 35%;
  }
  /deep/ .vux-selector.weui-cell_select {
    flex: 0 0 40%;
  }
  .top {
    background: rgba(0,202,175,1);
    .header {
      position: relative;
      padding: 0.08rem 0;
      box-sizing: border-box;
      color: #fff;
      /*border-bottom:1px solid #0C5EE6;*/
      .header-title {
        margin: 0 2.34667rem;
        height: 1.06667rem;
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.06667rem;
        text-align: center;
        font-size: 0.48rem;
        font-weight: 400;
      }
    }
    .menus {
      display: flex;
      color: #fff;
      flex-wrap: wrap;
      padding: 10px;
      font-size: 12px;
      .menu-item {
        width: 25%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
        > img {
          // width: 35px;
          height: 35px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .top-fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
  }
  .view-title {
    padding: 0 20px;
    display: flex;
  }
  .select {
    margin-left: 20px;
    height: 0.75rem;
    line-height: 0.75rem;
    border: 1px solid;
    padding: 0 8px;
    color: #19a3fa;
    display: flex;
    flex: 0 0 40%;
    justify-content: space-between;
    overflow: hidden;
    border-radius: 4px;
  }
  .container {
  }
}
.noNumber{
  width:100%;
  margin-top:20%;
	.image{
    width:30%;
    height:90px;
    margin:0 auto;
    img{
      width:100%;
      height:100%;
    }
	}
}
</style>