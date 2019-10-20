<template>
  <div style="height:100%">
    <view-box body-padding-top="40px" class="container">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}" class="header">
      {{info.title}}
    </x-header>
    <div class="main">
      <div class="primary-title">主要内容:</div>
      <div class="content" v-html="info.content">
        <!-- <p>1、遇到不讲理的顾客，应该......</p>
        <p>2、遇到顾客退换货......</p>
        <p>3、遇到不讲理的顾客，应该......</p>
        <p>4、遇到顾客退换货......</p> -->
      </div>
    </div>
  </view-box>
  </div>
</template>

<script>
import { XHeader } from "vux";
import { callboardDetail } from "@/api/home";
import Utils from "@/utils/utils";
const utils = new Utils();
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
          this.$nextTick(()=>{
            let deviceType = utils.deviceType();
            let dom = document.getElementsByTagName('iframe')[0]
            dom.setAttribute('width', window.screen.width)
            if (deviceType == 'ios') {
              dom.setAttribute('scrolling', 'no')
            }
          })
        }
      })
    }
  },
  created() {
    this.rowNo = this.$route.query.rowNo
    if(!this.rowNo) this.$router.push({ name: 'trainCenter' })
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.main {
  padding: 10px;
  font-size: 14px;
  color: #333;
  .primary-title {
    font-size: 15px;
    font-weight: bold;
    color: #1b252e;
    padding-left: 10px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 5px;
      width: 3px;
      height: 15px;
      background-color: #f90;
    }
  }
  /deep/ .content {
    p {
      line-height: 36px;
    }
    img {
      width: 100%;
    }
    iframe {
      width: 1px;
      min-width: 100%;
      *width:100%;
      min-height: 300px;
    }
  }
}
</style>
