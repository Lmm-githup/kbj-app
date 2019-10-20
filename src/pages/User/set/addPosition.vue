<template>
  <div class="org-index">
    <x-header :left-options="{showBack: true,backText: ''}">职位设置</x-header>
    <group>
      <cell title="上级职位" :value="addPositionFrom.parentName" is-link @click.native="goPositionList"></cell>
      <cell title="职位类型" :value="addPositionFrom.positionTypeValue" is-link @click.native="selectPositionType">
        <span slot="title" class="input-right-solt">
            <span class="input-right-solt-required">*</span>
            职位类型
          </span>
      </cell>
      <x-input title="职位名称" text-align="right" v-model="addPositionFrom.positionName" required>
         <span slot="label" class="input-right-solt">
            <span class="input-right-solt-required">*</span>
            职位名称
          </span>
      </x-input>
      <x-input title="职位编号" text-align="right" v-model="addPositionFrom.positionCode" required>
        <span slot="label" class="input-right-solt">
            <span class="input-right-solt-required">*</span>
            职位编号
          </span>
      </x-input>
    </group>
      <footer-button text="保存" @click="verify"></footer-button>
      <van-popup v-model="show" position="bottom">
        <van-picker value-key="dataValue" :columns="positionTypeList" show-toolbar @cancel="show = false" @confirm="confirmPositionType " />
      </van-popup>
  </div>

</template>

<script>
import { XHeader, Cell, Group, XInput } from "vux";
import Vue from 'vue'
import { Picker, Popup  } from 'vant';
import { savePosition } from "@/api/user";
import { commonLov } from "@/api/common";
import FooterButton from "@/components/common/FooterButton"
Vue.use(Popup).use(Picker);
export default {
  name: "orgList",
  components: {
    XHeader,
    Cell,
    Group,
    XInput,
    FooterButton
  },
  data() {
    return {
      show: false,
      addPositionFrom: {
        positionType: 'STORE_MANAGE',
        positionName: '',
        positionCode: '',
        parentPositionNo: '',       
        positionTypeValue: '',
        parentName: ''
      },
      positionTypeList: []
    };
  },
  beforeRouteEnter(to,from,next){
      next((vm)=>{
          if (from.name == 'positionList') {
            vm.addPositionFrom = {...vm.$store.state.user.positionFrom}
            vm.addPositionFrom.parentName = vm.$store.state.user.addPosition.positionName;
            vm.addPositionFrom.parentPositionNo = vm.$store.state.user.addPosition.rowNo;
          } else {
          }
      })
  },
  methods: {
    confirmPositionType(item) {
      this.addPositionFrom.positionType = item.dataKey
      this.addPositionFrom.positionTypeValue = item.dataValue
      this.show = false
    },
    selectPositionType() {
      this.show = true
    },
    goPositionList() {
      this.$store.commit('SAVE_POSITION_FROM', this.addPositionFrom)
      this.$router.push({path: '/positionList'})
    },
    verify() {
      if (!this.addPositionFrom.positionType) {
        this.$vux.toast.text('请选择职位类型!');
        return
      } else if (!this.addPositionFrom.positionName) {
        this.$vux.toast.text('请填写职位名称!');
        return
      } else if (!this.addPositionFrom.positionCode) {
        this.$vux.toast.text('请填写职位编号!');
        return
      }
      this.save()
    },
    save() {
      delete this.addPositionFrom.positionTypeValue
      delete this.addPositionFrom.parentName
      savePosition(
        this.addPositionFrom
      ).then(res => {
        console.log(res)
        if (+res.code === 200) {
          let _this = this
          this.$vux.toast.show({
            text: "添加成功!",
            time: 1000,
            type: "text",
            onHide() {
              _this.$router.go(-1);
            }
          });
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      })
    },
    getPositionType () {
      commonLov(
        {dataType: 'POSITION_TYPE'}
      ).then(res => {
        if (+res.code === 200) {
          this.positionTypeList = res.data
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      })
    }
  },
  mounted() {
    this.getPositionType()
    // this.addOrgFrom.parentRow = this.$store.state.user.addOrg.orgNo;
  }
};
</script>

<style scoped lang="less">
.org-index {
  .input-right-solt{
    position:relative;
    padding-left: 8px;
    >.input-right-solt-required{
      color:red;
      position:absolute;
      //top: -9px;
      left: -1px;
    }
  }
}
</style>
