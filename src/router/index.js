import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'

const Login = () => 
      import ('@/components/login.vue')
const Home = () => 
      import ('@/components/home.vue')
const User = () => 
      import ('@/components/users.vue')
const Rights = () => 
      import ('@/components/rights.vue')
const Roles = () => 
      import ('@/components/roles.vue')
const Goods = () => 
      import ('@/components/goods.vue')
const Goodsadd = () => 
      import ('@/components/goodsadd.vue')
const Params = () => 
      import ('@/components/params.vue')
const Categories = () => 
      import ('@/components/categories.vue')
const Order = () => 
      import ('@/components/orders.vue')
const Reports = () => 
      import ('@/components/reports.vue')

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
    }, {
      path: '/params',
      component: Params
    }, {
      path: '/categories',
      component: Categories
    }, {
      path: '/orders',
      component: Order
    }, {
      path: '/reports',
      component: Reports
    }]
  }, {
    path: '/login',
    component: Login
  }]
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