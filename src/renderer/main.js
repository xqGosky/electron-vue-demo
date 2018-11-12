// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'// 兼容IE 、、
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import md5 from 'js-md5'
/** 使用Vuex**/
import Vuex from 'vuex'
import commonState from './commonState'
// 引用common
import './assets/js/common.js'
// Object.assign(Vue.prototype, {'$eventEmitor': new Vue()})
/** **自定义的組件*****/
import {
  Paginate,
  UploadImg,
  UploadVideo,
  RichText,
  UploadMutiImg,
  AutoComplete
} from './components/common'
Vue.use(Vuex)
const store = new Vuex.Store(commonState)
Vue.use(ElementUI)
Vue.use(Paginate)
Vue.use(UploadImg)
Vue.use(UploadVideo)
Vue.use(RichText)
Vue.use(UploadMutiImg)
Vue.use(AutoComplete)

/** **自定义的組件*****/
Vue.prototype.$md5 = md5
Vue.config.productionTip = false
window.router = router
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
