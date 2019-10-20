<template>
  <div class="ticket-container">
    <div class="top">
      <div class="ticket-header">
      <x-header :left-options="{showBack: true,backText: ''}">优惠券明细</x-header>
      <div class="ticket-info">
        <div class="ticket-info-item">
          <div>发放张数</div>
          <div class="ticket-number">{{ticketInfo.grantNum}}</div>
        </div>
        <div class="ticket-info-item">
          <div>使用张数</div>
          <div class="ticket-number">{{ticketInfo.quantity}}</div>
        </div>
        <div class="ticket-info-item">
          <div>未使用张数</div>
          <div class="ticket-number">{{ticketInfo.minimumAmount}}</div>
        </div>
        <div class="ticket-info-item">
          <div>关联销售额</div>
          <div class="ticket-number">{{ticketInfo.orderSales}}</div>
        </div>
      </div>
    </div>
    <!-- tab 栏 -->
    <tab custom-bar-width="75px">
      <tab-item selected @on-item-click="toggleTab">未使用</tab-item>
      <tab-item @on-item-click="toggleTab">已使用</tab-item>
    </tab>
    </div>

    <div>
      <ticket-item :list="list" v-if="list.length > 0"></ticket-item>

      <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler">
        <!-- <span slot="no-results" class="null-data">没有结果o(╥﹏╥)o</span> -->
        <span slot="no-results" class="null-data">
          <no-data></no-data>
        </span>
        <load-more slot="no-more" :show-loading="false" tip="没有更多了" background-color="#fbf9fe"></load-more>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import { XHeader, Tab, TabItem, LoadMore } from "vux";
import { getTicketTotal, getTicketMemberList } from "@/api/ticket";
import { datefmt } from "@/utils/common";
import ticketItem from "@/components/Mymember/TicketItem.vue";
import NoData from "@/components/common/NoData";
import InfiniteLoading from "vue-infinite-loading";
export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    ticketItem,
    LoadMore,
    NoData,
    InfiniteLoading
  },
  data() {
    return {
      ruleId: "",
      ticketInfo: {
        minimumAmount: 0, // 未使用张数
        quantity: 0, // 使用张数
        orderSales: 0, // 关联的订单金额
        grantNum: 0 // 发放张数
      },
      currentIndex: 0,
      list: [],
      currentPage: 1,
      pageSize: 10,
      infiniteId: +new Date()
    };
  },
  methods: {
    toggleTab(index) {
      this.currentIndex = index;
      this.currentPage = 1;
      this.infiniteId = +new Date();
      this.list = [];
      // this.getListData()
    },
    // 获取所有规则的统计信息
    getDetailData() {
      // 2019-01-01
      let endTime = datefmt(new Date(), "YYYY-MM-DD");
      let beginTime = endTime.split("-");
      beginTime[2] = "01";
      beginTime = beginTime.join("-");
      getTicketTotal({
        ruleId: this.ruleId
        // beginTime,
        // endTime
      }).then(res => {
        if (res.code === 200) {
          if (res.data) {
            Object.assign(this.ticketInfo, res.data);
          }
        }
      });
    },
    infiniteHandler($state) {
      let type = ["未使用", "已使用"];
      getTicketMemberList({
        ruleId: this.ruleId,
        voucherStatus: type[this.currentIndex],
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
        if (res.code === 200) {
          let { list, paginator } = res.data;
          this.list = this.list.concat(list || []);
          if (this.currentPage <= paginator.totalPages) {
            $state.loaded();
            if (paginator.totalCounts <= 10) {
              $state.complete()
            }
          } else {
            $state.complete();
          }
          this.currentPage++;
        }
      });
    }
  },
  created() {
    this.ruleId = this.$route.query.ruleId;
    this.getDetailData();
    // this.getListData()
  }
};
</script>

<style lang="less" scoped>
.ticket-container {
  height: 100%;
  overflow: auto;
  background-color: #f2f2f2;
  .top{
    position:sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
  .ticket-header {
    color: #fff;
    background:rgba(0,202,172,1)
  }
  /deep/ .vux-header {
    background-color: transparent !important;
    .vux-header-title {
      color: #fff !important;
    }
    .left-arrow {
      &::before {
        border-color: #fff;
      }
    }
  }
  .ticket-info {
    display: flex;
    align-items: center;
    padding: 10px 0;
    .ticket-info-item {
      flex: 1;
      text-align: center;
      .ticket-number {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
.text-normal {
  font-size: 14px;
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-bar-inner{
  background:rgba(143, 148, 154, 1)
}
</style>
