<template>
  <div class="jurisdiction-index">
    <x-header :left-options="{showBack: true,backText: ''}">{{titleName }}
      <span slot="right" >
        <i class="fa fa-cog fa-2x" aria-hidden="true" style="color:#f9554c"></i>
      </span>
    </x-header>
    <group title="基本权限">
      <x-switch v-for="(item, index) in authList" :key="index" :title="item.moduleName" v-model="item.selected"></x-switch>
    </group>
    <group title="高级权限">
      <x-switch v-for="(item, index) in expertList" :key="index" :title="item.moduleName"  v-model="item.selected"></x-switch>
    </group>
     <footer-button text="保存" @click="save"></footer-button>
  </div>
</template>

<script>
import { XHeader, Cell, Group, XSwitch } from "vux";
import FooterButton from "@/components/common/FooterButton"
import { getPositionAuth, savePositionAuth } from "@/api/user";
export default {
  name: "jurisdiction",
  components: {
    XHeader,
    Cell,
    Group,
    XSwitch,
    FooterButton
  },
  data() {
    return {
      titleName: '',
      type: '',
      authList: [],
      expertList: []
    };
  },
  methods: {
    getData () {
      getPositionAuth({
        positionType: this.type
      }).then(res => {
        if (+res.code === 200) {
          this.authList = (res.data || []).filter(v => {
            return v.grade == 1
          })
          this.expertList = (res.data || []).filter(v=> {
            return v.grade == 2
          })
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    save() {
      let isSelectedArr = this.authList.concat(this.expertList)
      let params = isSelectedArr.filter(v => {
        return v.selected == true
      })
      let moduleList = params.map(v => {
        return {
          moduleCode: v.moduleCode
        }
      })
      console.log(moduleList)
      savePositionAuth({
        positionType: this.type,
        moduleList
      }).then(res => {
        if (+res.code === 200) {
          let _this = this
          this.$vux.toast.show({
            text: "保存成功!",
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
      });
    }
  },
  mounted() {
     this.titleName = this.$route.query.typeName;
     this.type = this.$route.query.type;
     this.getData()
  }
};
</script>

<style scoped lang="less">
.jurisdiction-index{
  
}
</style>
