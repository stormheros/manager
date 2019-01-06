// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import Http from '@/plugins/http'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/base.css'
import App from './App'
import router from './router'
import moment from 'moment'
import MyBread from '@/components/cusBread.vue'
Vue.component('my-bread', MyBread)
Vue.use(Http)
Vue.use(ElementUI)
Vue.filter('fmdata', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
