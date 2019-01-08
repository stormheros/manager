import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import User from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import { Message } from 'element-ui'
import Goods from '@/components/goods.vue'
import Goodsadd from '@/components/goodsadd.vue'
Vue.use(Router)

const router = new Router({
  routes: [ {
    name: 'home',
    path: '/',
    component: Home,
    children: [{
      path: 'users',
      component: User
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/goods',
      component: Goods
    }, {
      path: '/goodsadd',
      component: Goodsadd
    } ]
  }, {
    path: '/login',
    component: Login
  }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    if (!localStorage.getItem('token')) {
      Message.warning('请登陆后重试')
      router.push({
        path: 'login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router