<template>
  <div>
    <div class="illness-box" v-for="(item, index) in List" :key="index">
      <div class="illness-box__head">
        <p class="title">{{item.type}}:</p>
      </div>
      <div class="illness-box__main">
        <div class="item" v-for="(citem, cindex) in item.subList" :key="cindex">
          <div class="title">{{citem.fileName}}:</div>
          <div class="content">
            <span class="name">{{citem.indexNum}}</span>
            <span class="unit">{{citem.fileUnit}}</span>
            <span class="time">{{citem.measTime | dateFormat}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Grid, GridItem, GroupTitle, XInput } from "vux";
import { getHealthLogDetail } from "@/api/mymember";
export default {
  name: "healthLogDetail",
  props: {
    memberNo: {
      type: String,
      required: true
    },
    mappingId: {
      type: String,
      required: true
    }
  },
  components: { Grid, GridItem, GroupTitle, XInput },
  data() {
    return {
      List: []
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getHealthLogDetail();
  },
  methods: {
    async getHealthLogDetail() {
      let { code, data } = await getHealthLogDetail({
        memberNo: this.memberNo,
        mappingId: this.mappingId
      });
      code === 200 ? this.listInit(data) : "";
    },
    listInit(data) {
      const keySort = ["BMI检测", "血糖检测", "血压检测"];
      const subKeySort = [
        "早餐前",
        "早餐后2小时",
        "午餐前",
        "午餐后2小时",
        "晚餐前",
        "晚餐后2小时",
        "睡前",
        "下半夜"
      ];
      const newList = [];
      let mask = false;
      data.sort((a, b) => {
        if (a.type == "血糖检测") {
          mask = true;
        }
        return keySort.indexOf(a.type) - keySort.indexOf(b.type);
      });
      if (mask) {
        data[1].subList.sort((a, b) => {
          return subKeySort.indexOf(a.fileName) - subKeySort.indexOf(b.fileName);
        })
      }
      this.List = data;
    }
  }
};
</script>
<style lang="less" scoped>
.log-title {
  font-size: 16px;
  font-weight: 600;
  color: #ff6600;
}
.grid-center {
  display: block;
  text-align: center;
  color: #666;
}
.illness-box {
  &__head {
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: #ff6600;
    }
  }
  &__main {
    padding: 10px 15px;
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    .item {
      color: #333;
      width: 100%;
      display: flex;
      align-items: center;
      .title {
        font-size: 16px;
        min-width: 6em;
        // text-align: right;
        color: #333;
      }
      .content {
        display: flex;
        align-items: center;
        .name {
          font-size: 14px;
          color: #333;
          margin-left: 12px;
          margin-right: 12px;
        }
        .unit {
          font-size: 14px;
          color: #666;
        }
        .time {
          margin-left: 12px;
          color: #666;
          font-size: 12px;
        }
      }
      /deep/ .weui-icon-success,
      /deep/ .weui-icon-circle,
      /deep/ .weui-icon-success-circle {
        font-size: 14px;
      }
      .input {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        font-size: 14px;
        outline: none;
        background-color: transparent;
      }
    }
  }
}
</style>