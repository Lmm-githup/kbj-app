<template>
  <div>
    <div v-if="type == 'activity'">
      <div class="article-head vux-1px-b">
        <div class="article-head__wrap">
          <p class="title">{{article.activityName}}</p>
          <div class="subtitle">
            <div class="cell" v-if="type !== 'activity'">已提交</div>
            <div
              class="cell"
              v-else
            >活动时间：{{article.startDate | dateFormat('YYYY-MM-DD')}} ~ {{article.endDate | dateFormat('YYYY-MM-DD')}}</div>
            <div class="cell" v-if="type === 'activity'">
              <p>活动范围：{{article.storeName ? article.storeName : '所有门店'}}</p>
              <span v-if="type == 'activity'">{{article.status}}</span>
              <span v-else>{{article.srStatus}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="article-main">
        {{article.description}}
        <p class="article-main__after">{{article.gmtCreate | dateFormat}}</p>
      </div>
    </div>
    <div v-else>
      <div class="article-head vux-1px-b">
        <div class="article-head__wrap">
          <p class="labels">
            <span class="badge">{{article.srSubType}}</span>
          </p>
          <p class="title feedback">
            <span>{{article.srType}}</span>
            <x-button
              mini
              plain
              class="custom-orange"
              v-if="article.srStatus == '待处理'"
            >{{article.srStatus}}</x-button>
            <x-button
              mini
              plain
              class="custom-blue"
              v-else-if="article.srStatus == '处理中'"
            >{{article.srStatus}}</x-button>
            <x-button
              mini
              plain
              class="custom-gray"
              v-else-if="article.srStatus == '已回复'"
            >{{article.srStatus}}</x-button>
            <x-button
              mini
              plain
              class="custom-green"
              v-else-if="article.srStatus == '已完成'"
            >{{article.srStatus}}</x-button>
          </p>
          <div class="subtitle feedback">
            <p>{{article.srQuestion}}</p>
            <span>{{article.gmtCreate | dateFormat}}</span>
          </div>
        </div>
      </div>
      <div class="article-main">
        {{article.srAnswer}}
        <p class="article-main__after">{{article.replyDate | dateFormat}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton } from "vux";
import { getFeedbackDetail, getInvitationDetail } from "@/api/mymember";
import { getSubmitOptionDetail } from "@/api/shopper";
export default {
  name: "Article",
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    type: {
      type: String,
      default: "complaint"
    },
    custNo: {
      type: String,
      required: false
    }
  },
  components: { XButton },
  data() {
    return {
      article: {}
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.type == "activity"
      ? this.getInvitationDetail()
      : this.getFeedbackDetail();
  },
  methods: {
    async getFeedbackDetail() {
      let { code, data } = await getFeedbackDetail({ srId: this.id });
      code === 200 ? (this.article = data) : "";
    },
    async getInvitationDetail() {
      let { code, data } = await getInvitationDetail({
        activityId: this.id,
        memId: this.custNo
      });
      code === 200 ? (this.article = data) : "";
    }
  }
};
</script>
<style lang="less" scoped>
.article-head {
  padding: 15px 10px;
  background-color: #fff;
  &__wrap {
    display: flex;
    flex-direction: column;
    .labels {
      display: flex;
      flex-wrap: wrap;
      .badge {
        margin-right: 5px;
        margin-bottom: 5px;
        padding: 3px 6px;
        font-size: 12px;
        color: #333;
        background-color: #ffe8e8;
        border-radius: 3px;
      }
    }
    .title {
      font-weight: 600;
      font-size: 14px;
      color: #333;
      word-break: break-all;
      margin-bottom: 5px;
      &.feedback {
        display: flex;
        justify-content: space-between;
        align-items: center;
        /deep/ .weui-btn {
          margin: 0;
        }
      }
    }
    .subtitle {
      display: flex;
      flex-direction: column;
      &.feedback {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .cell {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        line-height: 18px;
        color: #666;
        & > span {
          color: #5077aa;
        }
      }
    }
  }
}
.article-main {
  padding: 15px 10px;
  background-color: #fff;
  font-size: 14px;
  color: #555;
  &__after {
    margin-top: 20px;
    color: #333;
    font-size: 14px;
    text-align: right;
  }
}
.custom-orange {
  border-radius: 99px !important;
  border-color: #ff6600 !important;
  color: #ff6600 !important;
  &:active {
    border-color: rgba(255, 102, 0, 0.6) !important;
    color: rgba(255, 102, 0, 0.6) !important;
    background-color: transparent;
  }
}
.custom-blue {
  border-radius: 99px !important;
  border-color: #037de0 !important;
  color: #037de0 !important;
  &:active {
    border-color: rgba(3, 125, 224, 0.6) !important;
    color: rgba(3, 125, 224, 0.6) !important;
    background-color: transparent;
  }
}
.custom-gray {
  border-radius: 99px !important;
  border-color: #c6c6c6 !important;
  color: #c6c6c6 !important;
  &:active {
    border-color: rgba(198, 198, 198, 0.6) !important;
    color: rgba(198, 198, 198, 0.6) !important;
    background-color: transparent;
  }
}
.custom-green {
  border-radius: 99px !important;
  border-color: #1aad19 !important;
  color: #1aad19 !important;
  &:active {
    border-color: rgba(26, 173, 25, 0.6) !important;
    color: rgba(26, 173, 25, 0.6) !important;
    background-color: transparent;
  }
}
</style>