<template>
  <div>
    <group>
      <cell
        :title="item.ship"
        :link="{name:'addFamilyCard', params:{custNo: custNo, item: JSON.stringify(item)}}"
        v-for="(item, index) in List"
        :key="index"
      >
        <div slot="icon">
          <img src="/src/assets/images/no-img.jpg" class="avatar">
        </div>
        <!-- <span slot="after-title" class="badge">创建人</span> -->
        <div class="cell-after">
          <span v-if="item.phone">查看详情</span>
          <!--<i class="fa fa-pencil-square-o" aria-hidden="true" v-if="item.phone"></i>-->
          <span class="addbtn" v-else>添加</span>
        </div>
      </cell>
    </group>
  </div>
</template>

<script>
import { Cell, Group } from "vux";
import { getFamily } from "@/api/mymember";
export default {
  name: "familyMember",
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: { Cell, Group },
  data() {
    return {
      List: []
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.getFamily();
  },
  methods: {
    async getFamily() {
      let { code, data } = await getFamily({ custNo: this.custNo });
      code === 200 ? (this.List = data) : "";
    }
  }
};
</script>
<style lang="less" scoped>
.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin-right: 12px;
}
.badge {
  font-size: 12px;
  padding: 3px 6px;
  border: 1px solid #666;
  border-radius: 30px;
}
.cell-after {
  .fa {
    font-size: 24px;
    color: #ff6600;
  }
  .addbtn {
    color: #fff;
    font-size: 12px;
    background-color: rgba(0,202,172,1);
    border-radius: 30px;
    padding: 3px 12px;
  }
}
</style>