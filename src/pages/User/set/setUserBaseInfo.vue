<template>
 <div style="height:100%;">
    <view-box body-padding-top="40px">
    <!-- 顶部 -->
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">
      人员设置({{paginator.totalCounts}})
      <router-link :to="{ name: 'addStaff' }" slot="right">
        <span class="fa fa-plus-circle add-icon"></span>
      </router-link>
    </x-header>
    <!-- 选择状态 -->
    <group class="filter-box">
      <!-- 状态 -->
      <popup-radio :options="normalStatus.options" v-model="normalStatus.value">
        <template slot-scope="props" slot="each-item">
          <p>{{ props.label }}</p>
        </template>
      </popup-radio>
      <!-- 部门 -->
      <!-- <popup-radio :options="department.options" v-model="department.value">
        <template slot-scope="props" slot="each-item">
          <div class="baseinfo-filter-item" :style="`padding-left: ${props.key.split('==')[1] * 15}px`">
          <div
            class="baseinfo-filter-item"
            :style="`padding-left: ${department.options[props.index].level * 15}px`"
          >
            <div class="logo-box">
              <img :src="defaultImg" alt class="logo">
            </div>
            {{ props.label }}
          </div>
        </template>
      </popup-radio>-->
      <!-- 职位 -->
      <popup-radio :options="position.options" v-model="position.value">
        <template slot-scope="props" slot="each-item">
          <div class="baseinfo-filter-item">
            <img :src="myIcon" alt>
            {{ props.label }}
          </div>
        </template>
      </popup-radio>
      <popup-radio :options="order.options" v-model="order.value">
        <template slot="popup-header">
          <group title="排序方式">
            <!-- <radio :options="orderTitle" :value="searchParams.orderByType"></radio> -->
            <radio :options="orderTitle" v-model="searchParams.orderByType"></radio>
          </group>
        </template>
        <template slot-scope="props" slot="each-item">
          <div class="order-filter-item">
            <div>{{props.label}}</div>
          </div>
        </template>
      </popup-radio>
    </group>
    <group class="filter-box second-row" :gutter="0" v-if="isOpen == 1">
      <!-- 大区 -->
      <popup-radio :options="region.options" v-model="region.value">
        <template slot-scope="props" slot="each-item">
          <p>{{ props.label }}</p>
        </template>
      </popup-radio>
      <!-- 片区 -->
      <popup-radio :options="area.options" v-model="area.value" @on-show="areaShow">
        <template slot-scope="props" slot="each-item">
          <p>{{ props.label }}</p>
        </template>
      </popup-radio>
      <!-- 门店 -->
      <popup-radio :options="store.options" v-model="store.value">
        <template slot-scope="props" slot="each-item">
          <p>{{ props.label }}</p>
        </template>
      </popup-radio>
    </group>
    <!-- 人员列表 -->
    <group class="container" id="user-list-container" ref="userList">
      <cell-box
        is-link
        class="user-item"
        v-for="(item, index) in userList"
        :key="index"
        @click.native="goRoute(item)"
      >
        <div class="logo-box">
          <img v-if="item.userHeadimg" :src="item.userHeadimg" alt="logo" class="logo">
          <img v-else :src="defaultImg" alt="logo" class="logo">
        </div>
        <div>
          <div class="user-item-name">
            {{item.userName}}
            <span v-if="item.nickName">[{{item.nickName}}]</span>
          </div>
          <div class="user-item-position">{{item.positionName}}</div>
        </div>
      </cell-box>
    </group>
    <infinite-loading @infinite="infiniteHandler" spinner="circles" :identifier="identifier">
      <span slot="no-results" class="null-data">没有结果o(╥﹏╥)o</span>
      <span slot="no-more" class="null-data">没有更多数据了o(╥﹏╥)o</span>
    </infinite-loading>
  </view-box>
 </div>
</template>

<script>
import Vue from "vue";
import InfiniteLoading from "vue-infinite-loading";
import {
  ViewBox,
  XHeader,
  Group,
  CellBox,
  PopupRadio,
  Popup,
  Radio
} from "vux";
// 用户头像
import defaultImg from "@/assets/images/userIcon.png";
import myIcon from "@/assets/images/my-icon.png";
import { Area } from "vant";

