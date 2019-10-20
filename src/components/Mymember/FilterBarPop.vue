<template>
  <transition name="fade">
    <div class="filter-bar-pop" :style="{top: popTop + 'px'}">
      <div class="filter-bar-pop__cont">
        <div class="filter-bar-pop__main">
          <div class="filter-bar-pop__slider">
            <scroller lock-x height="200px" ref="scrollerSlider">
              <div class="slider-box">
                <a
                  class="slider-item"
                  :class="{active: copyFilterData[selectIndex].selectIndex === index}"
                  @click="clickSlider(index)"
                  v-for="(item, index) in copyFilterData[selectIndex].popData"
                  :key="index"
                >{{item.name}}</a>
              </div>
            </scroller>
          </div>
          <div class="filter-bar-pop__list">
            <scroller lock-x height="200px" ref="scrollerFilter" v-if="type !== 'time'">
              <div class="filter-box">
                <a
                  class="filter-item"
                  @click="clickFilterItem(findex)"
                  v-for="(fitem, findex) in filterList"
                  :key="findex"
                >
                  <i
                    class="fa fa-circle"
                    aria-hidden="true"
                    v-if="copyFilterData[selectIndex].popData[selectIndexPop].selectFilterIndex == findex"
                  ></i>
                  <i class="fa fa-circle-o" aria-hidden="true" v-else></i>
                  <span class="name">{{fitem.name}}</span>
                </a>
              </div>
            </scroller>
            <div class="filter-time" v-else>
              <a class="filter-item" @click="changeTime('beforeyesterday')">前天</a>
              <a class="filter-item" @click="changeTime('yesterday')">昨天</a>
              <a class="filter-item" @click="changeTime('today')">今天</a>
              <group class="filter-item">
                <calendar
                  title="开始时间"
                  v-model="startTime"
                  @on-change="changeStartTime"
                  disable-future
                  show-popup-header
                  popup-header-title="请选择开始时间"
                ></calendar>
                <calendar
                  title="结束时间"
                  v-model="endTime"
                  @on-change="changeEndTime"
                  disable-future
                  show-popup-header
                  popup-header-title="请选择结束时间"
                ></calendar>
              </group>
            </div>
          </div>
        </div>
        <div class="filter-bar-pop__foot">
          <a class="handle-btn default" @click="resetFilterData">不限</a>
          <a class="handle-btn confirm" @click="confirmFilterData">确认</a>
        </div>
      </div>
      <a style="display:block;" class="filter-bar-pop__mask" @click="closeFilterPop" :style="{top: popTop + 'px'}"></a>
    </div>
  </transition>
</template>

