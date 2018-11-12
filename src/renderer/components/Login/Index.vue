<template>
  <div class="login-warp">
    <div class="login-box">
      <input type="text" value='17707125668'>
      <input type="text" value='123456'>
      <el-button type="primary" @click="login" style="width: 120px;margin: auto">登入</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    mounted () {
    },
    methods: {
      login () {
        let params = {
          user_name: '17707125668',
          password: this.$md5('123456'),
          cpu_code: 'window.hc.CPUCode',
          hard_disk_code: 'dd', // window.hc.HardDiskCode,
          main_board_coce: 'window.hc.MainBoardCode'
        }
        common.ajax({
          url: 'login.do',
          params: params,
          success: (data) => {
            console.log(data)
            if (data.code == 200) {
              localStorage.setItem('login_info', JSON.stringify(data))
              this.$message({
                message: '登入成功',
                type: 'success'
              })
              router.push('/cart')
            } else {
              this.$message({
                message: '登入失败',
                type: 'warning'
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .login-warp {
    position: fixed;
    z-index: 99;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #ecf0f1;
    .login-box {
      display: flex;
      flex-direction: column;
      background-color: #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 80%);
     padding: 20px 15px 15px;
      border-radius: 10px;
      input{
        width: 250px;
        height: 25px;
        border-radius: 5px;
        border: 1px solid #e4e4e4;
        box-sizing: border-box;
        padding-left: 15px;
        margin: 10px auto;
      }
    }
  }
</style>
