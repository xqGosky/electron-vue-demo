<template>
  <el-dialog title="订单查询" :visible.sync="searchBoxShow" width="60%" show-close center>
    <div class="search-warp">
      <div class="left">
        <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-table :data="orderList" highlight-current-row border
                  stripe>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column property="name" label="销售单号"></el-table-column>
        </el-table>
      </div>
      <div class="right">
        <el-table :data="goodsList" highlight-current-row border
                  stripe>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column
            prop="title"
            label="门店">
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
          <el-table-column
            prop="sale_price"
            label="折后价格">
          </el-table-column>
          <el-table-column
            prop="total_amount"
            label="小计">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        searchBoxShow: false,
        searchValue: '',
        orderList: [],
        goodsList: []
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      // 显示订单查询弹窗
      showSearchBox () {
        this.searchBoxShow = true
      // this.handleOrderList();
      },
  
      // 显示所有订单 并且显示订单第一个的商品列表
      handleOrderList () {
        let login_info = JSON.parse(localStorage.getItem('login_info'))
        let params = {
          store_id: login_info.store_id,
          machine_no: login_info.machine_no,
          trade_no: ''
        }
        common.ajax({
          url: '/trade/query.do',
          params: params,
          noloading: true,
          success: (data) => {
            if (data.code == 200) {
              this.orderList = data
              console.log(data)
              this.goodsList = data[0].item
            }
          }
        })
      },
  
      // 搜索
      handleSearch (data) {
        let login_info = JSON.parse(localStorage.getItem('login_info'))
        let params = {
          store_id: login_info.store_id,
          machine_no: login_info.machine_no,
          trade_no: data || this.trade_no
        }
        common.ajax({
          url: '/trade/query.do',
          params: params,
          noloading: true,
          success: (data) => {
            if (data.code == 200) {
              this.goodsList = data.item
              console.log(data)
            }
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .search-warp {
    display: flex;
    flex-direction: row;
    .left {
      flex: 1;
    }
    .right {
      margin-left: 10px;
      flex: 2;
    }
  }
</style>
