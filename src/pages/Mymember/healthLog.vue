<template>
  <div>
    <group>
      <cell
        v-for="(item, index) in List"
        :key="index"
        :title="item.describe.split(';').join('  ')"
        :inline-desc="item.measTime | dateFormat"
        :link="{name:'healthLogDetail', params: {memberNo: item.memberNo, mappingId: item.mappingId}}"
      >
        <p
          slot="after-title"
          style="font-size:14px;color:#ff7e00"
          v-show="item.dataSources"
        >数据来源: {{item.dataSources}}</p>
      </cell>
    </group>
    <no-data v-show="List.length === 0"></no-data>
  </div>
</template>

<script>
import { Cell, Group } from "vux";
import NoData from "@/components/common/NoData";
import { getHealthLog } from "@/api/mymember";
export default {
  name: "healthLog",
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: { Cell, Group, NoData },
  data() {
    return {
      List: []
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      let { code, data } = await getHealthLog({ memberNo: this.custNo });
      code === 200 ? (this.List = data) : "";
    }
  }
};
</script>
<style lang="less" scoped>
</style>