<template>
  <div>
    <div style="height:50px;margin-bottom:10px;">
      <div class="member-button-tab">
        <button-tab v-model="pharmacyType">
          <button-tab-item @on-item-click="switchTabItem" class="buttonLeft">用药提醒</button-tab-item>
          <!-- <button-tab-item @on-item-click="switchTabItem">用药关怀</button-tab-item> -->
          <button-tab-item @on-item-click="switchTabItem" class="buttonRight">关联用药</button-tab-item>
        </button-tab>
      </div>
    </div>
    <div
      class="pharmacy-item vux-1px-b"
      v-show="pharmacyType == 0"
      v-for="(item,index) in pharmacyAlerts"
      :key="index"
    >
      <div class="pharmacy-item__info">
        <div class="main">
          <span class="title">{{item.productName}}</span>
          <span class="sign">{{item.productSpec}}</span>
          <!--1盒-->
        </div>
        <div class="after">{{item.describe}}</div>
      </div>
      <div class="pharmacy-item__info">
        <div class="main">
          <span class="sign">{{item.productUsage}}</span>
          {{item.handleDate}}
        </div>
        <!--<div class="after">
          <x-button mini :gradients="['#f69f11', '#febc03']">提醒</x-button>
        </div>-->
      </div>
    </div>
    <no-data v-show="pharmacyType == 0 && pharmacyAlerts.length == 0"></no-data>
    <div
      class="pharmacy-item vux-1px-b"
      v-show="pharmacyType == 1"
      v-for="(item,xindex) in pharmacyCares"
      :key="'X'+xindex"
    >
      <div class="pharmacy-item__info">
        <div class="main">
          <span class="title">{{item.productName}}</span>
          <span class="sign">{{item.productSpec}}</span>
          <!--1盒-->
        </div>
        <div class="after">{{item.describe}}</div>
      </div>
      <div class="pharmacy-item__info">
        <div class="main">
          <span class="sign">{{item.productUsage}}</span>
          {{item.handleDate}}
        </div>
      </div>
    </div>
    <no-data v-show="pharmacyType == 1 && pharmacyCares.length == 0"></no-data>
    <div class="" v-show="pharmacyType == 2 && relationPharmacies">
      <li class="item-title">最近一次购药信息</li>
      <div
        class="pharmacy-item vux-1px-b"
        v-for="(item,yindex) in relationPharmacies.orderLast"
        :key="'Y' + yindex"
      >
        <div class="pharmacy-item__info">
          <div class="main">
            <span class="title">{{item.productName}}</span>
            <span class="sign">{{item.productSpec}}</span>
            <!--1盒-->
          </div>
          <div class="after">{{item.describe}}</div>
        </div>
        <div class="pharmacy-item__info">
          <div class="main">
            <span class="sign">{{item.productUsage}}</span>
            {{item.orderTime | dateFormat}}
          </div>
        </div>
      </div>
      <li class="item-title">联合用药推荐</li>
      <div
        class="pharmacy-item vux-1px-b"
        v-for="(item,zindex) in relationPharmacies.uinonDrug"
        :key="'Z' + zindex"
      >
        <div class="pharmacy-item__info">
          <div class="main">
            <span class="title">{{item.productName}}</span>
            <span class="sign">{{item.relationProName}}</span>
            <!--1盒-->
          </div>
          <div class="after">{{item.relationTalking}}</div>
        </div>
        <div class="pharmacy-item__info">
          <div class="main">
            <span class="sign">{{item.relationProUsage}}</span>
            {{item.purchaseTime | dateFormat}}
          </div>
        </div>
        <div class="pharmacy-item__info">
          <div class="main">关联： {{item.relationProName}}</div>
        </div>
      </div>
      <li class="item-title">三个月内购药信息</li>
      <div
        class="pharmacy-item vux-1px-b"
        v-for="(item,pindex) in relationPharmacies.uinonDrug"
        :key="'P' + pindex"
      >
        <div class="pharmacy-item__info">
          <div class="main">
            <span class="title">{{item.productName}}</span>
            <span class="sign">{{item.productSpec}}</span>
            <!--1盒-->
          </div>
          <div class="after">{{item.describe}}</div>
        </div>
        <div class="pharmacy-item__info">
          <div class="main">
            <span class="sign">{{item.productUsage}}</span>
            {{item.handleDate}}
          </div>
        </div>
      </div>
    </div>
    <no-data v-show="pharmacyType == 2 && !relationPharmacies"></no-data>
  </div>
</template>

<script>
import { ButtonTab, ButtonTabItem, XButton } from "vux";
import { getMemberRelationPharmacy, getMemberPharmacy } from "@/api/mymember";
import NoData from "@/components/common/NoData";
export default {
  name: "pharmacyService",
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: { ButtonTab, ButtonTabItem, XButton, NoData },
  data() {
    return {
      pharmacyType: 0,
      pharmacyAlerts: [],
      pharmacyCares: [],
      relationPharmacies: {
        orderLast: [],
        uinonDrug: [],
        order3Month: []
      },
      disabled:
        typeof navigator !== "undefined" &&
        /iphone/i.test(navigator.userAgent) &&
        /ucbrowser/i.test(navigator.userAgent)
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.switchTabItem(0);
  },
  methods: {
    async getMemberPharmacy(remindTypeCode) {
      let { code, data } = await getMemberPharmacy({
        custNo: this.custNo,
        remindTypeCode: remindTypeCode
      });
      if (code === 200) {
        this.pharmacyType === 0
          ? (this.pharmacyAlerts = data.list)
          : (this.pharmacyCares = data.list);
      }
    },
    async getMemberRelationPharmacy() {
      let { code, data } = await getMemberRelationPharmacy({
        memberId: this.custNo
      });
      code === 200 ? (this.relationPharmacies = data || {}) : "";
    },
    switchTabItem(e) {
      this.pharmacyType = e;
      // edit 20190611
      if (e === 0) {
        this.getMemberPharmacy(6);
      } else if (e === 1) {
        this.getMemberRelationPharmacy();
      }
      // if (e === 0) {
      //   this.getMemberPharmacy(6);
      // } else if (e === 1) {
      //   this.getMemberPharmacy(6);
      // } else if (e === 2) {
      //   this.getMemberRelationPharmacy();
      // }
    }
  }
};
</script>
<style lang="less" scoped>
.member-button-tab {
  padding: 10px 30px;
  background-color: #fff;
  box-sizing: border-box;
}
.item-title {
  color: #ff9933;
  font-weight: bold;
  padding: 5px 15px;
}
.pharmacy-item {
  padding: 10px 15px;
  background-color: #fff;
  &__info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 9px;
    .main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      word-break: break-all;
      font-size: 14px;
      color: #333;
      font-weight: 600;
      .title {
        margin-right: 9px;
      }
      .sign {
        font-size: 12px;
        font-weight: normal;
        margin-right: 30px;
      }
    }
    .after {
      font-size: 14px;
      color: #333;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
  }
}
.vux-button-group > a{
    color: rgba(0,202,172,1);
    -webkit-tap-highlight-color: rgba(0,202,172,1);
}
.vux-button-group > a.vux-button-group-current {
    background: rgba(0,202,172,1);
}
.vux-button-group > a.vux-button-tab-item-first:after{
    border: 0.02667rem solid rgba(0,202,172,1)
}
.vux-button-group > a.vux-button-tab-item-last:after{
  border: 0.02667rem solid rgba(0,202,172,1)
}

</style>