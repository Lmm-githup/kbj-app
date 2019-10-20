<template>
  <div class="filter-bar vux-1px-t vux-1px-b" :style="{top: top + 'px'}" ref="filterbar">
    <div class="filter-bar__group">
      <a
      style="display:block"
        class="filter-bar__cell"
        :class="{active: selectIndex === index}"
        @click="handleShowPop(item, index)"
        v-for="(item, index) in filterData"
        :key="index"
      >
        <span class="txt">{{item.name}}</span>
        <i class="fa fa-chevron-down" aria-hidden="true"></i>
      </a>
      <filter-bar-pop
        v-if="showPop"
        :pop-top="popTop"
        :showPop.sync="showPop"
        :select-index="selectIndex"
        :type="type"
        @changeFilter="changeFilter"
        @closeFilterPop="handleColseFilterPop"
      ></filter-bar-pop>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import FilterBarPop from "./FilterBarPop";
export default {
  name: "FilterBar",
  props: {
    top: [Number, String]
  },
  components: { FilterBarPop },
  data() {
    return {
      showPop: false,
      popTop: 0,
      selectIndex: -1,
      type: ""
    };
  },
  computed: {
    ...mapState({
      filterData: state => state.mymember.filterData
    })
  },
  watch: {},
  created() {},
  mounted() {
    this.setPopTop();
  },
  methods: {
    setPopTop() {
      this.$nextTick(() => {
        this.popTop = this.top + this.$refs.filterbar.offsetHeight;
      });
    },
    handleShowPop(item, index) {
      // 选中菜单 打开pop
      this.setPopTop();
      this.showPop = true;
      this.selectIndex = index;
      this.type = item.type;
    },
    changeFilter() {
      this.$emit("changeFilter");
    },
    handleColseFilterPop() {
      // 关闭pop
      this.selectIndex = -1;
      this.$emit("closeFilterPop");
    }
  }
};
</script>
<style lang="less" scoped>
.filter-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  z-index: 10;
  &__group {
    position: relative;
    display: flex;
    z-index: 9;
  }
  &__cell {
    position: relative;
    flex: 0 0 25%;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:not(:nth-of-type(4)):after {
      position: absolute;
      content: " ";
      height: 20px;
      width: 1px;
      top: 50%;
      right: 0;
      margin-top: -10px;
      background-color: #d6d6d6;
      z-index: 1;
    }
    &.active {
      .txt {
        color: #037de0;
      }
      .fa {
        color: #037de0;
        transform: rotate(180deg);
      }
    }
    & > .txt {
      font-size: 14px;
      color: #333;
      padding: 0 4px;
    }
    & > .fa {
      color: #333;
      -webkit-text-stroke: 1px #fff;
      transform: rotate(0);
      transition: all 300ms;
    }
  }
}
</style>