<script>
import _ from "lodash";
import { Scroller, Calendar, Group } from "vux";
import { mapState, mapActions } from "vuex";
export default {
  name: "FilterBarPop",
  props: {
    selectIndex: {
      type: [Number, String],
      required: true
    },
    popTop: [Number, String],
    type: String,
    showPop: {
      type: Boolean,
      default: true
    }
  },
  components: { Scroller, Calendar, Group },
  data() {
    return {
      selectIndexPop: -1,
      filterList: {},
      startTime: "",
      endTime: ""
    };
  },
  computed: {
    ...mapState({
      filterData: state => state.mymember.filterData,
      filterCache: state => state.mymember.filterCache
    }),
    copyFilterData: function() {
      // 初始化 capy cache 状态
      return _.cloneDeep(this.filterCache);
    }
  },
  watch: {
    showPop: function(val) {
      if (val) {
        this.initData();
      }
    },
    selectIndex: {
      handler: function(val) {
        this.initData();
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions(["EDIT_FILTER"]),
    initData() {
      if (this.selectIndex < 0) {
        return;
      }
      // init 一级选中
      this.selectIndexPop = this.copyFilterData[this.selectIndex].selectIndex;
      // init 二级数据
      this.filterList = this.copyFilterData[this.selectIndex].popData[
        this.selectIndexPop
      ].filterList;
      // init 时间信息
      if (this.copyFilterData[this.selectIndex].type === "time") {
        let { startTime, endTime } = this.copyFilterData[
          this.selectIndex
        ].popData[this.selectIndexPop];
        this.startTime = startTime;
        this.endTime = endTime;
      }
    },
    clickSlider(index) {
      // 点击一级菜单 修改 cache 状态
      this.selectIndexPop = index;
      this.filterList = this.copyFilterData[this.selectIndex].popData[
        index
      ].filterList;
      this.copyFilterData[this.selectIndex].selectIndex = index;
      // set 时间信息
      if (this.copyFilterData[this.selectIndex].type === "time") {
        let { startTime, endTime } = this.copyFilterData[
          this.selectIndex
        ].popData[index];
        this.startTime = startTime;
        this.endTime = endTime;
      }

      this.EDIT_FILTER({ data: this.copyFilterData, type: "cache" });
    },
    clickFilterItem(index) {
      // 点击二级
      this.copyFilterData[this.selectIndex].popData[
        this.selectIndexPop
      ].selectFilterIndex = index;
      this.EDIT_FILTER({ data: this.copyFilterData, type: "cache" });
    },
    confirmFilterData() {
      this.EDIT_FILTER({ data: this.copyFilterData });
      this.$emit("changeFilter");
      this.closeFilterPop();
    },
    resetFilterData() {
      // 修改当前筛选栏 还原状态
      let initData = _.cloneDeep(this.filterData); //重新获取最初状态

      initData[this.selectIndex].selectIndex = 0;
      initData[this.selectIndex].popData.forEach(el => {
        if (initData[this.selectIndex].type === "time") {
          el.startTime = "";
          el.endTime = "";
        }
        el.selectFilterIndex = -1;
      });

      this.EDIT_FILTER({ data: initData });
      this.$emit("changeFilter");
      this.closeFilterPop();
    },
    closeFilterPop() {
      // 直接关闭 还原最初筛选
      this.EDIT_FILTER({ data: this.filterData });
      this.$emit("update:showPop", false);
      this.$emit("closeFilterPop");
    },
    changeTime(type) {
      // 按钮
      var dateInfo = new Date();
      if (type === "beforeyesterday") {
        dateInfo.setDate(dateInfo.getDate() - 2);
        var year = dateInfo.getFullYear();
        var month = dateInfo.getMonth() + 1;
        var day = dateInfo.getDate();
      } else if (type === "yesterday") {
        dateInfo.setDate(dateInfo.getDate() - 1);
        var year = dateInfo.getFullYear();
        var month = dateInfo.getMonth() + 1;
        var day = dateInfo.getDate();
      } else {
        dateInfo.setDate(dateInfo.getDate());
        var year = dateInfo.getFullYear();
        var month = dateInfo.getMonth() + 1;
        var day = dateInfo.getDate();
      }
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      let newDate = year + "-" + month + "-" + day;
      this.startTime = newDate;
      this.endTime = newDate;
    },
    changeStartTime(e) {
      // 设置开始时间
      let start = new Date(e);
      let end = new Date(this.endTime);
      if (start.getTime() > end.getTime()) {
        if (this.endTime) this.startTime = this.endTime;
        this.$vux.toast.show({
          text: "时间区间错误",
          type: "warn"
        });
        return;
      }
      this.copyFilterData[this.selectIndex].popData[
        this.selectIndexPop
      ].startTime = e;

      this.EDIT_FILTER({ data: this.copyFilterData, type: "cache" });
    },
    changeEndTime(e) {
      // 设置结束时间
      let start = new Date(this.startTime);
      let end = new Date(e);
      if (start.getTime() > end.getTime()) {
        if (this.startTime) this.endTime = this.startTime;
        this.$vux.toast.show({
          text: "时间区间错误",
          type: "warn"
        });
        return;
      }
      this.copyFilterData[this.selectIndex].popData[
        this.selectIndexPop
      ].endTime = e;

      this.EDIT_FILTER({ data: this.copyFilterData, type: "cache" });
    }
  }
};
</script>
<style lang="less" scoped>
.filter-bar-pop {
  position: fixed;
  z-index: 10;
  &__cont {
    position: fixed;
    width: 100%;
    min-height: 270px;
    background-color: #f2f2f2;
    padding: 10px 5px;
    box-sizing: border-box;
    z-index: 11;
  }
  &__main {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
  }
  &__slider {
    flex: 0 0 48%;
    .slider-item {
      display: block;
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      color: #333;
      text-align: center;
      background-color: #fff;
      margin-bottom: 4px;
      &.active {
        background-color: #ccc;
      }
    }
  }
  &__list {
    flex: 0 0 48%;
    .filter-item {
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      color: #333;
      text-align: center;
      background-color: #fff;
      margin-bottom: 4px;
      display: block;
    }
  }
  &__foot {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    .handle-btn {
      flex: 0 0 48%;
      display: block;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #fff;
      &.confirm {
        color: #fff;
        background-color: #037de0;
      }
    }
  }
  &__mask {
    position: fixed;
    top: 42px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9;
  }
}
.filter-time {
  /deep/ .weui-cells {
    margin-top: 0;
    font-size: 12px !important;
  }
}
</style>