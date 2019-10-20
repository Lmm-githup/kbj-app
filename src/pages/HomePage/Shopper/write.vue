<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" class="header">
      写意见
    </x-header>
    <group>
      <selector v-model="optionForm.category" title="类别" :options="list"></selector>
      <selector v-model="optionForm.subCategory" title="子类别" :options="subList"></selector>
    </group>
    <group class="input-box">
      <x-input required title="标题" ref="title" placeholder="请输入标题" v-model="optionForm.title"></x-input>
      <x-textarea required title="内容" ref="content" :rows="10" v-model="optionForm.content"></x-textarea>
    </group>
    <div class="button-group">
      <div class="item">
        <x-button
        class="submit"
        mini
        type="primary"
        :show-loading="isStop"
        :disabled="isStop"
        @click.native="submit()"
      >提交</x-button>
      </div>
      <div class="item">
        <x-button
        class="save"
        type="primary"
        mini
        :show-loading="isStop"
        :disabled="isStop"
        @click.native="save()"
      >存草稿</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addOption, submitOption,getOptionDetail } from '@/api/shopper';
import { XHeader, Group,XButton, Selector, XInput, XTextarea,Confirm } from "vux";
export default {
  components: {
    XHeader,
    Group,
    Selector,
    XInput,
    XButton, 
    Confirm,
    XTextarea
  },
  data () {
    return {
      list: [
        { key: '产品', value: '产品' },
        { key: '会员', value: '会员' },
        { key: '公司', value: '公司' },
        { key: '其他', value: '其他' }
      ],
      subList: [
        { key: '投诉', value: '投诉' },
        { key: '建议', value: '建议' },
        { key: '咨询', value: '咨询' },
        { key: '其他', value: '其他' }
      ],
      isStop: false,
      optionForm: {
        title: '',
        content: '',
        category: '产品',
        subCategory: '建议',
        rowNo: ''
      }
    }
  },
  mounted() {
    this.optionForm.rowNo = this.$route.query.rowNo;
    if(this.optionForm.rowNo){
      this.getOptionDetail();
    }
  },
  methods: {
    async save() {
      const _this = this
      if (this.isStop) {
        return;
      }
      this.isStop = true;
      const validate = this.validateForm();

      if (validate) {
        let _res = await addOption({ ...this.optionForm });
        if (_res.code === 200) {
          this.$vux.alert.show({
              title: "操作提示",
              content: "保存成功",
              onHide() {
                _this.isStop = false;
                _this.$router.back(-1);
              }
            });
        }
        _this.isStop = false;
      } else {
        // error
        this.$vux.toast.show({
          time: 1500,
          type: "warn",
          width: "12em",
          "is-show-mask": true,
          text: "请填写完整的信息"
        });
        this.isStop = false;
      }
    },

    async submit() {
      const _this = this
      if (this.isStop) {
        return;
      }
      this.isStop = true;
      const validate = this.validateForm();
      if (validate) {
        let _res = await submitOption({ ...this.optionForm });
        if (_res.code === 200) {
          this.$vux.alert.show({
              title: "操作提示",
              content: "提交成功",
              onHide() {
                _this.isStop = false;
                _this.$router.back(-1);
              }
            });
        }
        _this.isStop = false;
      } else {
        // error
        this.$vux.toast.show({
          time: 1500,
          type: "warn",
          width: "12em",
          "is-show-mask": true,
          text: "请填写完整的信息"
        });
        this.isStop = false;
      }
    },
    
    async getOptionDetail() {
        let _res = await getOptionDetail({rowNo: this.optionForm.rowNo});
        if (_res.code === 200) {
           this.optionForm.rowNo = _res.data.rowNo;
           this.optionForm.title = _res.data.title;
           this.optionForm.content = _res.data.content;
           this.optionForm.category = _res.data.category;
           this.optionForm.subCategory = _res.data.subCategory;
        }
    },

    validateForm() {
      let noerror = true;
      if (!this.optionForm.title) {
        noerror = false;
        return
      } else if (!this.optionForm.content) {
        noerror = false;
        return
      }
      return noerror;
    },
  }
}
</script>

<style lang="less" scoped>
/deep/ .input-box {
  .weui-input {
    padding: 5px 0 5px 5px;
    border: 1px solid #dfdfdf;
    border-radius: 4px;
  }
  .weui-textarea {
    padding-left: 5px;
    border: 1px solid #dfdfdf;
    border-radius: 4px;
  }
}
.button-group {
  display: flex;  
  align-items: center;
  padding: 50px 0;
  background-color: #fff;
  .item {
    display: flex;
    justify-content: center;
    flex: 1;
    text-align: center;
  }
  .submit,
  .save {
    width: 100px;
    height: 33px;
    line-height: 33px;
    color: #fff;
    background-color: #f59a13;
    border-radius: 4px;
  }
  .submit {
    background: rgba(0,202,172,1);
  }
}
</style>
