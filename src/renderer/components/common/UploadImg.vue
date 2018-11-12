<template lang="html">
  <el-upload
      class="avatar-uploader"
      name="img"
      :action="actionUrl"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
  import * as common from '../../assets/js/common.js'
import { mapGetters } from 'vuex'
export default {
    data () {
      return {
        actionUrl: this.$props.action,
        imageUrl: ''
      }
  },
    props: ['action'],
    mounted () {
      // console.log(this.imageUrl);
    },
    beforeDestroy () {
      this.$store.commit('updateUploadImgUrl', '')
  },
    computed: {
      // imageUrl () {
      //   return this.$store.state.uploadImgUrl
      // }
    },
    ready () {},
    attached () {},
    methods: {
      // 通知父级改变状态
      handleUpdateImgUrl (data) {
        console.log(data)
        this.$emit('updateImgUrl', data)
      },
      // 手动改变imageUrl
      updateImgUrlFromParent (url) {
        this.imageUrl = url
      },
      handleAvatarSuccess (res, file) {
        this.imageUrl = res.url
        // this.$store.commit('updateUploadImgUrl',res.url);
        this.handleUpdateImgUrl(res.url)
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!')
        }
        return isJPG && isLt5M
      }
    },
    components: {}
  }
</script>
