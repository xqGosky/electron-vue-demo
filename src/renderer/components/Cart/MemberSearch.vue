<!--会员搜索弹窗-->
<template>
  <el-dialog
    title="选择会员"
    :visible.sync="show"
    width="350px"
    :before-close="handleClose">
    <form @submit.prevent="search">
      <el-input ref="sinput"
                placeholder="请输入关键字查询"
                v-model="searchkey">
        <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </form>
    <p>{{user_name||""}}</p>
    <!--<el-table-->
      <!--:data="searchTableData"-->
      <!--@row-click="change"-->
      <!--style="width: 100%"-->
      <!--max-height="320"-->
    <!--&gt;-->
      <!--<el-table-column-->
        <!--property="name"-->
        <!--label="名称"-->
      <!--&gt;-->
      <!--</el-table-column>-->
    <!--</el-table>-->
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        searchTableData: [],
        searchkey: '',
        show: false,
        login_info: {},
        user_name: ''
      }
    },
    mounted () {
  
    },
    methods: {
      openMemeberPopup (login_info) {
        this.login_info = login_info
        this.show = true
        this.$nextTick(() => {
          this.$refs.sinput.focus()
        })
      },
      search () {
        let login_info = this.login_info
        let params = {
          merchant_no: 15,
          store_id: login_info.store_id,
          mobile: this.searchkey
        }
        common.ajax({
          url: '/buyer/query.do',
          params: params,
          success: (data) => {
            if (data.code == 200) {
              this.user_name = data.user_name
              console.log(data)
            }
          }
        })
      },
      change (row, event, column) {
        this.member = row
        this.show = false
        this.clean()
      },
      clean () {
        this.searchkey = ''
        this.searchTableData = []
      },
      handleClose (done) {
        done()
      }
    }
  }
</script>

<style scoped>

</style>
