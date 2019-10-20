<template>
  <div class="buy-list">
    <div class="buy-item" v-for="(item, index) in List" :key="index">
      <div class="buy-item__head">
        <div class="title">
          {{item.storeName}}
          <p class="after">{{item.orderTime | dateFormat}}</p>
        </div>
        <p class="after">小票号: {{item.orderNo}}</p>
      </div>
      <div class="buy-item__main">
        <div class="goods-item" v-for="(citem, cindex) in item.orderDetailViewList" :key="cindex">
          {{citem.productName + citem.productSpec + citem.productUnit}}
          <span
            class="sign"
          >&#215; {{citem.productNum}}</span>
        </div>
      </div>
    </div>
    <infinite-loading @infinite="infiniteHandler" spinner="circles" ref="infiniteLoading">
      <load-more slot="no-more" :show-loading="false" :tip="'没有更多了'"></load-more>
      <no-data slot="no-results"></no-data>
    </infinite-loading>
  </div>
</template>

<script>
import { Cell, Group, LoadMore } from "vux";
import InfiniteLoading from "vue-infinite-loading";
import { getMemberOrder } from "@/api/mymember";
import NoData from "@/components/common/NoData";
export default {
  name: "buyList",
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: { Cell, Group, LoadMore, InfiniteLoading, NoData },
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      List: [],
      hasMore: true
    };
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    infiniteHandler($state) {
      let params = {
        custNo: this.custNo,
        // custNo: "1-5GWW1",
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      getMemberOrder(params).then(res => {
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
    }
  }
};
</script>
<style lang="less" scoped>
.buy-item {
  padding: 10px;
  background-color: #fff;
  margin-top: 5px;
  &__head {
    position: relative;
    padding: 5px 0;
    &::after {
      position: absolute;
      content: " ";
      left: 0;
      bottom: 0;
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
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 700;
      color: #333;
      margin-bottom: 10px;
    }
    .after {
      font-size: 14px;
      color: #5c5c5c;
      font-weight: normal;
    }
  }
  &__main {
    padding: 5px 0;
    .goods-item {
      font-size: 14px;
      margin-bottom: 12px;
      .sign {
        margin-left: 10px;
        font-size: 18px;
        color: #ff9933;
      }
    }
  }
}
</style>