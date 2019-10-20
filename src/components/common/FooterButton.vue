<template>
<div>
  <a class="common-footer-btn" style="background:rgba(0, 202, 172, 1)"  @click="click">{{text}}</a>
</div>
</template>

<script>
export default {
  name: "FilterBar",
  props: {
    bgColor: {
      type: String,
      default: '#334299'
    },
    text: {
      type: String,
      default: '确认'
    }
  },
  data() {
    return {
    };
  },
  computed: {

  },
  watch: {},
  created() {},
  mounted() {
  },
  methods: {
    click () {
      this.$emit('click')
    },
  }
};
</script>
<style lang="less" scoped>
.common-footer-btn{
  display: block;
   position: fixed;
  left: 0;
  right: 0;
  bottom: 10vh;
  margin: 0 auto;
  margin-top: 40px;
  width: 80%;
  background: rgba(0, 202, 172, 1);
  text-align: center;
  font-size: 16px;
  padding: 7px 12px;
  color: #fff;
  border-radius: 10px;
}

</style>