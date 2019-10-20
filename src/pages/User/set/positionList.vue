<template>
 <div style="height:100%">
    <view-box  body-padding-top="40px" class="position-index">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">选择方式</x-header>
    <group v-for="(item, index) in positionList" :key="index">
      <cell border-intent inline-desc is-link @click.native="selectOrg(item)">
        <span slot="title" class="title-solt">
          <img src="/src/assets/images/my-icon.png" alt>
          {{item.positionName}}
        </span>
      </cell>
      <cell>
        <span slot="title" class="decs-solt">
          {{item.userName ? item.userName: '尚未关联人员'}}
        </span>
      </cell>
    </group>
    <infinite-loading @infinite="infiniteHandler" spinner="circles" :identifier="infiniteId">
      <no-data v-if="!positionList.length" slot="no-results"></no-data>
      <load-more v-else slot="no-results" :show-loading="false" tip="没有更多了"></load-more>
    </infinite-loading>
  </view-box>
 </div>
</template>

<script>
import { XHeader, Cell, Group,LoadMore, ViewBox  } from "vux";
import { getPositionList } from "@/api/user";
import InfiniteLoading from "vue-infinite-loading";
import NoData from "@/components/common/NoData";
export default {
  name: "orgList",
  components: {
    XHeader,
    Cell,
    Group,
    LoadMore,
    InfiniteLoading,
    NoData,
    ViewBox
  },
  data() {
    return {
      positionList: [],
      currentPage: 1,
      infiniteId: +new Date()
    };
  },
  methods: {
    selectOrg(val) {
      this.$store.commit("ADD_POSITION", {
        positionName: val.positionName,
        rowNo: val.rowNo
      });
      this.$router.go(-1);
    },
    infiniteHandler($state) {
      getPositionList({currentPage:this.currentPage}).then(res => {
        if (+res.code === 200) {
          let { list, paginator } = res.data;
          if (this.currentPage < paginator.totalPages) {
            this.currentPage++;
            this.positionList.push(...list);
            $state.loaded();
          } else {
            this.currentPage++;
            this.positionList.push(...list);
            $state.complete();
          }
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    }
  },
  mounted() {
  }
};
</script>

<style scoped lang="less">
.position-index {
  .title-solt {
    color: rgb(29, 69, 155);
    display: flex;
    align-items: center;
    color: #1d459b;
    font-size: 14px;
    > img {
      margin-right: 20px;
      width: 30px;
      height: 30px;
    }
  }
  .decs-solt{
    font-size: 12px;
    color: #5c5c5c;
  }
}
</style>
