<template>
  <div class="container">
    <x-header :left-options="{showBack: true,backText: ''}" class="header">详细内容</x-header>
    <div class="content">
      <div class="tags">
        <span class="tag-item" v-if="baseInfo.type">{{baseInfo.type}}</span>
        <span class="tag-item" v-if="baseInfo.subType">{{baseInfo.subType}}</span>
      </div>
      <h3 class="title">
        {{baseInfo.titleName}}
        <span class="status" v-if="baseInfo.status">{{baseInfo.status}}</span>
      </h3>
      <div class="info">{{baseInfo.describe}}</div>
      <div class="date">{{baseInfo.startTime | dateFormat('YYYY-MM-DD HH:mm')}}</div>
      <div class="info-footer" v-if="baseInfo.status== '已反馈'">
        <div>{{baseInfo.respDescribe}}</div>
        <div style="font-weight:400;font-size:12px;">{{baseInfo.responseTime | dateFormat('YYYY-MM-DD HH:mm')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { XHeader } from "vux";
import { getSubmitOptionDetail } from "@/api/shopper";
Vue.use(XHeader);
export default {
  components: {
    XHeader
  },
  data() {
    return {
      baseInfo: {}
    };
  },
  methods: {
    getData(opinionId, guideId) {
      getSubmitOptionDetail({
        opinionId,
        guideId
      }).then(res => {
        if (res.code === 200) {
          this.baseInfo = res.data;
        }
      });
    }
  },
  created() {
    console.log(this.$route.query);
    let { opinionId, guideId } = this.$route.query;
    this.getData(opinionId, guideId);
  }
};
</script>

<style lang="less" scoped>
.tags {
  padding: 15px;
  .tag-item {
    padding: 4px 10px;
    border-radius: 8px;
    background: #d7d7d7;
    margin-right: 5px;
  }
}
.container {
  min-height: 100%;
  background-color: #fff;
}
.title {
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #dfdfdf;
  padding: 5px 15px;
}
.status {
  margin-left: 10px;
  padding: 2px 10px;
  border-radius: 20px;
  background: #f59a13;
  font-size: 13px;
  color: #fff;
}
.info {
  padding: 15px;
  font-size: 14px;
  color: #333;
  word-break: break-all;
}
.info-footer {
  margin-top: 50px;
  padding: 15px;
  font-size: 14px;
  color: #333;
  font-weight: 700;
    text-align: right;
}
.date {
  text-align: right;
  padding: 15px;
  font-size: 13px;
  color: #666;
}
</style>