import { getOrgList, getPositionList, queryStaffList } from "@/api/user";
Vue.use(Area);
export default {
  components: {
    InfiniteLoading,
    XHeader,
    Group,
    CellBox,
    PopupRadio,
    Popup,
    Radio,
    ViewBox
  },
  data() {
    return {
      defaultImg,
      myIcon,
      userList: [],
      navIndex: 0,
      normalStatus: {
        value: "正常",
        options: ["正常", "禁用"]
      },
      department: {
        value: "部门",
        options: [{ key: "", value: "全部", level: 0 }]
      },
      position: {
        value: "部门",
        options: [
          { key: 1, value: "部门查询" },
          { key: 2, value: "关闭部门查询" }
        ]
      },
      region: {
        value: "大区",
        options: [{ key: "", value: "暂无大区数据" }]
      },
      area: {
        value: "片区",
        options: [{ key: "", value: "暂无片区数据" }]
      },
      store: {
        value: "门店",
        options: [{ key: "", value: "暂无门店数据" }]
      },
      order: {
        value: "排序",
        options: [
          { key: "join", value: "加入时间" },
          { key: "loginTime", value: "最后登录时间" },
          { key: "loginCount", value: "登录次数" },
          { key: "userName", value: "用户名" },
          { key: "org", value: "部门" },
          { key: "position", value: "职位" }
        ]
      },
      orderTitle: [
        { key: "asc", value: "正序" },
        { key: "desc", value: "倒序" }
      ],
      searchParams: {
        userStatus: "1", // 员工状态（1：正常，2：禁用）
        orgNo: "", // 部门编号
        positionNo: "", // 职位编号
        orderByColumn: "", // 排序字段（join：加入时间，loginTime：最后登陆时间，loginCount：登陆次数，userName：姓名，org：部门，position：职位）
        orderByType: "asc", // 排序类型（asc：正序，desc：倒序）
        currentPage: 1, // 当前页
        pageSize: 10, // 一页大小
        queryType: ""
      },
      isOpen: "",
      orgType: 1,
      parentRow: "",
      currentPage: 1,
      paginator: {
        currentPage: 1,
        totalPages: 1
      },
      identifier: +new Date(),
      infiniteFlag: false //
    };
  },
  watch: {
    // 选择状态
    "normalStatus.value"(newVal) {
      this.searchParams = {
        ...this.searchParams,
        userStatus: newVal === "正常" ? "1" : "2"
      };
      this.handleSelect();
    },
    // 选择部门
    "department.value"(newVal) {
      this.searchParams = {
        ...this.searchParams,
        orgNo: newVal
      };
      this.handleSelect();
    },
    // 选择职位
    "position.value"(newVal) {
      this.isOpen = newVal;
      // this.handleSelect();
    },
    // 排序方式
    "order.value"(newVal) {
      this.searchParams = {
        ...this.searchParams,
        orderByColumn: newVal
      };
      this.handleSelect();
    },
    "region.value"(newVal) {
      if (!newVal) return;
      this.searchParams.orgNo = newVal;
      this.searchParams.queryType = 1;
      this.orgType = 2;
      this.getDepartmentData();
      this.area.value = "片区";
      this.store.value = "门店";
      this.handleSelect();
    },
    "area.value"(newVal) {
      if (!newVal) return;
      this.searchParams.orgNo = newVal;
      this.searchParams.queryType = 2;
      this.orgType = 3;
      this.getDepartmentData();
      this.store.value = "门店";
      this.handleSelect();
    },
    "store.value"(newVal) {
      if (!newVal) return;
      this.searchParams.queryType = 3;
      this.searchParams.orgNo = newVal;
      this.getDepartmentData();
      this.handleSelect();
    }
  },
  methods: {
    infiniteHandler($state) {
      // console.log('infiniteHandler', $state)
      console.log("infiniteHandler", $state);
      if (this.currentPage <= this.paginator.totalPages) {
        this.getStaffData(false, $state);
        // $state.loaded();
      } else {
        if (this.infiniteFlag) {
          $state.loaded();
        }
        $state.complete();
      }
    },
    areaShow() {},
    // 获取部门数据
    getDepartmentData() {
      getOrgList({
        orgIntType: this.orgType,
        parentRow: this.searchParams.orgNo,
        pageSize: 10000
      }).then(res => {
        if (res.code === 200) {
          // 返回的数据
          res.data.list.forEach(v => {
            v.key = v.rowNo;
            v.value = v.orgName;
          });
          if (this.orgType == 1 && res.data.list.length) {
            this.region.options = res.data.list;
          } else if (this.orgType == 2 && res.data.list.length) {
            this.area.options = res.data.list;
          } else if (this.orgType == 3 && res.data.list.length) {
            this.store.options = res.data.list;
          }

          // 排序 过滤出没有 parentRow 的部门 为一级部门
          // let arr = data
          //   .sort((a, b) => a.id - b.id)
          //   .filter(item => !item.parentRow);
          // let newArr = [];
          // 遍历
          // arr.forEach((item, index) => {
          // 一级部门
          // newArr.push({ ...item, level: 0 });

          // let res = data.filter(d => {
          //   return d.parentRow === item.rowNo;
          // });
          // let result = [];
          // let idx = 0;
          // 如果 有子级部门 递归调用
          // this.recursion(res, result, idx, data);
          // concat
          //   newArr.push(...result);
          // });
          // level: item.level 部门等级
          // this.department.options.push(
          //   ...newArr.map(item => ({
          //     key: item.rowNo,
          //     value: item.orgName,
          //     level: item.level
          //   }))
          // );
          // console.log(this.department.options)
        }
      });
    },
    // 获取职业列表
    getPositionData() {
      getPositionList().then(res => {
        if (res.code === 200) {
          this.position.options.push(
            ...res.data.list.map(item => ({
              key: item.positionCode,
              value: item.positionName
            }))
          );
        }
      });
    },
    // 获取人员列表
    getStaffData(flag, $state) {
      queryStaffList({
        ...this.searchParams,
        currentPage: this.currentPage
      }).then(res => {
        if (res.code === 200) {
          let { list, paginator } = res.data;
          this.currentPage++;
          this.userList = this.userList.concat(list || []);
          this.paginator = res.data.paginator;
          // 筛选状态 重新监听事件
          this.infiniteFlag = flag;
          // 没有数据
          if (!this.userList.length) {
            this.infiniteFlag = false;
            $state && $state.complete();
          } else {
            $state && $state.loaded();
          }
          // if (flag) {
          //   // 初始化 加载组件
          //   this.identifier = +new Date();
          // }
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    // 选择状态
    handleSelect() {
      // 初始化 加载组件
      // this.identifier = +new Date();
      // 当前页码重置
      this.currentPage = 1;
      // 先置空
      this.userList = [];
      this.getStaffData(true);
    },
    goRoute(item) {
      this.$router.push({
        name: "userDetail",
        query: {
          userNo: item.userNo
        }
      });
    },
    // 递归 确定 level
    recursion(arr, Aray, idx, data) {
      // 如果没有 返回
      if (!arr.length) return;
      // level ++
      idx++;
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        // 判断当前项是否还有子级部门
        let res = data.filter(d => d.parentRow === item.rowNo);
        item.level = idx;
        Aray.push(item);

        if (res.length) {
          this.recursion(res, Aray, idx, data);
        }
      }
    }
  },
  created() {
    this.getDepartmentData();
    // this.getPositionData();
    // this.getStaffData();
  },
  mounted() {
    // console.log(this.$refs.userList)
    // let scrollContainer = this.$refs.userList
    // let scrollContainer = document.querySelector('#user-list-container')
    // console.log(scrollContainer)
    // console.log(document.querySelector('#user-list-container > .weui-cells'))
  }
};
</script>
<style lang="less">
.baseinfo-filter-item {
  font-size: 16px;
  display: flex;
  align-items: center;
  // justify-content: center;

  .logo-box {
    width: 40px;
    height: 40px;
    background-color: #99ccff;
    border-radius: 8px;
    margin-right: 10px;
    .logo {
      width: 100%;
      height: 100%;
    }
  }
}
.order-filter-item {
  font-size: 16px;
  .order-title {
    background-color: #e4e4e4;
  }
}
</style>


<style lang="less" scoped>
.add-icon {
  color: #f49715;
  font-size: 20px;
}
.second-row {
  /deep/.weui-cells:before {
    height: 0;
    border-top: 0;
  }
}
.filter-box {
  /deep/ .weui-cells {
    display: flex;
    align-items: center;
    font-size: 13px;
    .weui-cell {
      padding-left: 0;
      padding-right: 0;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      &::before {
        display: none;
      }
      .weui-cell__ft {
        width: 100%;
        text-align: center;
        top: 45%;
        right: 6px;
        &::after {
          transform: rotate(135deg);
        }
      }
    }
  }
}
.container {
  flex: 1;
  overflow: auto;
  margin-top: 20px;
  /deep/ .weui-cells {
    margin-top: 0;
  }
}
.user-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  .logo-box {
    width: 40px;
    height: 40px;
    background-color: #99ccff;
    border-radius: 8px;
    margin-right: 10px;
    .logo {
      width: 100%;
      height: 100%;
    }
  }
  .user-item-name {
    color: #666;
    font-weight: 700;
  }
  .user-item-position {
    color: #0099cc;
  }
}

.null-data {
  display: inline-block;
  padding: 10px;
  font-size: 13px;
  color: #666;
}
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.2s;
}
.fade-enter,
.fade-leave-to {
  transform: translateY(-100%);
}
</style>
