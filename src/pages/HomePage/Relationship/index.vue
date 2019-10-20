<template>
  <div class="relationship-container">
    <x-header :left-options="{showBack: true,backText: ''}">
      关系维系
    </x-header>
    <!-- 关系维系列表 -->
    <group v-if="list.length" class="relationship-list">
      <cell 
        v-for="(item, index) in list" 
        @click.native="goRoute(item)"
        :key="index">
        <div slot="title">
          <div class="title">
            {{item.typeName}} <span class="circle" v-if="item.num && item.num !== 0">{{item.num}}</span>
          </div>
        </div>
        <div slot="inline-desc" style="margin-top:10px;">
          更新时间: {{item.gmtModified | dateFormat}}
        </div>
      </cell>
    </group>
    <no-data v-else></no-data>
  </div>
</template>

<script>
import { XHeader, Group, Cell } from "vux";
// api
import { postRelationshipStatistic } from '@/api/relationship';

import NoData from '@/components/common/NoData'

export default {
  components: {
    XHeader,
    Group,
    Cell,
    NoData
  },
  data() {
    return {
      list: [
      ]
    }
  },
  methods: {
    // 获取数据
    getRelationshipData() {
      postRelationshipStatistic().then(res => {
        this.list = res.data
      })
    },
    goRoute(item) {
      console.log(item)
      let { type } = item,
        routerName = ''
      if (type === 0) routerName = '/keepTask'
      if (type === 1) routerName = '/inviteTask'
      if (type === 2) routerName = '/customTask'
      if (!routerName) return
      this.$router.push({ 
          path: routerName,
          query: {
            type: type
          }
       })
    }
  },
  created() {
    this.getRelationshipData()
  }
};
</script>

<style lang="less" scoped>
.relationship-container {
  /deep/ .vux-header {
    .vux-header-title {
      color: #333 !important;
    }
    .left-arrow {
      &::before {
        border-color: #333;
      }
    }
  }
  .relationship-list {
    /deep/ .weui-cells {
      background-color: transparent !important;
      .weui-cell {
        background-color: #fff;
        &:not(:first-child) {
          margin-top: 10px;
        }
      }
    }
    /deep/ .vux-label-desc {
      color: #333 !important;
    }
    .title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 700;
      .circle {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #0968ed;
        border-radius: 15px;
        padding: 0 5px;
        // width: 20px;
        // height: 20px;
        // background: url('../../../assets/images/relationship/u2770.png') no-repeat;
        // background-size: 20px 20px;
        color: #fff;
        font-size: 13px;
        margin-left: 10px;
      }
    }
  }
}
</style>
