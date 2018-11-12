<template lang="html">
  <div class="">
    <div class="el-row">
      <el-radio v-model="radio" :label="1">备选项</el-radio>
      <el-radio v-model="radio" :label="2">备选项</el-radio>
    </div>
    <div class="el-row" style="margin-top:10px">
      <div class="el-col-6">
        <el-upload
            class="avatar-uploader"
            name="img"
            :action="actionUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess"
            :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
  import * as common from '../../assets/js/common.js'
import { mapGetters } from 'vuex'
export default {
    data () {
      return {
        actionUrl: this.$props.action,
        imageUrl: '',
        radio: 1
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
      handleAvatarScucess (res, file) {
        // if(res.code != 100) {
        //   fish.notify(res.message)
        //   return false;
        // }
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
