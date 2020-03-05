import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '@/components/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示将要访问的路径
  // from 表示从哪里来
  // next 是一个函数 表示放行
  // next() 放行    next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token 表示未登录 跳转到登录页面
  if (!tokenStr) return next('/login')
  // 有token 则放行
  next()
})

export default router
