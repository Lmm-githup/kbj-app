<template>
  <div>
    <div class="search-bar">
      <div class="search-bar__wrapper">
        <a style="display:block" class="search-bar__filter" @click="showPopup = true">
          {{searchtype ? searchTypes[searchtype].name : '不限'}}
          <i
            class="fa fa-chevron-down"
            aria-hidden="true"
          ></i>
        </a>
        <div class="search-bar__main">
          <x-input v-model="keywords" placeholder="请输入关键词" :debounce="500"></x-input>
        </div>
        <div class="search-bar__after">
          <i class="fa fa-search" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="container">
      <mymember-item :list="List" :type="'search'"></mymember-item>
      <infinite-loading @infinite="infiniteHandler" spinner="circles" :identifier="infiniteId">
        <load-more slot="no-more" :show-loading="false" :tip="'没有更多了'"></load-more>
        <no-data slot="no-results"></no-data>
      </infinite-loading>
    </div>
    <!-- <div class="historysearch" v-else>
      <div class="historysearch-title">
        <div class="txt">最近访问记录</div>
        <div class="after" @click="showConfirm = true" v-if="historysearch.length > 0">
          <i class="fa fa-trash-o" aria-hidden="true"></i>
        </div>
      </div>
      <div class="historysearch-list" v-if="historysearch.length > 0">
        <div
          class="historysearch-item vux-1px-b"
          @click="keywords = item"
          v-for="(item, index) in historysearch"
          :key="index"
        >{{item}}</div>
      </div>
      <div class="historysearch-none" v-else>暂无访问记录</div>
    </div>-->

    <!-- <div v-transfer-dom>
      <confirm
        v-model="showConfirm"
        :close-on-confirm="false"
        title="操作提示"
        @on-confirm="clearConfirm"
      >
        <p style="text-align:center;font-size:14px;">确认清除全部历史记录?</p>
      </confirm>
    </div>-->
    <div v-transfer-dom>
      <popup v-model="showPopup">
        <div class="search-types">
          <div class="title">搜索条件</div>
          <checker
            v-model="searchtype"
            radio-required
            default-item-class="search-type-item"
            selected-item-class="search-type-selected"
          >
            <checker-item
              :value="index"
              @on-item-click="showPopup = false"
              v-for="(item, index) in searchTypes"
              :key="index"
            >{{ item.name }}</checker-item>
          </checker>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import {
  XInput,
  Confirm,
  Checker,
  CheckerItem,
  Popup,
  TransferDomDirective as TransferDom,
  LoadMore
} from "vux";
import MymemberItem from "@/components/Mymember/MymemberItem";
import InfiniteLoading from "vue-infinite-loading";
import { getList } from "@/api/mymember";

import { mapState, mapActions } from "vuex";

import NoData from "@/components/common/NoData";

export default {
  name: "searchMember",
  directives: {
    TransferDom
  },
  components: {
    XInput,
    Confirm,
    MymemberItem,
    Checker,
    CheckerItem,
    Popup,
    InfiniteLoading,
    LoadMore,
    NoData
  },
  data() {
    return {
      showPopup: false,
      showConfirm: false,
      searchTypes: [
        { name: "不限", key: "" },
        { name: "客户姓名", key: "realname" },
        { name: "手机号", key: "mobile" },
        { name: "标签", key: "tag" },
        { name: "等级", key: "level" }
      ],
      searchtype: 0,
      keywords: "",
      pageSize: 10,
      currentPage: 1,
      List: [],
      hasMore: true,
      infiniteId: +new Date()
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    infiniteHandler($state) {
      getList({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
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
.search-bar {
  padding: 10px;
  &__wrapper {
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
  }
  &__filter {
    position: relative;
    font-size: 14px;
    color: #333;
    padding: 0 10px;
    text-align: center;
    &::after {
      position: absolute;
      content: " ";
      width: 1px;
      height: 100%;
      right: 0;
      top: 0;
      background-color: #ccc;
      z-index: 1;
    }
    & > .fa {
      color: #999;
      -webkit-text-stroke: 1px #fff;
    }
  }
  &__main {
    flex: 1;
    .vux-x-input {
      padding: 0 10px;
      font-size: 16px;
    }
  }
  &__after {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > .fa {
      font-size: 16px;
      color: #999;
      -webkit-text-stroke: 1px #fff;
    }
  }
}

.historysearch {
  padding: 10px;
  &-title {
    padding-left: 10px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .txt {
      flex: 1;
      font-size: 14px;
      color: #727272;
    }
    .after {
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 10px;
      padding-left: 10px;
      .fa {
        font-size: 14px;
        color: #333;
      }
    }
  }
  &-list {
    background-color: #fff;
  }
  &-item {
    font-size: 14px;
    color: #333;
    padding: 10px;
  }
  &-none {
    font-size: 14px;
    color: #727272;
    padding: 10px;
    background-color: #fff;
  }
}

.search-types {
  padding: 15px;
  .title {
    font-size: 14px;
    color: #333;
    font-weight: 600;
  }
  .search-type-item {
    background-color: #ddd;
    color: #222;
    font-size: 14px;
    padding: 5px 10px;
    margin-right: 10px;
    line-height: 18px;
    border-radius: 15px;
  }
  .search-type-selected {
    background-color: #ff3b3b;
    color: #fff;
  }
}
</style>