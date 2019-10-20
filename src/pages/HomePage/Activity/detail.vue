<template>
<div style="height:100%;">
  	<view-box body-padding-top="42px" class="container">
		<!-- 导航栏 -->
		<x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">
      {{name}}
    </x-header>
		<!-- tab 栏 -->
		<tab custom-bar-width="75px">
      <tab-item selected @on-item-click="toggleTab">进行中</tab-item>
      <tab-item @on-item-click="toggleTab">已过期</tab-item>
      <tab-item @on-item-click="toggleTab">所有</tab-item>
    </tab>
		<!-- 列表 -->
		<div class="list">
      <div v-show="currentIndex === 0" v-for="(item, index) in list" :key="'active' + index">
        <ActiveTaskItem>
          <span slot="name">{{item.activityName}}</span>
          <span slot="status" style="color: #FF9933;">进行中</span>
          <template slot="content">
            <div class="label">活动类型: {{item.activityTypeName}}</div>
            <div class="label">活动时间: {{item.startDate}} ~ {{item.endDate}}</div>
            <div class="label">活动范围: {{item.scopeType == 'all' ? '全部门店' : item.storeNames}}</div>
            <div class="label">活动描述: {{item.activityDesc || '无'}}</div>
            <!--<img :src="ImgQRcode" class="qr-code" alt="">-->
          </template>
        </ActiveTaskItem>
      </div>
      <div v-show="currentIndex === 1" v-for="(item, index) in list" :key="'fail' + index">
        <FailureTaskItem>
          <span slot="name">{{item.activityName}}</span>
          <span style="color: #999;" slot="status">已过期</span>
          <template slot="content">
            <div>活动类型: {{item.activityTypeName}}</div>
            <div>活动时间: {{item.startDate}} ~ {{item.endDate}}</div>
            <div>活动范围: {{item.storeNames}}</div>
            <div class="item">活动描述: {{item.activityDesc || '无'}}</div>
            <!--<img :src="ImgQRcode" class="qr-code" alt="">-->
          </template>
        </FailureTaskItem>
      </div>
      <div v-show="currentIndex === 2" v-for="(item, index) in list" :key="'all' + index">
        <ActiveTaskItem v-if="item.activityStatus == 1">
          <span slot="name">{{item.activityName}}</span>
          <span slot="status" style="color: #FF9933;">进行中</span>
          <template slot="content">
            <div>活动类型: {{item.activityTypeName}}</div>
            <div>活动时间: {{item.startDate}} ~ {{item.endDate}}</div>
            <div>活动范围: {{item.storeNames}}</div>
            <div class="item">活动描述: {{item.activityDesc || '无'}}</div>
            <!--<img :src="ImgQRcode" class="qr-code" alt="">-->
          </template>
        </ActiveTaskItem>
        <FailureTaskItem v-else>
          <span slot="name">{{item.activityName}}</span>
          <span v-if="item.activityStatus == 2"  style="color: #999;" slot="status">未开始</span>
          <span v-else  style="color: #999;" slot="status">已过期</span>
          <template slot="content">
            <div>活动类型: {{item.activityTypeName}}</div>
            <div>活动时间: {{item.startDate}} ~ {{item.endDate}}</div>
            <div>活动范围: {{item.storeNames}}</div>
            <div class="item">活动描述: {{item.activityDesc || '无'}}</div>
            <!--<img :src="ImgQRcode" class="qr-code" alt="">-->
          </template>
        </FailureTaskItem>
      </div>
      <no-data v-if="!list.length" ></no-data>
		</div>
	</view-box>
</div>
</template>

<script>
import { XHeader, Tab, TabItem } from "vux";
// 进行中
import ActiveTaskItem from '@/components/Relation/ActiveTaskItem';
// 已失效
import FailureTaskItem from '@/components/Relation/FailureTaskItem';
import ImgQRcode from '@/assets/images/console/u1932.png';
import { activityList } from '@/api/home';
import NoData from '@/components/common/NoData'
export default {
	components: {
		ActiveTaskItem,
		FailureTaskItem,
    XHeader,
    Tab,
    TabItem,
    NoData
  },
	data() {
		return {
      ImgQRcode,
      currentIndex: 0,
      list: [],
      paginator: {},
      type: '',
      name: '活动'
		}
  },
  mounted() {
    this.type = this.$route.query.type;
    this.name = this.$route.query.name;
    this.getList();
  },
	methods: {
		toggleTab(index) {
      this.currentIndex = index
      this.getList()
    },
    async getList() {
      let { data } = await activityList({'activityType': this.type,'activityStatus': this.currentIndex == 0 ? 1 : (this.currentIndex == 1 ? 2: null)});
      this.list = data.list || [];
      this.paginator = data.paginator || {}
    }
	},
	created() {
		
	}
}
</script>

<style lang="less" scoped>
.container {
	min-height: 100%;
	background-color: #f2f2f2;
}
.list {
  .qr-code {
    width: 44px;
    height: 45px;
    margin-top: 10px;
  }
  .label {
    word-break: break-all;
  }
}
 .item{
   word-break:break-all;
 }
 .vux-tab .vux-tab-item.vux-tab-selected{
  color:rgba(0,202,172,1);
}
//这个是切换条的颜色
/deep/.vux-tab-bar-inner{
  background:rgba(0,202,172,1)
}
</style>
