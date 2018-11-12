<template>
  <el-dialog
    class="up-cart-warp"
    title="取单列表"
    :visible.sync="dialogTableVisible"
    width='85%'
  >
    <el-container>
      <div class="left">
        <el-input
          placeholder="请输入单号"
          v-model="searchkey">
          <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-table
          :data="upCartList"
          style="width: 100%"
          highlight-current-row
          @current-change="handleUpCartGoods">
          <el-table-column
            type="index"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            prop="cart_id"
            label="单号">
          </el-table-column>
        </el-table>
      </div>
      <div class="right">
        <el-table
          :data="upCartGoodsList"
          style="width: 100%;height: 68vh"
          highlight-current-row>
          <el-table-column
            type="index"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            prop="title"
            label="商品">
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="sale_price"
            label="单价">
          </el-table-column>
        </el-table>
        <div class="bottom-btns">
          <el-button type="primary" @click="getUpCart">取单</el-button>
          <el-button type="danger">删除</el-button>
        </div>
      </div>
    </el-container>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        dialogTableVisible: false,
        upCartList: [], // 挂起的购物车列表
        upCartGoodsList: [], // 购物车中商品的列表
        searchkey: '',
        cart_id: '', // 当前选中的购物车
        login_info: {}
      }
    },
    mounted () {
      var login_info = JSON.parse(localStorage.getItem('login_info'))
  },
    methods: {
      // 打开取单列表
      showUpCart (data) {
        this.upCartList = data
        console.log(data)
        this.dialogTableVisible = true
      },
      // 搜索订单
      search (data) {
        console.log(this.searchkey)
      },
      // 选择要查看的购物车详情
      handleUpCartGoods (item) {
        this.cart_id = item.cart_id
        this.upCartGoodsList = item.skus
      },
      // 取单
      getUpCart () {
        var login_info = this.login_info
        var params = {
          cart_id: this.cart_id,
          store_id: login_info.store_id
        }
        common.ajax({
          url: '/cart/restore.do',
          params: params,
          success: (data) => {
            if (data.code == 200) {
              this.$message('取单成功')
              this.getPutCartNum()
              this.$emit('getCartList', data.cart_id)
              this.dialogTableVisible = false
            } else {
              this.$message('挂单失败,购物车不能为空')
            }
          }
        })
      },
      getPutCartNum () {
        var login_info = this.login_info
        var params = {
          machine_no: login_info.machine_no,
          store_id: login_info.store_id
        }
        common.ajax({
          url: '/cart/suspend/total.do',
          params: params,
          success: (data) => {
            if (data.code == 200) {
              console.log('剩下', data.num)
              this.$store.commit('changeputUpCartNum', data.num)
            }
          }
        })
      }
  
    }
  }
</script>

<style lang="less">
  .up-cart-warp {
    .left {
      border: 1px solid #e4e4e4;
      padding: 10px 5px;
      box-sizing: border-box;
      border-radius: 5px;
      height: 75vh;
      margin-right: 15px;
    }
    .right {
      flex: 1;
      padding: 0 5px;
      border: 1px solid #e4e4e4;
      box-sizing: border-box;
      border-radius: 5px;
      height: 75vh;
      .bottom-btns {
        height: 7vh;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }

</style>
