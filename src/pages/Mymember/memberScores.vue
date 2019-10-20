<template>
  <div>
    <div class="scores-head">
      <div class="scores-head__box">
        当前积分
        <span class="num">{{numerator}}</span>
      </div>
    </div>
    <!-- <div style="height:44px;">
      <sticky
        ref="sticky"
        scroll-box="vux_view_box_body"
        :offset="pdtNum"
        :check-sticky-support="false"
        :disabled="disabled"
    >-->
    <div>
      <tab v-model="type" prevent-default @on-before-index-change="switchTabItem">
        <tab-item>明细</tab-item>
        <tab-item>收入</tab-item>
        <tab-item>支出</tab-item>
      </tab>
    </div>
    <!-- </sticky>
    </div>-->
    <div class="scores-list">
      <div class="scores-item vux-1px-b" v-for="(item, index) in List" :key="index">
        <div class="scores-item__main">
          <p class="title">{{item.src}}</p>
          <p class="subtitle">{{item.tranDate | dateFormat('YYYY-MM-DD')}}</p>
        </div>
        <div class="scores-item__after">{{item.type === '1' ? '+' : '-'}}{{item.points}}</div>
      </div>
      <infinite-loading
        @infinite="infiniteHandler"
        spinner="circles"
        :identifier="infiniteId"
        ref="infiniteLoading"
      >
        <load-more slot="no-more" :show-loading="false" :tip="'没有更多了'"></load-more>
        <no-data slot="no-results"></no-data>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import { Sticky, Tab, TabItem, LoadMore } from "vux";
import { mapState } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import { getMemberScore } from "@/api/mymember";
import NoData from "@/components/common/NoData";
export default {
  name: "memberScores",
  props: {
    custNo: {
      type: String,
      required: true
    },
    numerator: {
      type: [String, Number],
      required: true
    }
  },
  components: { Sticky, Tab, TabItem, InfiniteLoading, LoadMore, NoData },
  data() {
    return {
      disabled:
        typeof navigator !== "undefined" &&
        /iphone/i.test(navigator.userAgent) &&
        /ucbrowser/i.test(navigator.userAgent),
      type: 0,
      pageSize: 10,
      currentPage: 1,
      List: [],
      hasMore: true,
      infiniteId: +new Date()
    };
  },
  computed: {
    ...mapState({
      pdtNum: state => state.mymember.pdtNum
    })
  },
  watch: {},
  created() {},
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.sticky.bindSticky();
    // });
  },
  methods: {
    infiniteHandler($state) {
      let params = {
        custNo: this.custNo,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      this.type > 0 ? (params.type = this.type) : "";
      getMemberScore(params).then(res => {
        let { list, paginator } = res.data;
        if (this.currentPage < paginator.totalPages) {
          this.hasMore = true;
          this.currentPage++;
          this.List.push(...list);
          $state.loaded();
        } else {
          this.hasMore = false;
          this.currentPage++;
          this.List.push(...list);
          if (
            paginator.totalCounts <= paginator.pageSize &&
            paginator.totalCounts > 0
          ) {
            $state.loaded();
          }
          $state.complete();
        }
      });
    },
    switchTabItem(e) {
      this.type = e;
      this.currentPage = 1;
      this.List = [];
      this.infiniteId += 1;
    }
  }
};
</script>
<style lang="less" scoped>
.scores-head {
  padding: 10px 15px 0 15px;
  &__box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #fff;
    min-height: 90px;
    border-radius: 8px 8px 0 0;
    //background: linear-gradient(#4595fa, #3c78f9);
    background:rgba(0,202,172,1);
    .num {
      font-size: 16px;
      font-weight: 700;
    }
  }
}
.scores-list {
  padding: 10px 15px;
  background-color: #fff;
  .scores-item {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    &__main {
      flex: 1;
      .title {
        font-size: 14px;
        color: #333;
        margin-bottom: 5px;
      }
      .subtitle {
        font-size: 12px;
        color: #5c5c5c;
      }
    }
    &__after {
      display: flex;
      align-items: center;
      font-size: 18px;
      color: #d72628;
    }
  }
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-ink-bar{
  background:rgba(0,202,172,1)
}
</style>