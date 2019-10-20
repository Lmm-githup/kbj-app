<template>
  <div class="org-index">
    <x-header :left-options="{showBack: true,backText: ''}">部门设置</x-header>
    <group>
      <cell title="上级部门" :value="addOrgFrom.parentName" is-link @click.native="goOrgList"></cell>
      <x-input title="部门名称" text-align="right" v-model="addOrgFrom.orgName" required>
        <span slot="label" class="input-right-solt">
            <span class="input-right-solt-required">*</span>
            部门名称
          </span>
      </x-input>
      <x-input title="部门编号" text-align="right" v-model="addOrgFrom.orgCode" required>
        <span slot="label" class="input-right-solt">
            <span class="input-right-solt-required">*</span>
            部门编号  
          </span>
      </x-input>
      <x-input title="排序号" text-align="right" v-model="addOrgFrom.sortSn" ></x-input>
    </group>
    <group>
      <x-textarea placeholder="请输入备注" v-model="addOrgFrom.remark" autosize></x-textarea>
    </group>
    <footer-button text="保存" @click="verify"></footer-button>
  </div>
</template>

<script>
import { XHeader, Cell, Group, XInput, XTextarea } from "vux";
import { saveOrg, editOrg } from "@/api/user";
import FooterButton from "@/components/common/FooterButton"
export default {
  name: "orgList",
  components: {
    XHeader,
    Cell,
    Group,
    XInput,
    XTextarea,
    FooterButton
  },
  data() {
    return {
      rowNo: '',
      editOrgFrom: {},
      addOrgFrom: {
        parentRow: '',
        parentName: '',
        orgCode: '',
        orgName: '',
        sortSn: '',
        remark: ''
      },
      type: ''
    };
  },
  beforeRouteEnter(to,from,next){
      next((vm)=>{
          if (from.name == 'orgList') {
            vm.addOrgFrom = {...vm.$store.state.user.orgFrom}
            vm.addOrgFrom.parentName = vm.$store.state.user.addOrg.orgNoName;
            vm.addOrgFrom.parentRow = vm.$store.state.user.addOrg.orgNo;
          } else {
          }
      })
  },
  methods: {
    goOrgList() {
      this.saveOrgInfo()
      this.$router.push({path: '/orgList'})
    },
    verify () {
      if (!this.addOrgFrom.orgName) {
        this.$vux.toast.text('请填写部门名称!');
        return
      } else if (!this.addOrgFrom.orgCode) {
        this.$vux.toast.text('请填写部门编号!');
        return
      }
      if (this.type == 'edit') {
        this.edit()
      } else {
        this.save()
      }
    },
    saveOrgInfo () {
      this.$store.commit('SAVE_ORG_FROM', this.addOrgFrom)
    },
    edit() {
      editOrg(
       {
         rowNo: this.rowNo,
         orgCode: this.addOrgFrom.orgCode,
         orgName: this.addOrgFrom.orgName,
         parentRow: this.addOrgFrom.parentRow,
         sortSn: this.addOrgFrom.sortSn
       }
      ).then(res => {
        console.log(res)
        if (+res.code === 200) {
          let _this = this
          this.$vux.toast.show({
            text: "修改成功!",
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
    save() {
      delete this.addOrgFrom.parentName
      saveOrg(
        this.addOrgFrom
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
    }
  },
  mounted() {
    this.type = this.$route.query.type || ''
    if (this.type == 'edit') {
      const   item = JSON.parse(this.$route.query.item)
      this.addOrgFrom.parentRow = item.parentRow
      this.addOrgFrom.parentName = item.parentName
      this.rowNo = item.rowNo
      this.addOrgFrom.sortSn = item.sortSn
      this.addOrgFrom.orgCode = item.orgCode
      this.addOrgFrom.orgName = item.orgName
    } else {
      this.addOrgFrom.parentRow = this.$route.query.rowNo || ''
      this.addOrgFrom.parentName = this.$route.query.orgName || ''
    }
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
