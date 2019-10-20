<template>
  <div class="container">
    <x-header :left-options="{showBack: true,backText: ''}" class="header">
      订单明细
    </x-header>
    <div class="list">
      <div class="list-item" v-for="(item, index) in orderInfo" :key="index">
        <group>
          <cell primary="content" :title="item.productName" value-align="left" class="title">
            <!-- <template slot="value"> -->
              <div>
                <span>金额: </span> <span class="text-warning">¥{{item.amount || 0.00}}</span>
                <span style="margin-left: 10px">数量: </span> <span class="text-warning">{{item.productNum || 0}}</span>
              </div>
            <!-- </template> -->
          </cell>
          <cell primary="content" title="药品详情" value-align="left" class="info">
            <!-- <template slot="value"> -->
              <p>编号：{{item.productNo}}</p>
              <p>规格：{{item.productSpec}}</p>
              <p>品牌：{{item.brand}}</p>
              <p>产地：{{item.manufacturer}}</p>
            <!-- </template> -->
          </cell>
        </group>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, Group, Cell } from "vux";
import { mapState, mapActions } from "vuex";
import { getDetail } from "@/api/order";
export default {
  components: {
    XHeader,
    Group,
    Cell
  },
  data() {
    return {
      orderInfo: [],
      orderNo: '',
      orderCrmId: '',
    }
  },
  mounted() {
    this.orderNo = this.$route.query.orderNo;;
    this.getInfo();
  },
  methods: {
    async getInfo(){
      let { data } = await getDetail({'orderNo': this.orderNo});
      this.orderInfo = data || [];
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  /deep/ .list-item {
    .title {
      .vux-label {
        width: 100px;
        font-size: 15px;
        font-weight: 700;
      }
      .weui-cell__ft {
        font-size: 13px;
        color: #5c5c5c;
      }
    }
    .info {
      font-size: 13px;
      .vux-label {
        width: 100px;
        color: #333;
      }
      .weui-cell__ft {
        color: #5c5c5c;
        p {
          &:not(:first-child) {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
.text-warning {
  color: #f49715;
}
</style>
