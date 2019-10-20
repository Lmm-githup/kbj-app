<template>
  <div>
    <group style="margin-bottom:10px;">
      <cell title="健康指标记录查看" :link="{name:'healthLog', params: {custNo: custNo}}">
        <i
          class="fa fa-pencil-square-o"
          aria-hidden="true"
          slot="icon"
          style="color:#037de0;margin-right:8px;"
        ></i>
      </cell>
    </group>
    <div class="illness-box">
      <div class="illness-box__head">
        <p class="title">BMI检测:</p>
        <x-button mini type="primary" @click.native="editHealthLog('bmiForm')">保存</x-button>
      </div>
      <div class="illness-box__main">
        <div class="item" v-for="(item, index) in bmiForm" :key="index">
          <div class="title">
            <span></span>
            {{item.fileName}}:
          </div>
          <div class="content">
            <x-input v-model.number="item.indexNum" type="number" :debounce="300">
              <span slot="right" class="unit">{{item.fileUnit}}</span>
            </x-input>
          </div>
        </div>
      </div>
    </div>
    <div class="illness-box">
      <div class="illness-box__head">
        <p class="title">血糖检测:</p>
        <x-button mini type="primary" @click.native="editHealthLog('sugarForm')">保存</x-button>
      </div>
      <div class="illness-box__main">
        <a
          class="item"
          v-for="(item, index) in sugarForm"
          :key="index"
          @click="changeSugarType(item.fileName)"
        >
          <div class="title">
            <x-icon type="ios-checkmark-outline" size="24" v-if="sugarType == item.fileName"></x-icon>
            <x-icon type="ios-circle-outline" size="24" v-show="sugarType != item.fileName"></x-icon>
            {{item.fileName}}:
          </div>
          <div class="content">
            <x-input v-model.number="item.indexNum" type="number" :debounce="300">
              <span slot="right" class="unit">{{item.fileUnit}}</span>
            </x-input>
          </div>
        </a>
      </div>
    </div>
    <div class="illness-box">
      <div class="illness-box__head">
        <p class="title">血压检测:</p>
        <x-button mini type="primary" @click.native="editHealthLog('pressureForm')">保存</x-button>
      </div>
      <div class="illness-box__main">
        <div class="item" v-for="(item, index) in pressureForm" :key="index">
          <div class="title">
            <span></span>
            {{item.fileName}}:
          </div>
          <div class="content">
            <x-input v-model.number="item.indexNum" type="number" :debounce="300">
              <span slot="right" class="unit">{{item.fileUnit}}</span>
            </x-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, XInput, Cell, Group } from "vux";
import { editHealthLog } from "@/api/mymember";

import { mapState } from "vuex";

export default {
  name: "illnessInfo",
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: { XButton, XInput, Cell, Group },
  data() {
    return {
      sugarType: "空腹",
      bmiForm: [
        {
          fileName: "身高",
          indexNum: "",
          type: "BMI检测",
          fileUnit: "cm"
        },
        {
          fileName: "体重",
          indexNum: "",
          type: "BMI检测",
          fileUnit: "kg"
        }
      ],
      sugarForm: [
        {
          fileName: "空腹",
          indexNum: "",
          type: "血糖检测",
          fileUnit: "mmol/L"
        },
        {
          fileName: "饭后2小时",
          indexNum: "",
          type: "血糖检测",
          fileUnit: "mmol/L"
        }
      ],
      pressureForm: [
        {
          fileName: "收缩压",
          indexNum: "",
          type: "血压检测",
          fileUnit: "mmHg"
        },
        {
          fileName: "舒张压",
          indexNum: "",
          type: "血压检测",
          fileUnit: "mmHg"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      permission: state => state.mymember.permission
    })
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async editHealthLog(type) {
      let params = this[type];
      if (type == "sugarForm") {
        if (this.sugarType == "空腹") {
          params = [this.sugarForm[0]];
        } else {
          params = [this.sugarForm[1]];
        }
      }

      for (let i = 0; i < params.length; i++) {
        params[i].memberNo = this.custNo;
      }

      let { code, data } = await editHealthLog(params);
      if (code === 200) {
        this.reset(type);
        this.$vux.toast.text("保存成功");
      }
    },
    changeSugarType(type) {
      this.sugarType = type;
      if (type == "空腹") {
        this.$set(this.sugarForm[1], "indexNum", "");
      } else {
        this.$set(this.sugarForm[0], "indexNum", "");
      }
    },
    reset(type) {
      this[type].forEach(el => {
        el.indexNum = "";
      });
    }
  }
};
</script>
<style lang="less" scoped>
.illness-box {
  &__head {
    background-color: #fff;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: #ff6600;
    }
  }
  &__main {
    padding: 10px 15px;
    display: flex;
    flex-wrap: wrap;
    .item {
      color: #333;
      width: 100%;
      display: flex;
      align-items: center;
      .title {
        font-size: 16px;
        min-width: 7em;
        text-align: right;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /deep/ .vux-x-icon {
          align-content: flex-start;
          fill: #ff6600;
        }
      }
      .content {
        /deep/ .weui-input {
          background-color: #fff;
        }
      }
      /deep/ .weui-icon-success,
      /deep/ .weui-icon-circle,
      /deep/ .weui-icon-success-circle {
        font-size: 14px;
      }
      .input {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        font-size: 14px;
        outline: none;
        background-color: transparent;
      }
    }
  }
}
</style>