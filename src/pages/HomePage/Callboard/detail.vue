<template>
  <div class="container">
    <!-- <view-box> -->
      <x-header slot="header" :left-options="{showBack: true,backText: ''}" class="header">
      {{info.title}}
    </x-header>
    <div class="panel">
      <h3 class="title">{{info.title}}</h3>
      <p class="info" v-html="info.content"></p>
      <p class="date">{{info.gmtModified | dateFormat}}</p>
    </div>
    <!-- </view-box> -->
  </div>
</template>

<script>
import { XHeader } from "vux";
import { callboardDetail } from "@/api/home";
export default {
  components: {
    XHeader
  },
  data() {
    return {
      rowNo: '',
      info: {}
    }
  },
  methods: {
    getData() {
      callboardDetail({rowNo: this.rowNo}).then(res => {
        if (res.code === 200) {
          this.info = res.data
        }
      })
    }
  },
  created() {
    console.log(this.$route.query.rowNo)
    this.rowNo = this.$route.query.rowNo 
    if(!this.rowNo) this.$router.push({ name: 'relationship' })
    this.getData()
  },
  mounted() {

  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  background-color: #f2f2f2;
  .panel {
    height: 90%;
    background: #fff;
    margin-top:2%;
  }
  .title {
    color: #1b2525;
    font-size: 15px;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  .info {
    font-size: 14px;
    padding: 10px;
    color: #333;
    text-indent: 8px;
    line-height: 28px;
  }
  .date {
    text-align: right;
    padding: 10px;
    font-size: 12px;
  }
}
</style>
