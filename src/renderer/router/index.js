import Vue from 'vue'
import Router from 'vue-router'
import * as ROUTE from './import'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/index'},
    // 登入
    {
      path: '/index',
      name: 'Login',
      component: ROUTE.Login
    },
    // 购物车
    {
      path: '/cart',
      name: 'Cart',
      component: ROUTE.Cart
    },
    // 查询
    // {
    //   path: '/search',
    //   name: 'Search',
    //   component: ROUTE.Search
    // },
    {
      path: '/refund',
      name: 'Refund',
      component: ROUTE.Refund
    },
    {
      path: '/setting',
      name: 'Setting',
      component: ROUTE.Setting
    },
    {
      path: '/enter-admin',
      name: 'Admin',
      component: ROUTE.Admin
    }
  ]
})
