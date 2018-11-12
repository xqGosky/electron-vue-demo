<template lang="html">
  <ul class="mutiImgContainer">
    <li v-if="imageUrlArr.length > 0" v-for="item in imageUrlArr" class="mutiImg imgItem">
      <img :src="item" class="avatar">
      <i @click.self="deleteImgItem(item)" class="el-icon-close imageLabel"></i>
    </li>
    <li  class="mutiImg displayNone">*动态组件拖动必备*</li>
    <el-upload
      class="avatar-uploader"
      name="uploadFile"
      :action="actionUrl"
      :show-file-list="false"
      :on-success="handleAvatarScucess"
      multiple
      :before-upload="beforeAvatarUpload">
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </ul>
</template>
<script>
import * as common from '../../assets/js/common.js'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      actionUrl: this.$props.action,
      maxNumber: this.$props.maxUpload ? this.$props.maxUpload : 100,
      currentSelectNumber: 0
    }
  },
  props: ['action', 'maxUpload'],
  mounted () {
    let self = this
    $('ul.mutiImgContainer').dragsort({
      dragSelector: 'img',
      dragEnd: function () {
        let nodeArr = $('ul.mutiImgContainer .imgItem')
        let tempArr = []
        for (var i = 0; i < nodeArr.length; i++) {
          tempArr.push($(nodeArr[i]).find('img').attr('src'))
        }
        self.$store.commit('updateUploadMutiImgUrl', [])
        self.$nextTick(() => {
          self.$store.commit('updateUploadMutiImgUrl', tempArr)
        })
      }
    })
  },
  beforeDestroy () {
    this.$store.commit('updateUploadMutiImgUrl', [])
  },
  computed: {
    imageUrlArr () {
      return this.$store.state.uploadMutiImgUrl
    }
  },
  ready () {},
  attached () {},
  methods: {
    handleAvatarScucess (res, file) {
      this.currentSelectNumber = this.imageUrlArr.length
      if (this.currentSelectNumber == this.maxNumber) {
        this.$message.error('最多上传' + this.currentSelectNumber + '张图片')
        return false
      }
      if (res.code != 100) {
        fish.notify(res.message)
        return false
      }
      this.imageUrlArr.push(res.object.url)
      this.$store.commit('updateUploadMutiImgUrl', this.imageUrlArr)
      // this.$emit('onUpdate', this.imageUrl);
    },
    beforeAvatarUpload (file) {
      this.currentSelectNumber = this.imageUrlArr.length
      if (this.currentSelectNumber == this.maxNumber) {
        this.$message.error('最多上传' + this.currentSelectNumber + '张图片')
        return false
      }
      this.currentSelectNumber += 1
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    deleteImgItem (item) {
      let tempArr = []
      for (let i in this.imageUrlArr) {
        if (this.imageUrlArr[i] != item) {
          tempArr.push(this.imageUrlArr[i])
        }
      }
      this.$store.commit('updateUploadMutiImgUrl', tempArr)
    }
  },
  components: {}
}
</script>
<style language="less" >
  .mutiImg {
    float: left;
    position: relative;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .avatar-uploader {
    float: left;
  }
  .imageLabel {
    color:red;
    position: absolute;
    top:5px;
    right: 5px;
    font-size: 13px;
    z-index: 2;
  }
  .mutiImgContainer li{
    width: 180px;
    height: 180px;
    float: left;
  }
</style>
