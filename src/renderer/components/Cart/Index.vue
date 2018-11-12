<template>
  <div class="hello container">
    <div class="common-card" style="padding:60px 0 140px;">
      <div class="cart-top">
        <div>
          <el-button plain style="margin-right: 20px;width: 150px" @click="openMemeber">会员</el-button>
          <el-select v-model="defaultAssistant" placeholder="请选择">
            <el-option
              v-for="item in assistantList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <input ref="sinput" class="goods-code" type="text" v-model="goodsCode" placeholder="商品条形码"
                 @input="changeInput()">
        </div>
        <div class="statistics-warp">
          <div class="item">上一单</div>
          <div class="item">应收:{{beforeInfo.total_amount || 0}}</div>
          <div class="item">实收:{{beforeInfo.trade_amount || 0}}</div>
          <div class="item">找零:{{beforeInfo.odd_amount || 0}}</div>
        </div>
      </div>
      <el-table
        :data="cartList"
        @current-change="handleCurrentChange"
        highlight-current-row
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="title"
          label="商品">
        </el-table-column>
        <el-table-column
          prop="sale_price"
          label="单价">
        </el-table-column>
        <el-table-column
          prop="deal_price"
          label="折后价">
        </el-table-column>
        <el-table-column
          prop="sale_price"
          label="数量">
          <template slot-scope="scope">
            <el-input-number
              v-model='scope.row.num'
              @change="handleChangeNum(scope.row)"
              size='small'
              :min="1"
              label="描述文字">
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_amount"
          label="小计">
        </el-table-column>
      </el-table>
    </div>
    <div class="cart-bottom">
      <div class="top">
        <div class="left">
          <el-button @click="clearCart">清空</el-button>
          <el-button @click="putUpCart">挂单</el-button>
          <el-button @click="getUpCart">取单({{this.$store.state.putUpCartNum}})</el-button>
          <el-button @click="discountGoods('single')">单品打折</el-button>
          <el-button @click="discountGoods('all')">整单打折</el-button>
          <el-button @click="handleDeleteGoods">删除</el-button>
          <el-button @click="searchGoods">添加商品(测试)</el-button>
        </div>
        <div class="right">
          <p>商品数量:{{goodsNum}}</p>
          <p>商品总价:{{goodsSalePrice}}</p>
          <p>优惠金额:{{goodsSalePrice - trade_amount}}</p>
        </div>
      </div>
      <div class="bottom">
        <el-button @click="changePayType('scan')">扫一扫</el-button>
        <el-button type="danger" @click="changePayType('rmb')">现金</el-button>
        <el-button type="success" @click="changePayType('wechat')">微信</el-button>
        <el-button type="primary" @click="changePayType('alipay')">支付宝</el-button>
      </div>
    </div>
    <!--打折弹窗-->
    <el-dialog
      title="折扣"
      :visible.sync="discountShow"
      width="30%"
      center>
      <template>
        <el-radio v-model="radio" label="rate">根据折扣减免</el-radio>
        <el-radio v-model="radio" label="amount">根据金额减免</el-radio>
        <el-input v-model="discountNum"
                  style="margin-top: 10px"
                  :placeholder="radio =='rate' ?'范围0~100':`范围0~${goodsItem.sale_price ||goodsSalePrice}`"
                  min="0"
                  :max="radio =='rate' ? 100 : goodsItem.sale_price"
                  type="number"></el-input>
      </template>
      <span slot="footer" class="dialog-footer">
    <el-button @click="discountShow = false">取 消</el-button>
    <el-button type="primary" @click=" handleDiscount">确 定</el-button>
  </span>
    </el-dialog>
    <MemberSearch ref='memberSearch'></MemberSearch>
    <!--搜索商品弹窗-->
    <el-dialog title="商品列表" :visible.sync="dialogTableVisible">
      <el-table :data="searchList">
        <el-table-column property="index" label="序号" width="150"></el-table-column>
        <el-table-column property="bar_code" label="编码" width="150"></el-table-column>
        <el-table-column property="title" label="品名" width="200"></el-table-column>
        <el-table-column property="sale_price" label="价格"></el-table-column>
        <el-table-column
          width="150px"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleAddGoods(scope.row)">添加
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--取单列表-->
    <UpCartBlock ref="showUpCart" @getCartList="getCartList"></UpCartBlock>
    <!--付款弹窗-->
    <el-dialog
      title="支付详情"
      :visible.sync="showPayBox"
      width="30%"
      center>
      <el-form :inline="true">
        <el-form-item label="支付条码" v-if="payType == 'alipay' || payType == 'wechat'">
          <el-input
            placeholder="支付条码"
            v-model="payCode"
            :autofocus="true">
          </el-input>
        </el-form-item>
        <el-form-item label="应付金额" v-if="payType == 'rmb'">
          <el-input
            placeholder="应付金额"
            :disabled='true'
            v-model="trade_amount">
          </el-input>
        </el-form-item>
        <el-form-item label="实收金额" v-if="payType == 'rmb'">
          <el-input
            placeholder="实收金额"
            v-model="total_amount"
            @change="changeTotal">
          </el-input>
        </el-form-item>
        <el-form-item label="找  零" v-if="payType == 'rmb'">
          <el-input
            placeholder="找零"
            v-model="reduce_amount"
            :disabled='true'>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPayBox = false">取 消</el-button>
        <el-button type="primary" @click="surePay">确定付款</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import MemberSearch from '@/components/Cart/MemberSearch.vue' // 会员搜索弹窗
  import UpCartBlock from '@/components/Cart/UpCartBlock.vue' // 会员搜索弹窗
  export default {
    data () {
      return {
        cartList: [],
        goodsCode: '',
        goodsItem: {},
        searchList: [],
        cart_id: '', // 购物车id
        goodsSalePrice: 0, // 商品总价
        trade_amount: 0, // 折后总价 应付金额
        goodsNum: 0, // 商品总数
        upCartList: [], // 挂单列表
        dialogTableVisible: false, // 搜索商品弹窗
        discountShow: false, // 打折弹窗
        discountSingle: true, // 是否为单品打折
        assistantList: [], // 营业员列表
        defaultAssistant: '', // 默认营业员
        radio: 'rate', // 默认根据折扣减免
        showPayBox: false, // 支付弹窗
        payCode: '', // 付款条码
        total_amount: '', // 实收金额
        reduce_amount: '', // 找零
        payType: '', // 支付方式
        trade_no: '', // 订单编号
        login_info: {},
        discountNum: '',
        loading: null,
        test: 0,
        beforeInfo: {}// 上一笔订单详情
      }
  },
    props: {},
    components: {
      MemberSearch,
      UpCartBlock
    },
    mounted () {
      this.login_info = JSON.parse(localStorage.getItem('login_info'))
      this.getBeforeOrder()
      // 获取营业员列表
      this.getAssistantList()
      this.$nextTick(() => {
        this.$refs.sinput.focus()
      })
  },
    methods: {
      // 获取上一比交易成功的订单信息
      getBeforeOrder () {
        let params = {
          store_id: this.login_info.store_id,
          machine_no: this.login_info.machine_no
        }
        common.ajax({
          url: '/trade/query/previous.do',
          params: params,
          noloading: true,
          success: (data) => {
            if (data.code == 200) {
              this.beforeInfo = data
            }
          }
        })
      },
  
      // 获取营业员列表
      getAssistantList () {
        let params = {
          store_id: this.login_info.store_id
        }
        common.ajax({
          url: '/assistant/list.do',
          params: params,
          noloading: true,
          success: (data) => {
            if (data.code == 200) {
              this.assistantList = data.data
              for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].is_default) {
                  this.defaultAssistant = data.data[i].id
                }
              }
            }
          }
        })
      },
      // 支付 结算 弹窗 type  scan扫一扫 rmb人民币  alipay支付宝  wechat微信
      changePayType (type) {
        this.payType = type
        if (type == 'scan') {
          this.handlePay()
        } else {
          this.showPayBox = true
        }
      },
      // 确认支付
      surePay () {
        this.handlePay()
      },
      // 支付 type  scan扫一扫 rmb人民币  alipay支付宝  wechat微信
      handlePay () {
        this.loading = this.$loading({
          lock: true,
          text: '结算中...',
          background: 'rgba(0, 0, 0, 0.5)'
        })
        let login_info = this.login_info
        let payType = this.payType
        switch (payType) {
          case 'scan':
            var amount = {
              pay_way: 'scan',
              trade_amount: Number(this.trade_amount.toFixed(2)), // 应收金额
              total_amount: Number(this.trade_amount.toFixed(2)), // 实收金额
              reduce_amount: 0// 找零
            }
            break
          case 'rmb':
            var amount = {
              pay_way: 'scan',
              trade_amount: Number(this.trade_amount.toFixed(2)), // 应收金额
              total_amount: Number(this.trade_amount.toFixed(2)), // 实收金额
              reduce_amount: Number((this.total_amount - this.trade_amount).toFixed(1))// 找零
            }
            break
          case 'alipay':
            var amount = {
              pay_way: 'scan',
              trade_amount: Number(this.trade_amount.toFixed(2)), // 应收金额
              total_amount: Number(this.trade_amount.toFixed(2)), // 实收金额
              reduce_amount: 0// 找零
            }
            break
        }
        let params = {
  
          ...amount,
          store_id: login_info.store_id,
          auth_code: this.payCode,
          cart_id: this.cart_id,
          cashier_id: login_info.store_id,
          assistant_id: this.defaultAssistant,
          order_item: this.cartList,
          machine_no: login_info.machine_no
        }
        common.ajax({
          url: '/trade/submit.do',
          params: params,
          success: (data) => {
            if (data.code == 200) {
              if (data.pay_status == 'pay_failed') {
                this.$alert(data.msg, '提示', {
                  confirmButtonText: '确定'
                })
              } else {
                this.trade_no = data.trade_no
                setTimeout(() => {
                  this.getTradeState()
                }, 2000)
              }
            } else {
              this.$alert('支付失败', '提示', {
                confirmButtonText: '确定'
              })
            }
          }
        })
      },
      // 确认支付成功后轮询调用确认支付结果
      getTradeState () {
        let params = {
          channel: this.payType,
          pay_way: this.payType,
          machine_no: this.login_info.machine_no,
          store_id: this.login_info.store_id,
          trade_no: this.trade_no
        }
        common.ajax({
          url: '/pay/confirm.do',
          params: params,
          noloading: true,
          success: (data) => {
            if (data.code == 200) {
              if (this.test == 6) {
                this.loading.close()
                this.showPayBox = false
                this.$message.error({message: '支付失败'})
                this.test = 0
                return false
              } else if (data.status == 'WAIT_BUYER_PAY') {
                this.loading.close()
                this.loading = this.$loading({
                  lock: true,
                  text: `(等待用户确认...${this.test})`,
                  background: 'rgba(0, 0, 0, 0.5)'
                })
                setTimeout(() => {
                  this.test += 1
                  this.getTradeState()
                }, 5000)
              } else if (data.status == 'pay_success') {
                this.loading.close()
                this.showPayBox = false
                this.$message({message: '支付成功', type: 'success'})
                this.getBeforeOrder()
                this.getCartList()
                this.test = 0
              }
            }
          }
        })
      },
  
      // 查找商品
      searchGoods () {
        var login_info = this.login_info
        let params = {
          store_id: login_info.store_id,
          text_value: this.goodsCode
        }
        common.ajax({
          url: '/goods/list.do',
          params: params,
          noloading: true,
          success: (data) => {
            if (data.code == 200) {
              console.log(data.data)
              if (data.data.length == 1) {
                this.handleAddGoods(data.data[0])
              } else {
                this.searchList = data.data
                this.dialogTableVisible = true
              }
            }
          }
        })
      },
      // 添加商品
      handleAddGoods (item) {
        var login_info = this.login_info
        let params = {
          title: item.title,
          cashier_id: login_info.cashier_id, // 收银员id
          machine_no: login_info.machine_no, // 机器号
          store_id: login_info.store_id, // 门店id
          store_sku_id: item.skuId, // 商品id
          sale_price: item.sale_price, // 销售价格
          vip_price: ''// 会员价格
        }
        common.ajax({
          url: '/cart/add.do',
          params: params,
          success: (data) => {
            if (data.code == 200) {
              this.cart_id = data.cart_id
              this.getCartList(data.cart_id)
            }
          }
        })
      },
      // 初始化购物车
      getCartList (cart_id) {
        if (!cart_id) {
          cart_id = this.cart_id
        }
        var login_info = this.login_info
        let params = {
          store_id: login_info.store_id,
          cart_id: cart_id
        }
        common.ajax({
          url: '/cart/show.do',
          params: params,
          noloading: true,
          success: (data) => {
            if (data.code == 200) {
              this.cartList = data.skus
              this.handleGoodsSalePrice(data.skus)
              if (this.dialogTableVisible) {
                this.closeGoodsBox()
              }
            }
          }
        })
      },
      // 改变商品数量
      handleChangeNum (item) {
        this.$nextTick(() => {
          var params = {
            cart_id: this.cart_id,
            sku_id: item.sku_id,
            num: item.num
          }
          common.ajax({
            url: '/cart/mergeNum.do',
            params: params,
            noloading: true,
            success: (data) => {
              if (data.code == 200) {
                this.getCartList()
              }
            }
          })
        })
      },
      // 计算找零
      changeTotal () {
        this.reduce_amount = Number((this.total_amount - this.trade_amount).toFixed(1))
      },
      // 删除单独商品
      handleDeleteGoods () {
        this.$confirm('是否删除该商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sureDelete()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 确认删除
      sureDelete () {
        var cart_id = this.cart_id
        common.ajax({
          url: '/cart/del.do',
          params: {sku_id: this.goodsInfo.sku_id, cart_id: cart_id},
          success: (data) => {
            if (data.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getCartList(cart_id)
            }
          }
        })
      },
      // 清空购物车
      clearCart () {
        var cart_id = this.cart_id
        common.ajax({
          url: '/cart/clear.do',
          params: {cart_id: cart_id},
          success: (data) => {
            if (data.code == 200) {
              this.$message('清空成功')
              this.getCartList(cart_id)
            }
          }
        })
      },
      // 挂单
      putUpCart () {
        if (this.cartList.length == 0) {
          this.$message('挂单失败,购物车不能为空')
          return false
        }
        var login_info = this.login_info
        var params = {
          cart_id: this.cart_id,
          machine_no: login_info.machine_no,
          store_id: login_info.store_id
        }
        common.ajax({
          url: '/cart/suspend.do',
          params: params,
          success: (data) => {
            if (data.code == 200) {
              this.cartList = []
              this.$store.commit('changeputUpCartNum', data.num)
              this.$message('挂单成功')
            } else {
              this.$message('挂单失败')
            }
          }
        })
      },
      // 取单
      getUpCart () {
        var login_info = this.login_info
        var params = {
          machine_no: login_info.machine_no,
          store_id: login_info.store_id
        }
        common.ajax({
          url: '/cart/suspend/list.do',
          params: params,
          success: (data) => {
            if (data.code == 200) {
              this.$refs.showUpCart.showUpCart(data.items)
            }
          }
        })
      },
      // 打折 区分单品还是整单打折
      discountGoods (type) {
        if (type == 'single') {
          this.discountSingle = true
        } else {
          this.discountSingle = false
        }
        this.discountShow = true
        this.discountNum = ''
      },
      // 确认打折
      handleDiscount () {
        if (this.discountSingle) {
          this.discountRate()
        } else {
          this.discountAmount()
        }
      },
      // 单品打折
      discountRate () {
        var goodsItem = this.goodsItem
        console.log(goodsItem)
        var discountNum = this.discountNum
        var login_info = this.login_info
        var params = {
          store_id: login_info.store_id,
          cart_id: this.cart_id,
          amount: this.radio == 'amount' ? discountNum : '',
          rate: this.radio == 'rate' ? discountNum : '',
          store_sku_id: goodsItem.sku_id
        }
        common.ajax({
          url: '/cart/discount/single.do',
          params: params,
          success: (data) => {
            if (data.code == 200) {
              this.getCartList()
              this.$message('打折成功')
              this.discountShow = false
            }
          }
        })
      },
      // 全部打折
      discountAmount () {
        console.log(this.cart_id)
        var discountNum = this.discountNum
        var login_info = this.login_info
        var params = {
          store_id: login_info.store_id,
          cart_id: this.cart_id,
          amount: this.radio == 'amount' ? discountNum : '',
          rate: this.radio == 'rate' ? discountNum : ''
        }
        common.ajax({
          url: '/cart/discount/all.do',
          params: params,
          success: (data) => {
            if (data.code == 200) {
              this.getCartList()
              this.$message('打折成功')
              this.discountShow = false
            }
          }
        })
      },
      // 计算商品总价
      handleGoodsSalePrice (data) {
        console.log('+', data)
        var priceArr = []
        var numArr = []
        var dealArr = []
        for (var i = 0; i < data.length; i++) {
          priceArr.push(data[i].sale_price * data[i].num)
        }
        for (var i = 0; i < data.length; i++) {
          dealArr.push(data[i].deal_price * data[i].num)
        }
        for (var i = 0; i < data.length; i++) {
          numArr.push(data[i].num)
        }
        console.log('--', common.sum(priceArr))
        this.goodsSalePrice = common.sum(priceArr)
        this.trade_amount = common.sum(dealArr)
        this.goodsNum = common.sum(numArr)
      },
      // 关闭商品列表弹窗
      closeGoodsBox () {
        this.dialogTableVisible = false
        this.goodsCode = ''
      },
      // 点击选择当前商品
      handleCurrentChange (item) {
        this.goodsItem = item
      },
      // 打开会员搜索弹窗
      openMemeber () {
        this.$refs.memberSearch.openMemeberPopup(this.login_info)
      },
      changeInput () {
  
      }
    }
  }
</script>
