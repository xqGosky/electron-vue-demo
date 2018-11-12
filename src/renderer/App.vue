<template>
  <div id="app">
    <div class="main-content" >
      <div class="left-nav">
        <div class='logo'>
          <img src="../static/images/icons.png" alt="">
        </div>
        <ul>
          <li v-for="n in sidebarList" @click="handleSilde(n.type)" :class="currentSelect == n.type? 'active': ''">
            <i class="iconfont" :class="n.icon"></i>
            <p>{{n.name}}</p>
          </li>
        </ul>
      </div>
      <div class="right-content">
        <router-view/>
      </div>
    </div>
    <SrarchPopup ref="changeMoldeState"></SrarchPopup>
  </div>
</template>
<script>
  import SrarchPopup from '@/components/Search/index.vue' // 会员搜索弹窗
  export default {
    name: 'App',
    data () {
      return {
        sidebarList: [
          {name: '收银', type: 'cart', icon: 'icon-goumaiyemiande-jiarugouwuche'},
          {name: '查询', type: 'search', icon: 'icon-chaxun'},
          {name: '退款', type: 'Refund', icon: 'icon-jinbi'},
          {name: '设置', type: 'Setting', icon: 'icon-iconfonticonfontjixieqimo'},
          {name: '登入后台', type: 'Admin', icon: 'icon-houtaiyonghuguanli'}
        ],
        currentSelect: 'cart',
        login_info: {}
      }
  },
    components: {
      SrarchPopup
    },
    mounted () {
      this.login_info = JSON.parse(localStorage.getItem('login_info'))
      // 获取挂起的订单数量
      this.getPutCartNum()
  },
    methods: {
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
              this.$store.commit('changeputUpCartNum', data.num)
            }
          }
        })
      },
  
      handleSilde (type) {
        this.currentSelect = type
        switch (type) {
          case 'cart':
            router.push('/cart')
            break
          case 'search':
            // router.push('/search')
            this.$refs.changeMoldeState.showSearchBox()
            break
          case 'Refund':
            router.push('/refund')
            break
          case 'Setting':
            router.push('/setting')
            break
          case 'Admin':
            router.push('/enter-admin')
            break
        }
      }
  
    }
  }
</script>

<style lang="less">
  @import "./assets/less/entry.less";
</style>
