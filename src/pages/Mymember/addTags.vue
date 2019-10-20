<template>
  <div>
    <div class="addtags-title">会员标签</div>
    <div class="tags-group vux-1px-b" v-for="(item, index) in newTags" :key="index">
      <div class="tags-group__title">{{item.typeName}}</div>
      <div class="tags-group__main">
        <a
          class="tags-item"
          :class="{active: citem.status === 'Y'}"
          @click="toggleEditTag(index, cindex, citem)"
          v-for="(citem, cindex) in item.list"
          :key="cindex"
        >{{citem.tagName}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getMemberInfo, getTags, editTags } from "@/api/mymember";
export default {
  name: "addTags",
  props: {
    custNo: {
      type: String,
      required: true
    }
  },
  components: {},
  data() {
    return {
      memberInfo: null,
      tags: []
    };
  },
  computed: {
    ...mapState({
      editmember: state => state.mymember.memberInfo
    }),
    newTags: function() {
      if (this.tags.length === 0) return [];
      let newTags = [];
      let tagMark = [];
      let tagMarkIndex = 0;
      this.tags.forEach((el, i) => {
        if (!el.type) return;
        let tagItem = {
          tagName: el.tagName,
          type: el.type,
          status: el.status.toUpperCase()
        };
        if (tagMark.includes(el.type)) {
          newTags[tagMarkIndex].list.push(tagItem);
          return;
        } else {
          let newTagsItem = {
            typeName: el.type,
            list: []
          };
          newTags.push(newTagsItem);
          tagMark.push(el.type);
          tagMarkIndex = tagMark.length - 1;
          return;
        }
      });
      return newTags;
    }
  },
  watch: {
    editmember: {
      handler: function(val) {
        if (val) {
          this.memberInfo = val;
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
    this.getTags();
    if (!this.memberInfo || !this.editmember) {
      this.getInfo();
    }
  },
  methods: {
    ...mapActions(["SET_EDITMEMBER"]),
    async getTags() {
      let { code, data } = await getTags({ custNo: this.custNo });
      code === 200 ? (this.tags = data) : "";
    },
    async getInfo() {
      let { code, data } = await getMemberInfo({ custNo: this.custNo });
      code === 200 ? ((this.memberInfo = data), this.SET_EDITMEMBER(data)) : "";
    },
    async toggleEditTag(index, childIndex, citem) {
      let status = this.newTags[index].list[childIndex].status;
      let _status = status === "Y" ? "N" : "Y";
      this.$set(this.newTags[index].list[childIndex], "status", _status);
      citem.status === "Y" ? (citem.status = "激活") : (citem.status = "停用");
      let { code, data } = await editTags({
        custNo: this.custNo,
        memberTagDtoList: [{ ...citem }]
      });
      code === 200 ? this.getTags() : "";
    }
  }
};
</script>
<style lang="less" scoped>
.addtags-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding: 10px 15px;
  background-color: #f4ebeb;
}
.tags-group {
  padding: 10px 15px;
  background-color: #fff;
  &__title {
    position: relative;
    padding: 10px 14px;
    font-size: 14px;
    color: #1d459b;
    &::after {
      position: absolute;
      content: " ";
      left: 0;
      top: 50%;
      height: 14px;
      margin-top: -7px;
      width: 4px;
      background-color: #1d459b;
      z-index: 1;
    }
  }
  &__main {
    padding: 15px 0;
    zoom: 1;
    &::after {
      content: "";
      display: block;
      visibility: hidden;
      clear: both;
      height: 0;
    }
    .tags-item {
      float: left;
      padding: 2px 12px;
      border: 1px solid #a1a1a1;
      font-size: 14px;
      color: #aeaeae;
      background-color: #fff;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 30px;
      &.active {
        color: #f39716;
        border-color: #f5a739;
        background-color: #fef4e5;
      }
    }
  }
}
</style>