import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import User from '@/components/users.vue'
Vue.use(Router)

export default new Router({
  routes: [ {
    name: 'home',
    path: '/',
    component: Home,
    children: [{
      path: 'users',
      component: User
    }]
  }, {
    path: '/login',
    component: Login
  }
  ]
})
