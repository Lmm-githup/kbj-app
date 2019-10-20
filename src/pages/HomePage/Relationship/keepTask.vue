<template>
 <div style="height:100%;">
    <view-box body-padding-top="40px"  class="keep-task-container">
    <!-- 导航栏 -->
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">维系任务</x-header>
    <!-- tab 栏 -->
    <tab custom-bar-width="75px">
      <tab-item selected @on-item-click="toggleTab">进行中</tab-item>
      <tab-item @on-item-click="toggleTab">已过期</tab-item>
      <tab-item @on-item-click="toggleTab">所有</tab-item>
    </tab>
    <!-- 列表 -->
    <div v-if="allData.length" class="relation-list">
      <div v-for="(item, index) in allData" :key="index">
        <FailureTaskItem v-if="item.status == 1" :showLogo="true">
          <span slot="name">{{item.typeName}}</span>
          <span style="color: #999;" slot="status">{{item.status == 1 ? '已过期' : '正常'}}</span>
          <template slot="content">
            <div>活动时间: {{item.startDate | dateFormat('YYYY-MM-DD')}} ~ {{item.endDate | dateFormat('YYYY-MM-DD')}}</div>
            <div>描述: {{item.scope}}</div>
            <div>更新时间: {{item.gmtModified}}</div>
          </template>
        </FailureTaskItem>
        <ActiveTaskItem v-else @click.native="goRoute({relaId: item.relaId})">
          <span slot="name">{{item.typeName}}</span>
          <span slot="status" style="color: #FF9933;">{{item.status == 1 ? '已过期' : '正常'}}</span>
          <template slot="content">
            <div>活动时间: {{item.startDate | dateFormat('YYYY-MM-DD')}} ~ {{item.endDate | dateFormat('YYYY-MM-DD')}}</div>
            <div>描述: {{item.scope}}</div>
            <div>更新时间: {{item.gmtModified}}</div>
          </template>
        </ActiveTaskItem>
      </div>
    </div>
    <!-- <no-data v-else></no-data> -->
    <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler">
      <no-data slot="no-results"></no-data>
      <load-more slot="no-more" :show-loading="false" tip="没有更多了"></load-more>
    </infinite-loading>
  </view-box>
 </div>
</template>

<script>
import { XHeader, Tab, TabItem, Sticky, LoadMore } from "vux";
import ActiveTaskItem from "@/components/Relation/ActiveTaskItem";
import FailureTaskItem from "@/components/Relation/FailureTaskItem";
import NoData from "@/components/common/NoData";
import InfiniteLoading from "vue-infinite-loading";

// api
import { postRelationshipList } from "@/api/relationship";
export default {
  components: {
    ActiveTaskItem,
    FailureTaskItem,
    XHeader,
    Tab,
    TabItem,
    NoData,
    Sticky,
    LoadMore,
    InfiniteLoading
  },
  data() {
    return {
      currentIndex: 0,
      allData: [],
      currentPage: 1,
      pageSize: 10,
      infiniteId: +new Date()
    };
  },
  methods: {
    infiniteHandler($state) {
      postRelationshipList({
        type: this.$route.query.type,
        status: this.currentIndex,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 200) {
          let { list, paginator } = res.data;
          this.allData = this.allData.concat(list || []);
          if (this.currentPage <= paginator.totalPages) {
            $state.loaded();
          } else {
            $state.complete();
          }
          this.currentPage++;
        }
      });
    },
    toggleTab(index) {
      this.currentIndex = index;
      this.currentPage = 1;
      this.infiniteId = +new Date();
      this.allData = [];
      // this.getData()
    },
    goRoute({ relaId }) {
      this.$router.push({ name: "keeplist", query: { relaId } });
    }
  },
  created() {
    // this.getData()
  }
};
</script>

<style lang="less" scoped>
.keep-task-container {
  height: 100%;
  overflow: auto;
  background-color: #fff;
  .relation-list {
    background-color: #f2f2f2;
  }
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-bar-inner{
  background:rgba(0,202,172,1)
}
</style>
