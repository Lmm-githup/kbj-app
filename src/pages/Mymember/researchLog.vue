<template>
  <div>
    <group>
      <cell
        :title="item.theme"
        :inline-desc="item.gmtCreate"
        :link="{name:'researchDetail', params: {id: item.surveyId, flag: flag, title: item.theme}}"
        v-for="(item, index) in List"
        :key="index"
      ></cell>
    </group>
    <no-data v-show="List.length === 0"></no-data>
  </div>
</template>

<script>
import { Cell, Group } from "vux";
import NoData from "@/components/common/NoData";
import { getResearchLog } from "@/api/mymember";
export default {
  name: "researchLog",
  props: {
    custNo: {
      type: String,
      required: true
    },
    flag: {
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
    this.getResearchLog();
  },
  methods: {
    async getResearchLog() {
      let { code, data } = await getResearchLog({
        custNo: this.custNo,
        flag: this.flag
      });
      code === 200 ? (this.List = data) : "";
    }
  }
};
</script>
<style lang="less" scoped>
</style>