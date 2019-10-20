<template>
  <div class="setUser-index">
    <x-header :left-options="{showBack: true,backText: ''}">设置</x-header>
    <div class="head-box">
      <a class="head-info" @click="goAddStaff">
        <i class="fa fa-user-plus head-icon" aria-hidden="true"></i>
        <span class="head-text">添加新成员</span>
      </a>
      <a class="head-info"  @click="goAddOrg">
        <i class="fa fa-sitemap head-icon" aria-hidden="true"></i>
        <span class="head-text">新建部门</span>
      </a>
      <a class="head-info" @click="goAddPosition">
        <i class="fa fa-address-card-o head-icon" aria-hidden="true"></i>
        <span class="head-text">新建职位</span>
      </a>
    </div>
     <div class="editTab">
      <group>
     <cell title="人员设置"  inline-desc="设置人员基本信息" is-link  @click.native="goRoute('setUserBaseInfo')"></cell>
      </group>
     </div>
     <div class="editTab">
      <group>
    <cell title="部门设置"  inline-desc="部门添加、删除、修改等" is-link @click.native="goOrgSet"></cell>
      </group>
    </div>
    <div class="editTab">
      <group>
    <cell title="职位/权限设置"  inline-desc="调整职位的权限以及职位的添加、删除、修改" is-link @click.native="goPermissionSet"></cell>
      </group>
    </div>
  </div>
</template>

<script>
import { XHeader, Cell, Group } from "vux";
export default {
  name: "setUser",
  components: {
    XHeader,
    Cell,
    Group
  },
  data() {
    return {};
  },
  methods: {
    goPermissionSet() {
      this.$router.push({path: '/permissionSet'})
    },
    goOrgSet() {
      this.$router.push({
        path: '/editOrgList'
      })
    },
    goAddPosition() {
      this.$router.push({path: '/addPosition'})
    },
    goAddStaff() {
      this.$router.push({path: '/addStaff'})
    },
    goAddOrg() {
      this.$router.push({path: '/addOrg'})
    },
    // 路由跳转
    goRoute (name) {
      this.$router.push({ name })
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.head-box {
  padding: 20px;
  background: #fff;
  display: flex;
  .head-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .head-icon {
      color: #13227a;
      font-size: 24px;
    }
    .head-text {
      font-size: 12px;
      margin-top: 10px;
      color: #333;
    }
  }
}
.editTab{
  margin-top:-10px;
}
</style>
