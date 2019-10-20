<template>
  <div class="find-drug-container">
    <div>
      <x-header :left-options="{showBack: true,backText: ''}">
        找药申请
      </x-header>
      <van-cell-group style="margin-top: 10px;">
        <van-field v-model="formData.productName" type="text" required label="药品名称" placeholder="请输入药品名称" />
        <van-field v-model="formData.productSpec" type="text" required label="药品规格" placeholder="请输入药品规格" />
        <van-field v-model="formData.manufacturer" type="text" required label="生产厂家" placeholder="请输入生产厂家" />
        <van-field v-model="formData.stock" type="text" required label="数量" placeholder="请输入药品数量" />
        <van-field v-model="formData.contactName" type="text" required label="联系人" placeholder="请输入联系人" />
        <van-field v-model="formData.phone" type="text" required label="手机号" placeholder="请输入手机号" />
        <van-field v-model="formData.price" type="text" label="单价" placeholder="请输入药品单价" />
        <van-field v-model="formData.conmments" type="text" label="备注" placeholder="请填写备注" />
      </van-cell-group>
      <div class="drug-img-container">
        <div class="drug-img" v-for="(item, index) in drugImg" :key="index">
          <a class="van-icon van-icon-close close-icon" @click="removeImg(item, index)"></a>
          <img :src="item">
        </div>
      </div>
      <van-uploader :after-read="onRead" @oversize="onOverSize" :max-size="maxSize" :disabled="disabled">
        <div class="upload-box">
          <span class="van-icon van-icon-photo-o"></span>
          <span>上传图片</span>
        </div>
      </van-uploader>
    </div>
    <van-button type="info" class="submit-btn" @click="submit" :disabled="disabled">提交</van-button>
  </div>
</template>

<script>
import Vue from 'vue'
import { XHeader } from "vux"
import { Field, Cell, CellGroup, Uploader, Button } from 'vant'
Vue.use(Field)
  .use(Cell)
  .use(CellGroup)
  .use(Uploader)
  .use(Button)
import { Validator } from '@/utils/Validator'
import { postFindDrugData } from '@/api/drug'
import { uploadImgByBase64 } from '@/api/common'
export default {
  components: {
    XHeader
  },
  data() {
    return {
      formData: { 
        "productName": "", // 药品名称
        "productSpec": "", // 药品规格
        "manufacturer": "", // 生产厂家
        "stock": "", // 数量
        "price": "", // 单价
        "contactName": "", // 联系人
        "phone": "", // 手机号
        "conmments": "" // 备注
      },
      maxSize: 1024 * 1024 * 2,
      drugImgData: [],
      drugImg: [],
      disabled: false
    }
  },
  methods: {
    onRead(file) {
      console.log(file)
      if (this.drugImg.length >= 4) {
        this.$vux.toast.show({
          text: '最多只允许上传4张图片！',
          time: 2000,
          type: "text"
        })
        return
      }
      this.drugImg.push(file.content)
      let reg = /^data:image\/(jpeg|png|gif);base64,/
      let attachName = file.content.replace(reg, '')
      this.disabled = true
      uploadImgByBase64({
        attachName
      }).then(res => {
        if (res.code === 200) {
          this.drugImgData.push({
            ...res.data
          })
        }
      }).finally(res => {
        this.disabled = false
      })
    },
    onOverSize(file) {
      this.$vux.toast.show({
        text: '图片大小超出限制！',
        time: 2000,
        type: "text"
      })
    },
    removeImg (item, index) {
      if (this.disabled) return
      this.drugImg.splice(index, 1)
      this.drugImgData.splice(index, 1)
    },
    validatorFrom ({productName, productSpec, manufacturer, stock, contactName, phone}) {
      let validator = new Validator()
      validator.add(productName, [
        {strategy: 'isNoEmpty',errorMsg:'药品名称不能为空'}
      ])
      validator.add(productSpec, [
        {strategy: 'isNoEmpty',errorMsg:'药品规格不能为空'}
      ])
      validator.add(manufacturer, [
        {strategy: 'isNoEmpty',errorMsg:'生产厂家不能为空'}
      ])
      validator.add(stock, [
        {strategy: 'isNoEmpty',errorMsg:'数量不能为空'}
      ])
      validator.add(contactName, [
        {strategy: 'isNoEmpty',errorMsg:'联系人不能为空'}
      ])
      validator.add(phone, [
        {strategy: 'isNoEmpty',errorMsg:'手机不能为空'}
      ])
      return validator.start()
    },
    submit () {
      let {
        productName,
        productSpec,
        manufacturer,
        contactName,
        stock,
        phone,
        price,
        conmments
      } = this.formData;
      let errorMsg = this.validatorFrom(this.formData)
      if (errorMsg) {
        this.$vux.toast.show({
          text: errorMsg,
          time: 2000,
          type: "text"
        })
        return
      }
      let productImages = this.drugImgData.map(item => item.fileUrl).join(',')
      postFindDrugData({
        productName,
        productSpec,
        manufacturer,
        // productImages: this.drugImg,
        productImages,
        contactName,
        stock,
        phone,
        price,
        conmments
      }).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            text: '创建成功!',
            time: 2000,
            type: "text"
          })
          this.$router.go(-1)
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.find-drug-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.upload-box {
  width: 75px;
  height: 75px;
  margin: 20px;
  text-align: center;
  border: 1px dashed #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #e4e4e4;
  .van-icon {
    font-size: 32px;
  }
}
.drug-img-container {
  display: flex;
  flex-wrap: wrap;
}
.drug-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  height: 100px;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  // margin: 20px 20px 0;
  .close-icon {
    position: absolute;
    right: -3px;
    top: 0;
    font-size: 16px;
    z-index: 9;
    color: #f44;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.submit-btn {
  // position: absolute;
  // bottom: 0;
  // left: 0;
  // right: 0;
  width: 100%;
  font-size: 16px;
}
.van-button--info {
    color: #fff;
    background-color: rgba(0,202,172,1);
    border: 0.02667rem solid rgba(0,202,172,1);
}
</style>
